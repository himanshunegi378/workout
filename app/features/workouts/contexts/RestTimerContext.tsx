"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useTimer } from "react-timer-hook";

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

interface TimerState {
    isActive: boolean;
    totalDuration: number;
    closeOnFinish: boolean;
    isPaused: boolean;
    initialized: boolean;
    expiryTimestamp: Date;
}

const STORAGE_KEY = "@workout/rest-timer-state";

interface PersistedState {
    isActive: boolean;
    isRunning: boolean;
    isPaused: boolean;
    totalDuration: number;
    closeOnFinish: boolean;
    expiryTimestamp: string | null;
    timeLeftAtPause: number | null;
}

const RestTimerContext = createContext<RestTimerContextValue | null>(null);

export function RestTimerProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<TimerState>({
        isActive: false,
        totalDuration: 0,
        closeOnFinish: false,
        isPaused: false,
        initialized: false,
        expiryTimestamp: new Date(),
    });

    const [notified, setNotified] = useState(false);

    const triggerNotification = useCallback(() => {
        if (!notified && "Notification" in window && Notification.permission === "granted") {
            const notification = new Notification("Rest Finished", {
                body: "Time to start your next set!",
                icon: "/favicon.ico",
                tag: "rest-timer-finished",
                requireInteraction: true
            });
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
            setNotified(true);
        }
    }, [notified]);

    const onExpire = useCallback(() => {
        triggerNotification();
        if (state.closeOnFinish) {
            setState(prev => ({ ...prev, isActive: false }));
        }
    }, [state.closeOnFinish, triggerNotification]);

    const {
        seconds,
        minutes,
        isRunning,
        pause,
        restart,
    } = useTimer({
        expiryTimestamp: state.expiryTimestamp,
        onExpire,
        autoStart: false,
    });

    const timeLeft = state.isActive ? (minutes * 60 + seconds) : 0;

    // Load state from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const persisted: PersistedState = JSON.parse(saved);
                let expiry = new Date();
                let finalIsActive = persisted.isActive;

                if (persisted.isActive) {
                    if (persisted.isRunning && persisted.expiryTimestamp) {
                        expiry = new Date(persisted.expiryTimestamp);
                        if (expiry > new Date()) {
                            restart(expiry, true);
                        } else {
                            // Already finished in the past
                            expiry = new Date();
                            restart(expiry, false);
                            if (persisted.closeOnFinish) {
                                finalIsActive = false;
                            }
                        }
                    } else if (persisted.isPaused && persisted.timeLeftAtPause !== null) {
                        expiry = new Date();
                        expiry.setSeconds(expiry.getSeconds() + persisted.timeLeftAtPause);
                        restart(expiry, false);
                    }
                }

                setState({
                    isActive: finalIsActive,
                    totalDuration: persisted.totalDuration,
                    closeOnFinish: persisted.closeOnFinish,
                    isPaused: persisted.isPaused,
                    initialized: true,
                    expiryTimestamp: expiry,
                });
            } catch (err) {
                console.error("Failed to restore timer state", err);
                setState(prev => ({ ...prev, initialized: true }));
            }
        } else {
            setState(prev => ({ ...prev, initialized: true }));
        }
    }, [restart]);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (!state.initialized) return;

        const expiry = (isRunning || state.isPaused) ? state.expiryTimestamp.toISOString() : null;
        const persisted: PersistedState = {
            isActive: state.isActive,
            isRunning,
            isPaused: state.isPaused,
            totalDuration: state.totalDuration,
            closeOnFinish: state.closeOnFinish,
            expiryTimestamp: expiry,
            timeLeftAtPause: state.isPaused ? timeLeft : null,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    }, [state, isRunning, timeLeft]);

    // Request notification permission
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    // Handle visibility changes for reliability
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                // If the timer should have finished while we were away
                if (state.isActive && state.expiryTimestamp < new Date()) {
                    onExpire();
                }
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [state.isActive, state.expiryTimestamp, onExpire]);

    const startTimer = useCallback((seconds: number, options: { closeOnFinish?: boolean }) => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + seconds);
        setState({
            isActive: true,
            totalDuration: seconds,
            closeOnFinish: options.closeOnFinish || false,
            isPaused: false,
            initialized: true,
            expiryTimestamp: time,
        });
        setNotified(false);
        restart(time, true);
    }, [restart]);

    const pauseTimer = useCallback(() => {
        pause();
        setState(prev => ({ ...prev, isPaused: true }));
    }, [pause]);

    const resumeTimer = useCallback(() => {
        if (state.isActive && timeLeft > 0) {
            const time = new Date();
            time.setSeconds(time.getSeconds() + timeLeft);
            setState(prev => ({ ...prev, isPaused: false, expiryTimestamp: time }));
            restart(time, true);
        }
    }, [state.isActive, timeLeft, restart]);

    const addTime = useCallback((seconds: number) => {
        const newTimeLeft = Math.max(0, timeLeft + seconds);
        const time = new Date();
        time.setSeconds(time.getSeconds() + newTimeLeft);
        setState(prev => ({ ...prev, expiryTimestamp: time }));
        restart(time, isRunning);
        if (newTimeLeft === 0 && isRunning) {
            onExpire();
        }
    }, [timeLeft, restart, isRunning, onExpire]);

    const stopTimer = useCallback(() => {
        setState({
            isActive: false,
            totalDuration: 0,
            closeOnFinish: false,
            isPaused: false,
            initialized: true,
            expiryTimestamp: new Date(),
        });
        setNotified(false);
        restart(new Date(), false);
        localStorage.removeItem(STORAGE_KEY);
    }, [restart]);

    return (
        <RestTimerContext.Provider
            value={{
                isActive: state.isActive,
                timeLeft,
                totalDuration: state.totalDuration,
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
