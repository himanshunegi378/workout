"use client";

import { useEffect } from "react";
import { Portal } from "@/app/components/ui/Portal";
import { usePRCelebration } from "./PRCelebrationContext";
import type { PRType } from "@/lib/pr-utils";

// ── PR config ───────────────────────────────────────────────────────────────

const PR_CONFIG: Record<PRType, {
    emoji: string;
    label: string;
    sub: string;
    color: string;
}> = {
    weight: {
        emoji: "🏆",
        label: "New Weight PR!",
        sub: "You just lifted more than ever before!",
        color: "#fbbf24",
    },
    reps: {
        emoji: "🔥",
        label: "New Reps PR!",
        sub: "More reps than you have ever done!",
        color: "#f97316",
    },
    estimated_1rm: {
        emoji: "⚡",
        label: "New Strength PR!",
        sub: "Your estimated 1-Rep Max just went up!",
        color: "#a78bfa",
    },
};

const CONFETTI_COLORS = ["#ec4899", "#a78bfa", "#38bdf8", "#34d399", "#fbbf24"];

// ── Component ───────────────────────────────────────────────────────────────

/**
 * A highly visual, animated overlay for celebrating Personal Records (PRs).
 * 
 * Context:
 * This component is globally rendered via a Portal when the `PRCelebrationContext` 
 * state is active. It provides immediate visual feedback for achievement using 
 * emojis, color cues, and CSS animations.
 * 
 * Why:
 * - Unobtrusive Delight: Positioned to be visible but not block the user's workflow, 
 *   disappearing automatically or via explicit dismissal.
 * - Dynamic Messaging: Adapts its visual style (emoji, label, accent color) based 
 *   on whether the PR was for weight, reps, or estimated 1-Rep Max.
 */
export function PRCelebrationOverlay() {
    const { celebration, dismiss } = usePRCelebration();

    // Dismiss on Escape key
    useEffect(() => {
        if (!celebration.isVisible) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") dismiss();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [celebration.isVisible, dismiss]);

    if (!celebration.isVisible || !celebration.prType) return null;

    const config = PR_CONFIG[celebration.prType];

    return (
        <Portal>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={dismiss}
                aria-hidden="true"
            />

            {/* Celebration card — above bottom nav on mobile, bottom right on desktop or centered */}
            <div
                role="status"
                aria-live="polite"
                aria-label={`Personal record: ${config.label} for ${celebration.exerciseName}`}
                className="fixed inset-x-0 bottom-24 md:bottom-8 z-9999 flex justify-center px-5 pointer-events-none"
            >
                <div
                    className="pointer-events-auto relative w-full max-w-sm bg-card border border-border rounded-3xl p-7 elevation-5 text-center overflow-hidden"
                    style={{ animation: "pr-slide-in 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) both" }}
                >
                    {/* Accent glow backdrop */}
                    <div
                        className="absolute inset-0 rounded-3xl pointer-events-none opacity-15"
                        style={{
                            background: `radial-gradient(circle at 50% 0%, ${config.color}, transparent 65%)`,
                        }}
                    />

                    {/* Confetti dots */}
                    <div
                        className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none"
                        aria-hidden="true"
                    >
                        {CONFETTI_COLORS.map((color, i) => (
                            <span
                                key={i}
                                className="absolute w-2.5 h-2.5 rounded-full"
                                style={{
                                    background: color,
                                    left: `${10 + i * 19}%`,
                                    top: "6%",
                                    animation: `pr-burst 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) both ${0.12 + i * 0.07}s`,
                                    opacity: 0.85,
                                }}
                            />
                        ))}
                    </div>

                    {/* Emoji with burst animation */}
                    <div
                        className="relative text-6xl mb-4 select-none"
                        style={{
                            animation: "pr-burst 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) both 0.1s",
                        }}
                    >
                        {config.emoji}
                    </div>

                    {/* PR type badge */}
                    <div
                        className="relative inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border"
                        style={{
                            background: `${config.color}18`,
                            borderColor: `${config.color}40`,
                            color: config.color,
                        }}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ background: config.color }}
                        />
                        Personal Record
                    </div>

                    <h2 className="relative font-display text-2xl font-bold text-foreground mb-1">
                        {config.label}
                    </h2>
                    <p className="relative text-sm text-muted-foreground mb-1">
                        {config.sub}
                    </p>
                    <p className="relative text-xs font-semibold text-accent/80 truncate mb-5">
                        {celebration.exerciseName}
                    </p>

                    <button
                        onClick={dismiss}
                        className="relative text-xs text-muted-foreground hover:text-foreground transition-colors px-4 py-1.5 rounded-full border border-border hover:border-accent/30 hover:bg-accent/5"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </Portal>
    );
}
