"use client";

import React from "react";
import { Trophy, Zap } from "lucide-react";
import { ExerciseLog } from "../types";

interface SetLogItemProps {
    /** The chronological order of the set. Optional if using log.set_order_index. */
    index?: number;
    /** The domain object representing the logged set. */
    log: Partial<ExerciseLog> & { reps: number }; // reps is required for rendering
    /** Whether the set was logged ad-hoc (not part of a program). */
    isAdHoc?: boolean;
    /** Visual variant of the item. */
    variant?: "compact" | "featured" | "list";
}

/**
 * A standardized primitive for displaying a logged exercise set.
 * Supports different visual density variants (compact, featured, list).
 */
export function SetLogItem({
    index,
    log,
    isAdHoc,
    variant = "compact",
}: SetLogItemProps) {
    const { weight, reps, rpe, pr_type, set_order_index } = log;
    const displayIndex = index ?? (set_order_index !== undefined ? set_order_index + 1 : 0);
    const prType = pr_type;

    if (variant === "featured") {
        return (
            <div className="grid gap-2 rounded-2xl bg-background/30 px-3 py-3 text-base sm:flex sm:items-center sm:justify-between border border-border/5">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="relative">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${prType ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                            {prType ? <Trophy className="h-4 w-4 stroke-[2.5]" /> : displayIndex}
                        </span>
                        {isAdHoc && (
                            <div className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-warning border border-background shadow-xs">
                                <Zap className="h-1.5 w-1.5 text-warning-foreground fill-current" />
                            </div>
                        )}
                    </div>
                    <div className="flex min-w-0 items-baseline gap-x-2">
                        <span className="font-display font-bold text-lg text-foreground">
                            {weight ? `${weight}kg` : "BW"}
                        </span>
                        <span className="text-foreground/40 text-sm">×</span>
                        <span className="font-display font-bold text-lg text-accent">
                            {reps}
                        </span>
                        {rpe && (
                            <span className="ml-2 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-foreground/70">
                                @{rpe}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (variant === "list") {
        return (
            <div className="flex items-center gap-3">
                <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                    <span className={`flex h-full w-full items-center justify-center rounded-full text-xs font-semibold
                        ${prType
                            ? "bg-accent/15 text-foreground"
                            : "bg-accent/10 text-foreground/90"
                        }`}
                    >
                        {prType ? (
                            <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                            displayIndex
                        )}
                    </span>
                    {isAdHoc && (
                        <div className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-warning border-2 border-background">
                            <Zap className="h-2 w-2 text-warning-foreground fill-current" />
                        </div>
                    )}
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
                    <span className="font-display font-semibold text-foreground">
                        {weight ? `${weight}kg` : "BW"}
                    </span>
                    <span className="text-foreground/60">×</span>
                    <span className="font-display font-semibold text-foreground">
                        {reps}
                    </span>
                    {rpe && (
                        <span className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/90">
                            @{rpe}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    // Default: compact (History drawer style)
    return (
        <div className="flex items-center justify-between rounded-xl bg-background/20 px-3 py-2 text-sm">
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground/40 w-4">{displayIndex}</span>
                <span className="font-bold text-foreground">{weight ? `${weight}kg` : "BW"}</span>
                <span className="text-foreground/40">×</span>
                <span className="font-bold text-accent">{reps}</span>
                {rpe && (
                    <span className="ml-1 text-[9px] font-bold text-foreground/40 uppercase">@{rpe}</span>
                )}
                {isAdHoc && (
                    <Zap className="ml-2 h-2.5 w-2.5 text-warning fill-current opacity-70" />
                )}
            </div>
            {prType && <Trophy className="h-3 w-3 text-accent" />}
        </div>
    );
}
