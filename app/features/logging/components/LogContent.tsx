"use client";

import { Check, Loader2 } from "lucide-react";
import { EmptyState } from "@/app/components/ui";
import { SessionCard } from "./ui/SessionCard";
import { useInfiniteSessions } from "../api/query-hooks/use-sessions";
import { QuickLogActions } from "./ui/QuickLogActions";
import type { ExerciseLogWithRelations, SessionWithLogs } from "../types";

export function LogContent() {
    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteSessions({ grouped: true, limit: 10 });

    const grouped = (() => {
        if (!data?.pages) return [];

        // Flatten and merge groups with the same label
        const merged = new Map<string, { label: string; sessions: SessionWithLogs[] }>();

        for (const page of data.pages) {
            for (const group of page.data) {
                if (!merged.has(group.label)) {
                    merged.set(group.label, { label: group.label, sessions: [] });
                }
                merged.get(group.label)!.sessions.push(...group.sessions);
            }
        }

        return Array.from(merged.values());
    })();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-sm">Loading sessions...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <EmptyState
                icon={Check}
                title="Something went wrong"
                description="Could not load your log. Please try again."
            />
        );
    }

    if (!grouped || grouped.length === 0) {
        return (
            <EmptyState
                icon={Check}
                title="No Logs Yet"
                description="Start a workout session to begin logging your exercises"
            />
        );
    }

    return (
        <>
            <div className="space-y-6 flex flex-col pb-8">
                {grouped.map(({ label, sessions: daySessions }, gi) => (
                    <section
                        key={label}
                        className="space-y-3 animate-slide-up"
                        style={{ animationDelay: `${gi * 80}ms` }}
                    >
                        {/* Date label */}
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                {label}
                            </h2>
                        </div>

                        {daySessions.map((session) => {
                            const exerciseGroups = groupLogsByExercise(session.exerciseLogs);

                            return (
                                <SessionCard
                                    key={session.id}
                                    workoutName={session.workout?.name ?? "Ad-hoc Exercises"}
                                    groupName={session.workout?.programme?.name ?? "Quick Log"}
                                    startTime={session.start_time}
                                    endTime={session.end_time}
                                    exerciseGroups={exerciseGroups}
                                />
                            );
                        })}
                    </section>
                ))}

                {hasNextPage && (
                    <div className="pt-4 flex justify-center w-full">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary/50 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Load More"
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Log Refactored Component */}
            <QuickLogActions />
        </>
    );
}

// ── Helpers ──

export type { GroupedSession, SessionWithLogs, ExerciseLogWithRelations } from "../types";

function groupLogsByExercise(logs: ExerciseLogWithRelations[]) {
    const map = new Map<
        string,
        {
            exercise: { id: string; name: string; muscle_group: string };
            sets: ExerciseLogWithRelations[];
        }
    >();

    for (const log of logs) {
        const exercise = log.exerciseWithMetadata?.exercise ?? log.exercise;
        if (!exercise) continue;

        if (!map.has(exercise.id)) {
            map.set(exercise.id, { exercise, sets: [] });
        }
        map.get(exercise.id)!.sets.push(log);
    }

    return Array.from(map.values());
}
