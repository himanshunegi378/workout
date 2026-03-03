"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import type { PRType } from "@/lib/pr-utils";

// ── Types ──────────────────────────────────────────────────────────────────

interface PRCelebrationState {
    isVisible: boolean;
    prType: PRType | null;
    exerciseName: string;
}

interface PRCelebrationContextValue {
    celebration: PRCelebrationState;
    celebrate: (prType: PRType, exerciseName: string) => void;
    dismiss: () => void;
}

// ── Context ────────────────────────────────────────────────────────────────

const PRCelebrationContext = createContext<PRCelebrationContextValue | null>(null);

const INITIAL: PRCelebrationState = { isVisible: false, prType: null, exerciseName: "" };

const AUTO_DISMISS_MS = 4000;

// ── Provider ───────────────────────────────────────────────────────────────

export function PRCelebrationProvider({ children }: { children: React.ReactNode }) {
    const [celebration, setCelebration] = useState<PRCelebrationState>(INITIAL);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const celebrate = useCallback((prType: PRType, exerciseName: string) => {
        // Clear any previous auto-dismiss so consecutive PRs reset the timer
        if (timerRef.current) clearTimeout(timerRef.current);

        setCelebration({ isVisible: true, prType, exerciseName });

        timerRef.current = setTimeout(() => setCelebration(INITIAL), AUTO_DISMISS_MS);
    }, []);

    const dismiss = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setCelebration(INITIAL);
    }, []);

    return (
        <PRCelebrationContext.Provider value={{ celebration, celebrate, dismiss }}>
            {children}
        </PRCelebrationContext.Provider>
    );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function usePRCelebration(): PRCelebrationContextValue {
    const ctx = useContext(PRCelebrationContext);
    if (!ctx) {
        throw new Error("usePRCelebration must be used inside <PRCelebrationProvider>");
    }
    return ctx;
}
