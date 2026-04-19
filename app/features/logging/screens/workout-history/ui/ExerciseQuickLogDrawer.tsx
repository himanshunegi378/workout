"use client";

import React, { useState } from "react";
import { Trophy, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { BottomDrawer, Button, NumberStepper, RPESelector, LoadingSpinner } from "@/app/components/ui";
import { usePRCelebration } from "@/app/features/personal-records/PRCelebrationContext";
import { useLogSet } from "../../../api/mutation-hooks/use-log-set";
import { groupLogsByDate, useExerciseHistory } from "../../../api/query-hooks/use-exercise-history";
import { useLastLog } from "../../../api/query-hooks/use-last-log";
import type { PRType } from "@/lib/pr-utils";

interface ExerciseQuickLogDrawerProps {
    /** Whether the drawer is currently open. */
    isOpen: boolean;
    /** Callback that closes the drawer. */
    onClose: () => void;
    /** Unique identifier for the selected exercise. */
    exerciseId: string;
    /** Display name for the selected exercise. */
    exerciseName: string;
}

interface LastLog {
    id: string;
    weight: number | null;
    reps: number;
    rpe: number | null;
}

interface QuickLogFormProps {
    /** The most recent log used to prefill the form. */

    lastLog?: LastLog | null;
    /** Whether the mutation is currently running. */
    isPending: boolean;
    /** Handles quick-log submission. */
    onSubmit: (weight: string, reps: string, rpe: string | null) => void;
}

/**
 * Combined quick-log and history drawer for a focused exercise review and logging experience.
 */
export function ExerciseQuickLogDrawer({
    isOpen,
    onClose,
    exerciseId,
    exerciseName,
}: ExerciseQuickLogDrawerProps) {
    const { celebrate } = usePRCelebration();
    const [showSuccess, setShowSuccess] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const { mutate: logSet, isPending } = useLogSet();

    const { data: lastLog } = useLastLog(exerciseId, isOpen);
    const { data: logs, isLoading, isError } = useExerciseHistory(isOpen ? exerciseId : undefined);

    const groupedLogs = groupLogsByDate(logs);

    /**
     * Calculates the next set sequence index based on today's logs.
     */
    const getNextSetIndex = () => {
        const today = new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        const logsToday = logs?.filter(log => {
            if (!log.workoutSession?.date) return false;
            const d = new Date(log.workoutSession.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
            return d === today;
        }) || [];
        return logsToday.length + 1;
    };

    /**
     * Logs an ad-hoc set and triggers success feedback.
     */
    const handleSubmit = (weight: string, reps: string, rpe: string | null) => {
        if (!reps || reps === "0") return;

        const setOrderIndex = getNextSetIndex();

        logSet(
            {
                exerciseId,
                setOrderIndex,
                weight: weight || "0",
                reps,
                rpe: rpe || undefined,
            },
            {
                onSuccess: (newLog: { pr: PRType | null }) => {
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                    if (newLog.pr) {
                        celebrate(newLog.pr, exerciseName);
                    }
                },
            }
        );
    };

    return (
        <BottomDrawer isOpen={isOpen} onClose={onClose} title={exerciseName} height="85vh">
            <div className="flex h-full min-h-0 flex-col relative overflow-hidden">
                {showSuccess && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-accent px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                        <CheckCircle2 className="h-4 w-4" />
                        Set Logged!
                    </div>
                )}

                {/* Main scrollable history section */}
                <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-6">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/75">
                            History
                        </p>
                    </div>

                    {isLoading && (
                        <div className="py-12">
                            <LoadingSpinner size={6} label="Loading history..." />
                        </div>
                    )}

                    {isError && (
                        <div className="py-8 text-center text-destructive underline decoration-dotted underline-offset-4 font-medium text-sm">
                            Failed to load exercise history.
                        </div>
                    )}

                    {!isLoading && !isError && logs?.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-border/50 px-4 py-10 text-center text-sm text-muted-foreground">
                            No history found for this exercise yet.
                        </div>
                    )}

                    {!isLoading && !isError && groupedLogs && (
                        <div className="space-y-6">
                            {Object.entries(groupedLogs).map(([dateStr, sessionLogs], index) => (
                                <div
                                    key={dateStr}
                                    className="space-y-3 animate-slide-up"
                                    style={{ animationDelay: `${index * 60}ms` }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                                        <h3 className="text-sm font-semibold tracking-wider text-foreground">
                                            {dateStr}
                                        </h3>
                                    </div>

                                    <div className="space-y-1 pt-2">
                                        {sessionLogs.map((log) => (
                                            <div
                                                key={log.id}
                                                className="grid gap-2 rounded-2xl bg-background/30 px-3 py-2 text-base sm:flex sm:items-center sm:justify-between"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <span
                                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${
                                                            log.pr_type
                                                                ? "bg-accent/20 text-accent"
                                                                : "bg-muted text-muted-foreground"
                                                        }`}
                                                    >
                                                        {log.pr_type ? (
                                                            <Trophy className="h-3.5 w-3.5 stroke-[2.5]" />
                                                        ) : (
                                                            log.set_order_index
                                                        )}
                                                    </span>

                                                    <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                                                        <span className="font-display font-bold text-foreground">
                                                            {log.weight ? `${log.weight}` : "BW"}
                                                        </span>
                                                        {log.weight && (
                                                            <span className="text-xs font-medium text-muted-foreground">
                                                                kg
                                                            </span>
                                                        )}
                                                        <span className="mx-1 text-sm text-muted-foreground/60">×</span>
                                                        <span className="font-display font-bold text-accent">
                                                            {log.reps}
                                                        </span>
                                                        {log.rpe && (
                                                            <span className="ml-2 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/90">
                                                                @{log.rpe}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sticky/Fixed Footer for Quick Log */}
                <div className="shrink-0 border-t border-border/40 bg-background/35 backdrop-blur-md -mx-5 px-5 pt-4 pb-6 transition-all duration-300">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mb-4 flex w-full items-center justify-between group"
                    >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                            Quick log
                        </p>
                        <div className="rounded-full p-1 text-muted-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                        </div>
                    </button>

                    {isExpanded && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <QuickLogForm
                                key={`${exerciseId}-${lastLog?.id || (lastLog === null ? "none" : "loading")}`}
                                lastLog={lastLog}
                                isPending={isPending}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    )}
                </div>
            </div>
        </BottomDrawer>
    );
}

/**
 * An internal form for capturing set data (weight, reps, RPE).
 * It uses a keyed-initialization approach to ensure fields update when 
 * historical data becomes available.
 */
function QuickLogForm({ lastLog, isPending, onSubmit }: QuickLogFormProps) {
    const [weight, setWeight] = useState(lastLog?.weight?.toString() || "0");
    const [reps, setReps] = useState(lastLog?.reps?.toString() || "0");
    const [rpe, setRpe] = useState<number | null>(lastLog?.rpe || null);

    const weightNum = parseFloat(weight) || 0;
    const repsNum = parseInt(reps) || 0;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                    <NumberStepper
                        label="Weight"
                        value={weightNum}
                        onChange={(value) => setWeight(value.toString())}
                        min={0}
                        max={500}
                        step={2.5}
                        suffix="kg"
                        stepOptions={[2.5, 5]}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <NumberStepper
                        label="Reps"
                        value={repsNum}
                        onChange={(value) => setReps(value.toString())}
                        min={0}
                        max={100}
                        step={1}
                    />
                </div>
            </div>

            <div>
                <RPESelector value={rpe} onChange={setRpe} />
            </div>

            <Button
                variant="primary"
                className="w-full py-4 text-lg font-bold shadow-none"
                onClick={() => onSubmit(weight, reps, rpe?.toString() || null)}
                disabled={isPending || !reps || reps === "0"}
            >
                {isPending ? (
                    <LoadingSpinner size={5} label="Logging Set..." className="text-white" />
                ) : (
                    "Log Set"
                )}
            </Button>
        </div>
    );
}


