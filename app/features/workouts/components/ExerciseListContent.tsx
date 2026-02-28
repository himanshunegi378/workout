"use client";

import { notFound } from "next/navigation";
import { Activity, Loader2 } from "lucide-react";
import { PageHeader, EmptyState } from "@/app/components/ui";
import { ExerciseCard } from "./ui/ExerciseCard";
import { AddExerciseTrigger } from "../../exercises/components/AddExerciseTrigger";
import { useWorkoutDetails } from "../api/query-hooks/use-workout-details";

export function ExerciseListContent({
    groupId,
    workoutId,
}: {
    groupId: string;
    workoutId: string;
}) {
    const { data, isLoading, isError } = useWorkoutDetails(groupId, workoutId);

    if (isLoading) {
        return (
            <>
                <PageHeader title="Loading..." backHref={`/groups/${groupId}`} />
                <div className="min-h-screen flex flex-col pt-24 items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    <span className="text-sm text-muted-foreground animate-pulse font-medium">Preparing training session...</span>
                </div>
            </>
        );
    }

    if (isError || !data) {
        if (isError) {
            return (
                <>
                    <PageHeader title="Error" backHref={`/groups/${groupId}`} />
                    <EmptyState
                        icon={Activity}
                        title="Something went wrong"
                        description="Could not load your workout. Please try again."
                    />
                </>
            );
        }
        notFound();
    }

    const { workout, session, previousLogsByExercise } = data;

    const logsByEwm: Record<string, { id: string; weight: number | null; reps: number; set_order_index: number }[]> = {};
    if (session) {
        session.exerciseLogs.forEach((log) => {
            if (log.exercise_with_metadata_id) {
                if (!logsByEwm[log.exercise_with_metadata_id]) {
                    logsByEwm[log.exercise_with_metadata_id] = [];
                }
                logsByEwm[log.exercise_with_metadata_id].push({
                    id: log.id,
                    weight: log.weight,
                    reps: log.reps,
                    set_order_index: log.set_order_index,
                });
            }
        });
    }

    return (
        <>
            <PageHeader
                title={workout.name}
                backHref={`/groups/${groupId}`}
                action={
                    <AddExerciseTrigger
                        groupId={groupId}
                        workoutId={workoutId}
                        variant="icon"
                    />
                }
            />

            <main className="max-w-lg mx-auto px-4 py-4">
                {workout.exercisesWithMetadata.length === 0 ? (
                    <EmptyState
                        icon={Activity}
                        title="No Exercises Yet"
                        description="Add exercises to this workout to get started"
                        action={
                            <AddExerciseTrigger
                                groupId={groupId}
                                workoutId={workoutId}
                                variant="button"
                            />
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        {workout.exercisesWithMetadata.filter((ewm) => !ewm.is_hidden).map((ewm, i) => (
                            <div
                                key={ewm.id}
                                className="animate-slide-up"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <ExerciseCard
                                    workoutId={workoutId}
                                    groupId={groupId}
                                    ewmId={ewm.id}
                                    exerciseId={ewm.exercise_id}
                                    name={ewm.exercise.name}
                                    muscleGroup={ewm.exercise.muscle_group}
                                    setsMin={ewm.sets_min ?? 0}
                                    setsMax={ewm.sets_max ?? 0}
                                    repsMin={ewm.reps_min ?? 0}
                                    repsMax={ewm.reps_max ?? 0}
                                    restMin={ewm.rest_min ?? 0}
                                    restMax={ewm.rest_max ?? 0}
                                    tempo={ewm.tempo ?? ""}
                                    initialLogs={logsByEwm[ewm.id] || []}
                                    previousLogs={previousLogsByExercise[ewm.exercise_id] || []}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
