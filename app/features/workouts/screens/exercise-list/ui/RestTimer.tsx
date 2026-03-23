"use client";

import { Play, Pause, X, Minus, Plus } from "lucide-react";
import { Button, Portal } from "@/app/components/ui";
import { useRestTimer } from "@/app/features/workouts/contexts/RestTimerContext";

/**
 * A persistent UI overlay for the active rest timer.
 * 
 * Context:
 * This component remains visible regardless of which part of the workout session 
 * the user is currently viewing, so they always know how long they have until 
 * their next set. It uses React Portals to ensure it sits on top of all other elements.
 * 
 * Why:
 * - Uninterrupted Flow: Allows users to scroll their exercise list or use other 
 *   app functions while the rest timer is active. 
 * - Effortless Control: Provides quick access to common rest timer adjustments 
 *   (e.g., adding or subtracting 30 seconds) and pausing/resuming. 
 * - Visual Alert: Pulses with color when the timer hits zero, providing an immediate 
 *   visual cue to the user.
 */
export function RestTimerOverlay() {
    const { isActive, timeLeft, isRunning, pauseTimer, resumeTimer, addTime, stopTimer } = useRestTimer();

    if (!isActive) return null;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const isComplete = timeLeft === 0;

    return (
        <Portal>
            <div className="pointer-events-none fixed inset-x-0 bottom-16 z-40 animate-slide-up p-4 md:inset-x-auto md:right-32 md:bottom-8">
                <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-3xl border border-border/70 bg-background/95 p-4 backdrop-blur-md md:w-80 pointer-events-auto">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Rest Timer
                        </span>
                        <button
                            onClick={stopTimer}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex gap-2">
                            <button
                                onClick={() => addTime(-30)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-muted/30 text-foreground transition-colors hover:bg-muted/60 active:scale-95"
                            >
                                <Minus className="w-4 h-4" />
                                <span className="sr-only">-30s</span>
                            </button>
                        </div>

                        <div className="text-center">
                            <div
                                className={`font-display text-5xl font-bold tracking-tight transition-colors ${isComplete ? "text-accent animate-pulse" : "text-foreground"
                                    }`}
                            >
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => addTime(30)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-muted/30 text-foreground transition-colors hover:bg-muted/60 active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
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
                                    <Pause className="w-4 h-4" /> Pause
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" /> Resume
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
