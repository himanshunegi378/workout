"use client";

import { Minimize2, Minus, Pause, Play, Plus } from "lucide-react";
import { Button, Portal } from "@/app/components/ui";
import { useRestTimer } from "../context/RestTimerContext";
import { formatTime } from "../lib/formatTime";

/**
 * Provides a modal-like experience for managing the rest period to ensure the
 * user does not miss their next set.
 */
export function RestTimerOverlay() {
    const {
        isActive,
        timeLeft,
        isRunning,
        isMinimized,
        pauseTimer,
        resumeTimer,
        addTime,
        stopTimer,
        minimizeTimer,
    } = useRestTimer();

    if (!isActive || isMinimized) return null;

    const isComplete = timeLeft === 0;

    return (
        <Portal>
            <div className="pointer-events-none fixed inset-x-0 bottom-16 z-40 animate-slide-up p-4 md:inset-x-auto md:right-32 md:bottom-8">
                <div className="pointer-events-auto mx-auto flex w-full max-w-md flex-col gap-4 rounded-3xl bg-background/95 p-4 backdrop-blur-md md:w-80">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                            Rest Timer
                        </span>
                        <button
                            onClick={minimizeTimer}
                            className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Minimize rest timer"
                        >
                            <Minimize2 className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex gap-2">
                            <button
                                onClick={() => addTime(-30)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/30 text-foreground transition-colors hover:bg-muted/60 active:scale-95"
                            >
                                <Minus className="h-4 w-4" />
                                <span className="sr-only">-30s</span>
                            </button>
                        </div>

                        <div className="text-center">
                            <div
                                className={`font-display text-5xl font-bold tracking-tight transition-colors ${
                                    isComplete ? "animate-pulse text-accent" : "text-foreground"
                                }`}
                            >
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => addTime(30)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/30 text-foreground transition-colors hover:bg-muted/60 active:scale-95"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">+30s</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Button
                            variant={isRunning ? "secondary" : "primary"}
                            onClick={isRunning ? pauseTimer : resumeTimer}
                            className="w-full shadow-none"
                        >
                            {isRunning ? (
                                <>
                                    <Pause className="h-4 w-4" /> Pause
                                </>
                            ) : (
                                <>
                                    <Play className="h-4 w-4" /> Resume
                                </>
                            )}
                        </Button>
                        <Button variant="danger" onClick={stopTimer} className="w-full shadow-none">
                            Skip
                        </Button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
