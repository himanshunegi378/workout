import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RestTimerProvider, useRestTimer } from "..";

const mockNotification = vi.fn();
// @ts-expect-error Mocking global Notification
global.Notification = mockNotification;
// @ts-expect-error Mocking global Notification
global.Notification.permission = "granted";
global.Notification.requestPermission = vi.fn();

const TestComponent = () => {
    const {
        timeLeft,
        isRunning,
        isActive,
        isMinimized,
        startTimer,
        pauseTimer,
        resumeTimer,
        addTime,
        stopTimer,
        openTimer,
        minimizeTimer,
    } = useRestTimer();

    return (
        <div>
            <div data-testid="time">{timeLeft}</div>
            <div data-testid="active">{isActive.toString()}</div>
            <div data-testid="running">{isRunning.toString()}</div>
            <div data-testid="minimized">{isMinimized.toString()}</div>
            <button onClick={() => startTimer(60, { closeOnFinish: false })}>Start 60s</button>
            <button onClick={() => startTimer(10, { closeOnFinish: true })}>Start 10s Close</button>
            <button onClick={() => startTimer(30, { closeOnFinish: false, startMinimized: false })}>Start 30s Expanded</button>
            <button onClick={pauseTimer}>Pause</button>
            <button onClick={resumeTimer}>Resume</button>
            <button onClick={() => addTime(30)}>Add 30s</button>
            <button onClick={openTimer}>Open</button>
            <button onClick={minimizeTimer}>Minimize</button>
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

        await act(async () => {
            vi.setSystemTime(new Date("2024-03-01T12:00:30Z"));
            vi.advanceTimersByTime(1000);
        });

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

        await act(async () => {
            vi.setSystemTime(new Date("2024-03-01T12:00:15Z"));
            Object.defineProperty(document, "visibilityState", { value: "visible", writable: true });
            document.dispatchEvent(new Event("visibilitychange"));
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
            vi.advanceTimersByTime(10000);
        });

        await act(async () => {
            screen.getByText("Pause").click();
        });

        await act(async () => {
            vi.setSystemTime(new Date("2024-03-01T12:00:40Z"));
            vi.advanceTimersByTime(1000);
        });

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
        const expiry = new Date("2024-03-01T12:01:00Z");
        const state = {
            isActive: true,
            isRunning: true,
            isPaused: false,
            totalDuration: 60,
            closeOnFinish: false,
            expiryTimestamp: expiry.toISOString(),
            timeLeftAtPause: null,
            isMinimized: true,
        };
        localStorage.setItem("@workout/rest-timer-state", JSON.stringify(state));

        render(
            <RestTimerProvider>
                <TestComponent />
            </RestTimerProvider>
        );

        expect(screen.getByTestId("active").textContent).toBe("true");
        expect(screen.getByTestId("time").textContent).toBe("60");
    });

    it("EC6: should initialize as finished if persisted timestamp is in the past", async () => {
        const expiry = new Date("2024-03-01T11:59:00Z");
        const state = {
            isActive: true,
            isRunning: true,
            isPaused: false,
            totalDuration: 60,
            closeOnFinish: true,
            expiryTimestamp: expiry.toISOString(),
            timeLeftAtPause: null,
            isMinimized: true,
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

    it("defaults new timers to minimized mode", async () => {
        render(
            <RestTimerProvider>
                <TestComponent />
            </RestTimerProvider>
        );

        await act(async () => {
            screen.getByText("Start 60s").click();
        });

        expect(screen.getByTestId("minimized").textContent).toBe("true");
    });

    it("supports starting in expanded mode and toggling minimize state", async () => {
        render(
            <RestTimerProvider>
                <TestComponent />
            </RestTimerProvider>
        );

        await act(async () => {
            screen.getByText("Start 30s Expanded").click();
        });

        expect(screen.getByTestId("minimized").textContent).toBe("false");

        await act(async () => {
            screen.getByText("Minimize").click();
        });

        expect(screen.getByTestId("minimized").textContent).toBe("true");

        await act(async () => {
            screen.getByText("Open").click();
        });

        expect(screen.getByTestId("minimized").textContent).toBe("false");
    });

    it("treats persisted finished timers as inactive regardless of closeOnFinish", async () => {
        const expiry = new Date("2024-03-01T11:59:00Z");
        localStorage.setItem("@workout/rest-timer-state", JSON.stringify({
            isActive: true,
            isRunning: true,
            isPaused: false,
            totalDuration: 60,
            closeOnFinish: false,
            expiryTimestamp: expiry.toISOString(),
            timeLeftAtPause: null,
            isMinimized: true,
        }));

        render(
            <RestTimerProvider>
                <TestComponent />
            </RestTimerProvider>
        );

        expect(screen.getByTestId("active").textContent).toBe("false");
        expect(screen.getByTestId("time").textContent).toBe("0");
    });
});
