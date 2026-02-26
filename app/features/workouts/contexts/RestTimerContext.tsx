"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

interface RestTimerContextValue {
    isActive: boolean;
    timeLeft: number;
    totalDuration: number;
    isRunning: boolean;
    startTimer: (seconds: number, options: { closeOnFinish?: boolean }) => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    addTime: (seconds: number) => void;
    stopTimer: () => void;
}

const RestTimerContext = createContext<RestTimerContextValue | null>(null);

export function RestTimerProvider({ children }: { children: React.ReactNode }) {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const [closeOnFinish, setCloseOnFinish] = useState(false);

    // Keep a ref so the interval always sees the latest timeLeft without re-creating
    const timeLeftRef = useRef(timeLeft);
    useEffect(() => {
        timeLeftRef.current = timeLeft;
    }, [timeLeft]);

    useEffect(() => {
        if (!isActive || !isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsRunning(false);
                    if (closeOnFinish) {
                        setIsActive(false);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, isRunning, closeOnFinish]);

    const startTimer = useCallback((seconds: number, options: { closeOnFinish?: boolean }) => {
        setTotalDuration(seconds);
        setTimeLeft(seconds);
        setCloseOnFinish(options.closeOnFinish || false);
        setIsRunning(true);
        setIsActive(true);
    }, []);

    const pauseTimer = useCallback(() => {
        setIsRunning(false);
    }, []);

    const resumeTimer = useCallback(() => {
        if (isActive && timeLeftRef.current > 0) {
            setIsRunning(true);
        }
    }, [isActive]);

    const addTime = useCallback((seconds: number) => {
        setTimeLeft((prev) => Math.max(0, prev + seconds));
    }, []);

    const stopTimer = useCallback(() => {
        setIsActive(false);
        setIsRunning(false);
        setTimeLeft(0);
        setTotalDuration(0);
        setCloseOnFinish(false);
    }, []);

    return (
        <RestTimerContext.Provider
            value={{
                isActive,
                timeLeft,
                totalDuration,
                isRunning,
                startTimer,
                pauseTimer,
                resumeTimer,
                addTime,
                stopTimer,
            }}
        >
            {children}
        </RestTimerContext.Provider>
    );
}

export function useRestTimer(): RestTimerContextValue {
    const ctx = useContext(RestTimerContext);
    if (!ctx) {
        throw new Error("useRestTimer must be used inside <RestTimerProvider>");
    }
    return ctx;
}
