"use client";

import { useRestTimer } from "../context/RestTimerContext";
import { formatTime } from "../lib/formatTime";

export function RestTimerHeaderValue() {
    const { isActive, timeLeft, openTimer } = useRestTimer();

    if (!isActive) return null;

    return (
        <button
            type="button"
            onClick={openTimer}
            className="rounded-full px-1 py-1 text-sm font-semibold tabular-nums text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`Open rest timer with ${formatTime(timeLeft)} remaining`}
        >
            {formatTime(timeLeft)}
        </button>
    );
}
