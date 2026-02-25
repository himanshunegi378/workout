"use client";

import { Check, Loader2 } from "lucide-react";
import { EmptyState } from "@/app/components/ui";
import { SessionCard } from "./ui/SessionCard";
import { useSessions } from "../api/query-hooks/use-sessions";

export function LogContent() {
    const { data: sessions, isLoading, isError } = useSessions();

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

    if (!sessions || sessions.length === 0) {
        return (
            <EmptyState
                icon={Check}
                title="No Logs Yet"
                description="Start a workout session to begin logging your exercises"
            />
        );
    }

    const grouped = groupByDate(sessions);

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

                        if (exerciseGroups.length === 0) return null;

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

interface ExerciseLogWithRelations {
    id: string;
    weight: number | null;
    reps: number;
    set_order_index: number;
    exercise: { id: string; name: string; muscle_group: string } | null;
    exerciseWithMetadata: {
        exercise: { id: string; name: string; muscle_group: string };
    } | null;
}

interface SessionWithLogs {
    id: string;
    date: Date;
    start_time: Date | null;
    end_time: Date | null;
    workout: {
        name: string;
        workoutGroup: { name: string };
    };
    exerciseLogs: ExerciseLogWithRelations[];
}

function groupByDate(sessions: SessionWithLogs[]) {
    const map = new Map<string, { label: string; sessions: SessionWithLogs[] }>();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    for (const s of sessions) {
        const d = new Date(s.date);
        const key = d.toISOString().split("T")[0];

        let label: string;
        if (key === today.toISOString().split("T")[0]) {
            label = "Today";
        } else if (key === yesterday.toISOString().split("T")[0]) {
            label = "Yesterday";
        } else {
            label = d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        }

        if (!map.has(key)) {
            map.set(key, { label, sessions: [] });
        }
        map.get(key)!.sessions.push(s);
    }

    return Array.from(map.values());
}

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
