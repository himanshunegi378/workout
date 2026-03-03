"use client";

import { BottomDrawer } from "@/app/components/ui";
import { useExerciseHistory } from "../api/query-hooks/use-exercise-history";
import { Loader2, Plus, Trophy } from "lucide-react";
import { Portal } from "@/app/components/ui/Portal";
import { useState } from "react";
import { StandaloneLogDrawer } from "@/app/features/logging/components/ui/StandaloneLogDrawer";

interface ExerciseHistoryDrawerProps {
    exerciseId: string;
    exerciseName: string;
    isOpen: boolean;
    onClose: () => void;
}

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
                <div className="flex flex-col h-[70vh]">
                    <div className="px-4 py-3 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 shrink-0">
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

                    <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
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
                                            <div className="w-2 h-2 rounded-full bg-accent shrink-0 shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
                                            <h3 className="text-sm font-semibold text-foreground tracking-wider">
                                                {dateStr}
                                            </h3>
                                        </div>
                                        <div className="bg-card border border-border rounded-xl p-3 space-y-1">
                                            {sessionLogs.map((log) => (
                                                <div key={log.id} className="flex items-center justify-between text-base py-2 border-b border-border/30 last:border-0 last:pb-0">
                                                    <div className="flex items-center gap-4">
                                                        <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold
                                                            ${log.pr_type
                                                                ? "bg-accent/20 text-accent ring-1 ring-accent/30"
                                                                : "bg-muted text-muted-foreground"}`}
                                                        >
                                                            {log.pr_type ? (
                                                                <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
                                                            ) : (
                                                                log.set_order_index
                                                            )}
                                                        </span>
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="font-display font-bold text-foreground">
                                                                {log.weight ? `${log.weight}` : "BW"}
                                                            </span>
                                                            {log.weight && <span className="text-xs text-muted-foreground font-medium">kg</span>}
                                                            <span className="text-muted-foreground/60 text-sm mx-1">×</span>
                                                            <span className="font-display font-bold text-accent">
                                                                {log.reps}
                                                            </span>
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
