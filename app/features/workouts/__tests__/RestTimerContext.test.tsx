import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { RestTimerProvider, useRestTimer } from "../contexts/RestTimerContext";
import React from "react";

// Mock Notification
const mockNotification = vi.fn();
// @ts-expect-error Mocking global Notification
global.Notification = mockNotification;
// @ts-expect-error Mocking global Notification
global.Notification.permission = "granted";
global.Notification.requestPermission = vi.fn();

const TestComponent = () => {
    const { timeLeft, isRunning, isActive, startTimer, pauseTimer, resumeTimer, addTime, stopTimer } = useRestTimer();
    return (
        <div>
            <div data-testid="time">{timeLeft}</div>
            <div data-testid="active">{isActive.toString()}</div>
            <div data-testid="running">{isRunning.toString()}</div>
            <button onClick={() => startTimer(60, { closeOnFinish: false })}>Start 60s</button>
            <button onClick={() => startTimer(10, { closeOnFinish: true })}>Start 10s Close</button>
            <button onClick={pauseTimer}>Pause</button>
            <button onClick={resumeTimer}>Resume</button>
            <button onClick={() => addTime(30)}>Add 30s</button>
            <button onClick={stopTimer}>Stop</button>
        </div>
    );
};

describe("RestTimerContext", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2024-03-01T12:00:00Z"));
        mockNotification.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("AC1 & AC7: should stay accurate even if time jumps (simulating background/visibility shift)", async () => {
        render(
            <RestTimerProvider>
                <TestComponent />
            </RestTimerProvider>
        );

        await act(async () => {
            screen.getByText("Start 60s").click();
        });

        expect(screen.getByTestId("time").textContent).toBe("60");

        // Simulate app minimized/inactive for 30s by jumping system time
        await act(async () => {
            vi.setSystemTime(new Date("2024-03-01T12:00:30Z"));
            // Force a re-render/interval tick
            vi.advanceTimersByTime(1000);
        });

        // Should reflect the 30s jump + 1s tick
        const time = Number(screen.getByTestId("time").textContent);
        expect(time).toBeLessThanOrEqual(30);
        expect(time).toBeGreaterThanOrEqual(29);
    });

    it("AC2: should detect completion immediately after visibility restoration if duration elapsed", async () => {
        render(
            <RestTimerProvider>
                <TestComponent />
            </RestTimerProvider>
        );

        await act(async () => {
            screen.getByText("Start 10s Close").click();
        });

        // Jump time past 10s
        await act(async () => {
            vi.setSystemTime(new Date("2024-03-01T12:00:15Z"));
            // Trigger visibility change
            Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
            document.dispatchEvent(new Event('visibilitychange'));
            vi.advanceTimersByTime(100);
        });

        expect(screen.getByTestId("active").textContent).toBe("false");
        expect(screen.getByTestId("time").textContent).toBe("0");
    });

    it("AC3: should trigger notification on completion", async () => {
        render(
            <RestTimerProvider>
                <TestComponent />
            </RestTimerProvider>
        );

        await act(async () => {
            screen.getByText("Start 10s Close").click();
        });

        await act(async () => {
            vi.advanceTimersByTime(11000);
        });

        expect(mockNotification).toHaveBeenCalledWith("Rest Finished", expect.any(Object));
    });

    it("AC4 & AC5: should handle pause and preserve state", async () => {
        render(
            <RestTimerProvider>
                <TestComponent />
            </RestTimerProvider>
        );

        await act(async () => {
            screen.getByText("Start 60s").click();
        });

        await act(async () => {
            vi.advanceTimersByTime(10000); // 50s left
        });

        await act(async () => {
            screen.getByText("Pause").click();
        });

        // Advance real world time by 30s while paused
        await act(async () => {
            vi.setSystemTime(new Date("2024-03-01T12:00:40Z"));
            vi.advanceTimersByTime(1000);
        });

        // Time left should still be around 50s
        expect(screen.getByTestId("time").textContent).toBe("50");

        await act(async () => {
            screen.getByText("Resume").click();
        });

        await act(async () => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.getByTestId("time").textContent).toBe("45");
    });

    it("AC6: should recover state from localStorage on initialization", async () => {
        const expiry = new Date("2024-03-01T12:01:00Z"); // 60s from start
        const state = {
            isActive: true,
            isRunning: true,
            isPaused: false,
            totalDuration: 60,
            closeOnFinish: false,
            expiryTimestamp: expiry.toISOString(),
            timeLeftAtPause: null
        };
        localStorage.setItem("@workout/rest-timer-state", JSON.stringify(state));

        render(
            <RestTimerProvider>
                <TestComponent />
            </RestTimerProvider>
        );

        // After hydration
        expect(screen.getByTestId("active").textContent).toBe("true");
        // Remaining time from 12:00:00 to 12:01:00 is 60s
        expect(screen.getByTestId("time").textContent).toBe("60");
    });

    it("EC6: should initialize as finished if persisted timestamp is in the past", async () => {
        const expiry = new Date("2024-03-01T11:59:00Z"); // 60s ago
        const state = {
            isActive: true,
            isRunning: true,
            isPaused: false,
            totalDuration: 60,
            closeOnFinish: true, // Should close if finished
            expiryTimestamp: expiry.toISOString(),
            timeLeftAtPause: null
        };
        localStorage.setItem("@workout/rest-timer-state", JSON.stringify(state));

        render(
            <RestTimerProvider>
                <TestComponent />
            </RestTimerProvider>
        );

        expect(screen.getByTestId("active").textContent).toBe("false");
        expect(screen.getByTestId("time").textContent).toBe("0");
    });
});
