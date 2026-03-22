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
            <div className="fixed inset-x-0 md:inset-x-auto md:right-32 bottom-16 md:bottom-8 p-4 z-40 animate-slide-up pointer-events-none">
                <div className="w-full max-w-md mx-auto md:w-80 pointer-events-auto bg-card border border-border rounded-2xl p-4 shadow-2xl flex flex-col gap-4">
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

                    <div className="flex items-center justify-between">
                        {/* Controls Left */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => addTime(-30)}
                                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors active:animate-press"
                            >
                                <Minus className="w-4 h-4" />
                                <span className="sr-only">-30s</span>
                            </button>
                        </div>

                        {/* Timer Display */}
                        <div className="text-center">
                            <div
                                className={`font-display text-5xl font-bold tracking-tight transition-colors ${isComplete ? "text-accent animate-pulse" : "text-foreground"
                                    }`}
                            >
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        {/* Controls Right */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => addTime(30)}
                                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors active:animate-press"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="sr-only">+30s</span>
                            </button>
                        </div>
                    </div>

                    {/* Primary Actions */}
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <Button
                            variant={isRunning ? "secondary" : "primary"}
                            onClick={isRunning ? pauseTimer : resumeTimer}
                            className="w-full"
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
                        <Button variant="danger" onClick={stopTimer} className="w-full">
                            Skip
                        </Button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
