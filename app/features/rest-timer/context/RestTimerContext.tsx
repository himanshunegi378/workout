"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTimer } from "react-timer-hook";

interface RestTimerContextValue {
    isActive: boolean;
    timeLeft: number;
    totalDuration: number;
    isRunning: boolean;
    isMinimized: boolean;
    startTimer: (seconds: number, options?: { closeOnFinish?: boolean; startMinimized?: boolean }) => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    addTime: (seconds: number) => void;
    stopTimer: () => void;
    openTimer: () => void;
    minimizeTimer: () => void;
}

interface TimerState {
    isActive: boolean;
    totalDuration: number;
    closeOnFinish: boolean;
    isPaused: boolean;
    isMinimized: boolean;
    initialized: boolean;
    expiryTimestamp: Date;
}

interface PersistedState {
    isActive: boolean;
    isRunning: boolean;
    isPaused: boolean;
    totalDuration: number;
    closeOnFinish: boolean;
    expiryTimestamp: string | null;
    timeLeftAtPause: number | null;
    isMinimized: boolean;
}

const STORAGE_KEY = "@workout/rest-timer-state";
const RestTimerContext = createContext<RestTimerContextValue | null>(null);

export function RestTimerProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<TimerState>(() => {
        const initialState = {
            isActive: false,
            totalDuration: 0,
            closeOnFinish: false,
            isPaused: false,
            isMinimized: true,
            initialized: false,
            expiryTimestamp: new Date(),
        };

        if (typeof window === "undefined") return initialState;

        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return { ...initialState, initialized: true };

        try {
            const persisted: PersistedState = JSON.parse(saved);
            let expiry = new Date();
            let finalIsActive = persisted.isActive;

            if (persisted.isActive) {
                if (persisted.isRunning && persisted.expiryTimestamp) {
                    expiry = new Date(persisted.expiryTimestamp);
                    if (expiry <= new Date()) {
                        expiry = new Date();
                        finalIsActive = false;
                    }
                } else if (persisted.isPaused && persisted.timeLeftAtPause !== null) {
                    expiry = new Date();
                    expiry.setSeconds(expiry.getSeconds() + persisted.timeLeftAtPause);
                }
            }

            return {
                isActive: finalIsActive,
                totalDuration: persisted.totalDuration,
                closeOnFinish: persisted.closeOnFinish,
                isPaused: persisted.isPaused,
                isMinimized: persisted.isMinimized ?? true,
                initialized: true,
                expiryTimestamp: expiry,
            };
        } catch (err) {
            console.error("Failed to restore timer state", err);
            return { ...initialState, initialized: true };
        }
    });

    const [notified, setNotified] = useState(false);

    const resetTimerState = useCallback((overrides?: Partial<TimerState>) => {
        setState({
            isActive: false,
            totalDuration: 0,
            closeOnFinish: false,
            isPaused: false,
            isMinimized: true,
            initialized: true,
            expiryTimestamp: new Date(),
            ...overrides,
        });
    }, []);

    const triggerNotification = useCallback(() => {
        if (!notified && "Notification" in window && Notification.permission === "granted") {
            const notification = new Notification("Rest Finished", {
                body: "Time to start your next set!",
                icon: "/favicon.ico",
                tag: "rest-timer-finished",
                requireInteraction: true,
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
        resetTimerState();
        setNotified(false);
        localStorage.removeItem(STORAGE_KEY);
    }, [resetTimerState, triggerNotification]);

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
    const syncedRef = useRef(false);

    useEffect(() => {
        if (syncedRef.current) return;
        syncedRef.current = true;

        if (state.isActive) {
            if (!state.isPaused && state.expiryTimestamp > new Date()) {
                restart(state.expiryTimestamp, true);
            } else {
                restart(state.expiryTimestamp, false);
                if (!state.isPaused && state.expiryTimestamp <= new Date()) {
                    setTimeout(() => onExpire(), 0);
                }
            }
        }
    }, [restart, state.isActive, state.isPaused, state.expiryTimestamp, onExpire]);

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
            isMinimized: state.isMinimized,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    }, [state, isRunning, timeLeft]);

    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible" && state.isActive && state.expiryTimestamp < new Date()) {
                onExpire();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [state.isActive, state.expiryTimestamp, onExpire]);

    const startTimer = useCallback((seconds: number, options: { closeOnFinish?: boolean; startMinimized?: boolean } = {}) => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + seconds);

        setState({
            isActive: true,
            totalDuration: seconds,
            closeOnFinish: options.closeOnFinish || false,
            isPaused: false,
            isMinimized: options.startMinimized ?? true,
            initialized: true,
            expiryTimestamp: time,
        });

        setNotified(false);
        restart(time, true);
    }, [restart]);

    const pauseTimer = useCallback(() => {
        pause();
        setState((prev) => ({ ...prev, isPaused: true }));
    }, [pause]);

    const resumeTimer = useCallback(() => {
        if (state.isActive && timeLeft > 0) {
            const time = new Date();
            time.setSeconds(time.getSeconds() + timeLeft);
            setState((prev) => ({ ...prev, isPaused: false, expiryTimestamp: time }));
            restart(time, true);
        }
    }, [state.isActive, timeLeft, restart]);

    const addTime = useCallback((secondsToAdd: number) => {
        const newTimeLeft = Math.max(0, timeLeft + secondsToAdd);
        const time = new Date();
        time.setSeconds(time.getSeconds() + newTimeLeft);
        setState((prev) => ({ ...prev, expiryTimestamp: time }));
        restart(time, isRunning);

        if (newTimeLeft === 0 && isRunning) {
            onExpire();
        }
    }, [timeLeft, restart, isRunning, onExpire]);

    const stopTimer = useCallback(() => {
        resetTimerState();
        setNotified(false);
        restart(new Date(), false);
        localStorage.removeItem(STORAGE_KEY);
    }, [resetTimerState, restart]);

    const openTimer = useCallback(() => {
        setState((prev) => ({ ...prev, isMinimized: false }));
    }, []);

    const minimizeTimer = useCallback(() => {
        setState((prev) => ({ ...prev, isMinimized: true }));
    }, []);

    return (
        <RestTimerContext.Provider
            value={{
                isActive: state.isActive,
                timeLeft,
                totalDuration: state.totalDuration,
                isRunning,
                isMinimized: state.isMinimized,
                startTimer,
                pauseTimer,
                resumeTimer,
                addTime,
                stopTimer,
                openTimer,
                minimizeTimer,
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
