"use client";

import { Portal, usePageHeaderHost } from "@/app/components/ui";
import { useRestTimer } from "../context/RestTimerContext";
import { formatTime } from "../lib/formatTime";

export function RestTimerFloatingBubble() {
    const { isActive, isMinimized, timeLeft, openTimer } = useRestTimer();
    const headerHost = usePageHeaderHost();
    const hasHeaderHost = headerHost?.hasHost ?? false;

    if (!isActive || !isMinimized || hasHeaderHost) return null;

    return (
        <Portal>
            <div className="pointer-events-none fixed inset-x-0 bottom-16 z-40 flex justify-center p-4 md:inset-x-auto md:right-32 md:bottom-8 md:block">
                <button
                    type="button"
                    onClick={openTimer}
                    className="pointer-events-auto rounded-full border border-border/60 bg-background/95 px-4 py-2 text-sm font-semibold tabular-nums text-foreground shadow-lg backdrop-blur-md transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={`Open rest timer with ${formatTime(timeLeft)} remaining`}
                >
                    {formatTime(timeLeft)}
                </button>
            </div>
        </Portal>
    );
}
