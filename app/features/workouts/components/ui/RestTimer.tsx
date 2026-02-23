"use client";

import { useState, useEffect } from "react";
import { Play, Pause, X, RotateCcw, Minus, Plus } from "lucide-react";
import { Button } from "@/app/components/ui";

interface RestTimerProps {
    isOpen: boolean;
    durationSeconds: number;
    onClose: () => void;
}

export function RestTimer({ isOpen, durationSeconds, onClose }: RestTimerProps) {
    const [timeLeft, setTimeLeft] = useState(durationSeconds);
    const [isRunning, setIsRunning] = useState(true);

    // Reset when opened with a new duration
    useEffect(() => {
        if (isOpen) {
            setTimeLeft(durationSeconds);
            setIsRunning(true);
        }
    }, [isOpen, durationSeconds]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isOpen && isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            // Optional: Play a sound here
        }
        return () => clearInterval(interval);
    }, [isOpen, isRunning, timeLeft]);

    if (!isOpen) return null;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const addTime = (amount: number) => {
        setTimeLeft((prev) => Math.max(0, prev + amount));
    };

    const isComplete = timeLeft === 0;

    return (
        <div className="fixed inset-x-0 bottom-16 sm:bottom-0 p-4 z-40 animate-slide-up pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto bg-card border border-border rounded-2xl p-4 shadow-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Rest Timer
                    </span>
                    <button
                        onClick={onClose}
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
                        onClick={() => setIsRunning(!isRunning)}
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
                    <Button variant="danger" onClick={onClose} className="w-full">
                        Skip
                    </Button>
                </div>
            </div>
        </div>
    );
}
