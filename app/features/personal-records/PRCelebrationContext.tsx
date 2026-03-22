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

/**
 * A context provider that manages the state of Personal Record (PR) celebrations.
 * 
 * Context:
 * When a user hits a new PR (e.g., more weight or more reps than ever before), 
 * the app triggers a visual "celebration". This provider orchestrates that 
 * global state.
 * 
 * Why:
 * - Emotional Reward: Gym-goers value progress; acknowledging a PR instantly 
 *   reinforces positive behavior and motivates consistency.
 * - Global Access: Allows any component (like the ExerciseCard) to trigger 
 *   a celebration without knowing how or where it's displayed.
 * - Managed Lifecycle: Handles the "auto-dismiss" logic to ensure the UI 
 *   isn't cluttered indefinitely.
 */
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

/**
 * A custom hook to trigger or dismiss PR celebrations.
 */
export function usePRCelebration(): PRCelebrationContextValue {
    const ctx = useContext(PRCelebrationContext);
    if (!ctx) {
        throw new Error("usePRCelebration must be used inside <PRCelebrationProvider>");
    }
    return ctx;
}
