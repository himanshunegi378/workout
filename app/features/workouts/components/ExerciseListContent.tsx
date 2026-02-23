import { notFound } from "next/navigation";
import Link from "next/link";
import { Activity, Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import { PageHeader, EmptyState } from "@/app/components/ui";
import { ExerciseCard } from "./ui/ExerciseCard";

export async function ExerciseListContent({
    groupId,
    workoutId,
}: {
    groupId: string;
    workoutId: string;
}) {
    const userId = await requireUserId();

    const workout = await prisma.workout.findFirst({
        where: {
            id: workoutId,
            workoutGroup: { id: groupId, user_id: userId },
        },
        include: {
            exercisesWithMetadata: {
                orderBy: { order_index: "asc" },
                include: {
                    exercise: true,
                },
            },
        },
    });

    if (!workout) notFound();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const session = await prisma.workoutSession.findFirst({
        where: {
            user_id: userId,
            workout_id: workoutId,
            date: {
                gte: today,
                lt: tomorrow,
            },
        },
        include: {
            exerciseLogs: {
                select: {
                    id: true,
                    weight: true,
                    reps: true,
                    exercise_with_metadata_id: true,
                    set_order_index: true,
                },
            },
        },
    });

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
                    <Link
                        href={`/groups/${groupId}/workouts/${workoutId}/exercises/new`}
                        className="p-2 rounded-xl hover:bg-muted transition-colors"
                    >
                        <Plus className="w-5 h-5 text-accent" />
                    </Link>
                }
            />

            <main className="max-w-lg mx-auto px-4 py-4">
                {workout.exercisesWithMetadata.length === 0 ? (
                    <EmptyState
                        icon={Activity}
                        title="No Exercises Yet"
                        description="Add exercises to this workout to get started"
                        action={
                            <Link
                                href={`/groups/${groupId}/workouts/${workoutId}/exercises/new`}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3
                                         rounded-xl font-display text-sm font-semibold
                                         transition-all duration-200 active:animate-press
                                         bg-accent hover:bg-accent-hover text-accent-foreground shadow-lg shadow-accent/20"
                            >
                                <Plus className="w-4 h-4" /> Add Exercise
                            </Link>
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        {workout.exercisesWithMetadata.map((ewm, i) => (
                            <div
                                key={ewm.id}
                                className="animate-slide-up"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <ExerciseCard
                                    workoutId={workoutId}
                                    ewmId={ewm.id}
                                    exerciseId={ewm.exercise_id}
                                    name={ewm.exercise.name}
                                    muscleGroup={ewm.exercise.muscle_group}
                                    setsMin={ewm.sets_min}
                                    setsMax={ewm.sets_max}
                                    repsMin={ewm.reps_min}
                                    repsMax={ewm.reps_max}
                                    restMin={ewm.rest_min}
                                    restMax={ewm.rest_max}
                                    tempo={ewm.tempo}
                                    initialLogs={logsByEwm[ewm.id] || []}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
