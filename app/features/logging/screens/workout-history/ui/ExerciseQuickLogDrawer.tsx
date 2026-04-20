"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { BottomDrawer, Button, NumberStepper, RPESelector, LoadingSpinner } from "@/app/components/ui";
import { usePRCelebration } from "@/app/features/personal-records/PRCelebrationContext";
import { useLogSet } from "../../../api/mutation-hooks/use-log-set";
import { groupLogsByDate, useExerciseHistory } from "../../../api/query-hooks/use-exercise-history";
import { useLastLog } from "../../../api/query-hooks/use-last-log";
import type { PRType } from "@/lib/pr-utils";
import { SetLogItem } from "../../../ui/SetLogItem";

interface ExerciseQuickLogDrawerProps {
    /** Whether the drawer is currently open. */
    isOpen: boolean;
    /** Callback that closes the drawer. */
    onClose: () => void;
    /** Unique identifier for the selected exercise. */
    exerciseId: string;
    /** Display name for the selected exercise. */
    exerciseName: string;
    /** Optional starting date for logging (ISO string). Defaults to today if not provided. */
    initialDate?: string;
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
    initialDate,
}: ExerciseQuickLogDrawerProps) {
    const { celebrate } = usePRCelebration();
    const [showSuccess, setShowSuccess] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeTab, setActiveTab] = useState<"day" | "history">("day");
    const { mutate: logSet, isPending } = useLogSet();
    const { data: lastLog } = useLastLog(exerciseId, isOpen);

    const { data: logs, isLoading, isError } = useExerciseHistory(isOpen ? exerciseId : undefined);
    const groupedLogs = groupLogsByDate(logs);

    /**
     * Filters the full history to only include sets from the specific date instance clicked.
     */
    const filteredDayLogs = useMemo(() => {
        if (!logs || !initialDate) return [];
        const targetDateStr = new Date(initialDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        return logs.filter(log => {
            if (!log.workoutSession?.date) return false;
            const d = new Date(log.workoutSession.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
            return d === targetDateStr;
        });
    }, [logs, initialDate]);

    /**
     * Calculates the next set sequence index based on the targeted date's logs.
     */
    const getNextSetIndex = () => filteredDayLogs.length + 1;

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
                date: initialDate,
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

                {/* Tab Switcher */}
                <div className="flex h-11 items-center gap-1 self-start rounded-2xl bg-muted/30 p-1 mb-6">
                    <button
                        onClick={() => setActiveTab("day")}
                        className={`relative flex h-full items-center px-4 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === "day" ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"}`}
                    >
                        {activeTab === "day" && (
                            <motion.div
                                layoutId="active-tab"
                                className="absolute inset-0 rounded-xl bg-card shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">This Day</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`relative flex h-full items-center px-4 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === "history" ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"}`}
                    >
                        {activeTab === "history" && (
                            <motion.div
                                layoutId="active-tab"
                                className="absolute inset-0 rounded-xl bg-card shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">All History</span>
                    </button>
                </div>

                {/* Main scrollable section with Tab Content */}
                <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-6 relative">
                    <AnimatePresence mode="wait">
                        {activeTab === "day" ? (
                            <motion.div
                                key="day-tab"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {isLoading ? (
                                    <div className="py-12">
                                        <LoadingSpinner size={6} label="Searching logs..." />
                                    </div>
                                ) : filteredDayLogs.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredDayLogs.map((log) => (
                                            <SetLogItem
                                                key={log.id}
                                                variant="featured"
                                                index={log.set_order_index}
                                                weight={log.weight}
                                                reps={log.reps}
                                                rpe={log.rpe}
                                                prType={log.pr_type}
                                                isAdHoc={!log.exerciseWithMetadata}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-border/50 px-4 py-12 text-center">
                                        <p className="text-sm text-muted-foreground">No sets logged for this exercise on this day.</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="history-tab"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                {isLoading ? (
                                    <div className="py-12">
                                        <LoadingSpinner size={6} label="Loading history..." />
                                    </div>
                                ) : groupedLogs && Object.keys(groupedLogs).length > 0 ? (
                                    Object.entries(groupedLogs).map(([dateStr, sessionLogs], index) => (
                                        <div key={dateStr} className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-foreground/60">
                                                    {dateStr}
                                                </h3>
                                            </div>
                                            <div className="space-y-1">
                                                {sessionLogs.map((log) => (
                                                    <SetLogItem
                                                        key={log.id}
                                                        variant="compact"
                                                        index={log.set_order_index}
                                                        weight={log.weight}
                                                        reps={log.reps}
                                                        rpe={log.rpe}
                                                        prType={log.pr_type}
                                                        isAdHoc={!log.exerciseWithMetadata}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-border/50 px-4 py-12 text-center">
                                        <p className="text-sm text-muted-foreground">No history found for this exercise.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
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


