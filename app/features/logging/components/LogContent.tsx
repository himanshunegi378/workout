"use client";

import { Check, Loader2 } from "lucide-react";
import { EmptyState } from "@/app/components/ui";
import { SessionCard } from "./ui/SessionCard";
import { useSessions } from "../api/query-hooks/use-sessions";
import type { ExerciseLogWithRelations, GroupedSession, SessionWithLogs } from "../types";

export function LogContent() {
    const { data: grouped, isLoading, isError } = useSessions({ grouped: true });

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
        <div className="space-y-6">
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
                                workoutName={session.workout.name}
                                groupName={session.workout.workoutGroup.name}
                                startTime={session.start_time}
                                endTime={session.end_time}
                                exerciseGroups={exerciseGroups}
                            />
                        );
                    })}
                </section>
            ))}
        </div>
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
