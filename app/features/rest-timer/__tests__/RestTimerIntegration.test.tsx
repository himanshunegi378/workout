import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PageShell } from "@/app/components/ui";
import { PageHeader, PageHeaderHostProvider } from "@/app/features/page-header";
import {
    RestTimerFloatingBubble,
    RestTimerHeaderActionBridge,
    RestTimerOverlay,
    RestTimerProvider,
    useRestTimer,
} from "..";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));

const mockNotification = vi.fn();
// @ts-expect-error test mock
global.Notification = mockNotification;
// @ts-expect-error test mock
global.Notification.permission = "granted";
global.Notification.requestPermission = vi.fn();

function TimerControls() {
    const {
        startTimer,
        pauseTimer,
        minimizeTimer,
        openTimer,
        isMinimized,
        isActive,
        timeLeft,
    } = useRestTimer();

    return (
        <div>
            <div data-testid="minimized">{isMinimized.toString()}</div>
            <div data-testid="active">{isActive.toString()}</div>
            <div data-testid="time-left">{timeLeft}</div>
            <button type="button" onClick={() => startTimer(60, { closeOnFinish: true })}>
                Start Default
            </button>
            <button type="button" onClick={() => startTimer(45, { closeOnFinish: true, startMinimized: false })}>
                Start Expanded
            </button>
            <button type="button" onClick={pauseTimer}>
                Pause
            </button>
            <button type="button" onClick={minimizeTimer}>
                Minimize
            </button>
            <button type="button" onClick={openTimer}>
                Open
            </button>
        </div>
    );
}

function TimerScreen({ withHeader = true }: { withHeader?: boolean }) {
    return (
        <PageHeaderHostProvider>
            <RestTimerProvider>
                <PageShell header={withHeader ? <PageHeader title="Workout" action={<button type="button">Add Exercise</button>} /> : undefined}>
                    {withHeader ? <RestTimerHeaderActionBridge /> : null}
                    <TimerControls />
                </PageShell>
                <RestTimerOverlay />
                <RestTimerFloatingBubble />
            </RestTimerProvider>
        </PageHeaderHostProvider>
    );
}

describe("RestTimer integration", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2024-03-01T12:00:00Z"));
        mockNotification.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("starts minimized by default and shows the timer in the page header", async () => {
        render(<TimerScreen />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /start default/i }));
        });

        expect(screen.getByTestId("minimized")).toHaveTextContent("true");
        expect(screen.getByRole("button", { name: /open rest timer with 1:00 remaining/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /add exercise/i })).toBeInTheDocument();
        expect(screen.queryByText("Rest Timer")).not.toBeInTheDocument();
    });

    it("opens the overlay from the header timer and can minimize it again", async () => {
        render(<TimerScreen />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /start default/i }));
        });
        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /open rest timer with 1:00 remaining/i }));
        });

        expect(screen.getByText("Rest Timer")).toBeInTheDocument();
        expect(screen.getByTestId("minimized")).toHaveTextContent("false");

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /minimize rest timer/i }));
        });

        expect(screen.queryByText("Rest Timer")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: /open rest timer with 1:00 remaining/i })).toBeInTheDocument();
        expect(screen.getByTestId("minimized")).toHaveTextContent("true");
    });

    it("keeps the header timer visible while paused", async () => {
        render(<TimerScreen />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /start default/i }));
        });
        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /pause/i }));
        });

        expect(screen.getByRole("button", { name: /open rest timer with 1:00 remaining/i })).toBeInTheDocument();
    });

    it("shows the floating bubble when minimized but no page header host is mounted", async () => {
        render(<TimerScreen withHeader={false} />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /start default/i }));
        });

        expect(screen.getByRole("button", { name: /open rest timer with 1:00 remaining/i })).toBeInTheDocument();
        expect(screen.queryByText("Rest Timer")).not.toBeInTheDocument();
    });

    it("opens the overlay from the floating bubble when no page header host is mounted", async () => {
        render(<TimerScreen withHeader={false} />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /start default/i }));
        });

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /open rest timer with 1:00 remaining/i }));
        });

        expect(screen.getByText("Rest Timer")).toBeInTheDocument();
    });

    it("replaces the active timer and honors the new expanded state", async () => {
        render(<TimerScreen />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /start default/i }));
        });
        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /start expanded/i }));
        });

        expect(screen.getByTestId("minimized")).toHaveTextContent("false");
        expect(screen.getByText("Rest Timer")).toBeInTheDocument();
    });

    it("removes the timer surfaces when the countdown finishes", async () => {
        render(<TimerScreen />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /start default/i }));
        });

        await act(async () => {
            vi.advanceTimersByTime(61000);
        });

        expect(screen.getByTestId("active")).toHaveTextContent("false");
        expect(screen.queryByRole("button", { name: /open rest timer with/i })).not.toBeInTheDocument();
        expect(screen.queryByText("Rest Timer")).not.toBeInTheDocument();
    });

    it("removes the header action when the timer is stopped manually", async () => {
        render(<TimerScreen />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /start default/i }));
        });

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /open rest timer with 1:00 remaining/i }));
        });

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /stop rest timer/i }));
        });

        expect(screen.queryByRole("button", { name: /open rest timer with/i })).not.toBeInTheDocument();
        expect(screen.queryByText("Rest Timer")).not.toBeInTheDocument();
    });

    it("unregisters the header action when the workout page unmounts", async () => {
        const { rerender } = render(<TimerScreen />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /start default/i }));
        });

        expect(screen.getByRole("button", { name: /open rest timer with 1:00 remaining/i })).toBeInTheDocument();

        rerender(
            <PageHeaderHostProvider>
                <RestTimerProvider>
                    <div>Other page</div>
                    <RestTimerOverlay />
                    <RestTimerFloatingBubble />
                </RestTimerProvider>
            </PageHeaderHostProvider>
        );

        expect(screen.queryByRole("button", { name: /open rest timer with 1:00 remaining/i })).toBeInTheDocument();
        expect(screen.queryByText("Add Exercise")).not.toBeInTheDocument();
    });

    it("restores the minimized state from persisted storage", () => {
        const expiry = new Date("2024-03-01T12:01:00Z");
        localStorage.setItem("@workout/rest-timer-state", JSON.stringify({
            isActive: true,
            isRunning: true,
            isPaused: false,
            totalDuration: 60,
            closeOnFinish: true,
            expiryTimestamp: expiry.toISOString(),
            timeLeftAtPause: null,
            isMinimized: false,
        }));

        render(<TimerScreen />);

        expect(screen.getByTestId("minimized")).toHaveTextContent("false");
        expect(screen.getByText("Rest Timer")).toBeInTheDocument();
    });
});
