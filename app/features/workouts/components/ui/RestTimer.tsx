"use client";

import { Play, Pause, X, Minus, Plus } from "lucide-react";
import { Button, Portal } from "@/app/components/ui";
import { useRestTimer } from "@/app/features/workouts/contexts/RestTimerContext";

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
            <div className="fixed inset-x-0 bottom-16 sm:bottom-0 p-4 z-40 animate-slide-up pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto bg-card border border-border rounded-2xl p-4 shadow-2xl flex flex-col gap-4">
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
