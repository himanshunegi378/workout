"use client";

import { BottomDrawer } from "@/app/components/ui";
import { useExerciseHistory } from "@/app/features/logging/api/query-hooks/use-exercise-history";
import { Loader2, Plus, Trophy } from "lucide-react";
import { Portal } from "@/app/components/ui/Portal";
import { useState } from "react";
import { StandaloneLogDrawer } from "@/app/features/logging/screens/workout-history/ui/StandaloneLogDrawer";

interface ExerciseHistoryDrawerProps {
    exerciseId: string;
    exerciseName: string;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * A bottom drawer component that displays the completed set history for a specific exercise.
 * 
 * Context:
 * This drawer is typically triggered from an exercise list or during a workout to help users 
 * track their progress and see previous performance (weight and reps) for a specific movement.
 * It groups historical logs by date and provides visual indicators for Personal Records (PRs) 
 * using a trophy icon.
 * 
 * Why:
 * - Real-time progress tracking: Users need to know their previous "heaviest" or "most reps" 
 *   to apply progressive overload.
 * - Quick logging: Includes a standalone log trigger to allow adding set data without 
 *   necessarily being in a full workout session.
 */
export function ExerciseHistoryDrawer({
    exerciseId,
    exerciseName,
    isOpen,
    onClose,
}: ExerciseHistoryDrawerProps) {
    const { data: logs, isLoading, isError } = useExerciseHistory(isOpen ? exerciseId : undefined);
    const [isStandaloneLogOpen, setIsStandaloneLogOpen] = useState(false);

    // Group logs by session date
    const groupedLogs = logs?.reduce((acc, log) => {
        const dateStr = new Date(log.workoutSession?.date ?? new Date()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push(log);
        return acc;
    }, {} as Record<string, typeof logs>);

    return (
        <Portal>
            <BottomDrawer isOpen={isOpen} onClose={onClose}>
                <div className="flex h-[70vh] flex-col">
                    <div className="sticky top-0 z-10 shrink-0 bg-background/95 px-4 py-3 backdrop-blur-sm">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 rounded-full bg-accent" />
                                <div>
                                    <h2 className="font-display text-lg font-bold text-foreground leading-tight">
                                        Exercise History
                                    </h2>
                                    <p className="text-sm text-muted-foreground font-medium truncate max-w-[250px]">
                                        {exerciseName}
                                    </p>
                                </div>
                            </div>

                            {/* Standalone Log Trigger */}
                            <button
                                onClick={() => setIsStandaloneLogOpen(true)}
                                className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                                title="Log Set"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                        {isLoading && (
                            <div className="flex items-center justify-center py-12 text-muted-foreground">
                                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                <span className="text-sm">Loading history...</span>
                            </div>
                        )}

                        {isError && (
                            <div className="text-center py-8 text-destructive">
                                Failed to load exercise history.
                            </div>
                        )}

                        {!isLoading && !isError && logs?.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                No history found for this exercise.
                            </div>
                        )}

                        {!isLoading && !isError && groupedLogs && (
                            <div className="space-y-6">
                                {Object.entries(groupedLogs).map(([dateStr, sessionLogs], i) => (
                                    <div key={dateStr} className="space-y-3 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
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
                                                            {log.weight && <span className="text-xs font-medium text-muted-foreground">kg</span>}
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
                </div>
            </BottomDrawer>

            <StandaloneLogDrawer
                isOpen={isStandaloneLogOpen}
                onClose={() => setIsStandaloneLogOpen(false)}
                exerciseId={exerciseId}
                exerciseName={exerciseName}
            />
        </Portal>
    );
}
