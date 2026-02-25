"use server";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";

export async function getWorkoutDetails(groupId: string, workoutId: string) {
    const userId = await requireUserId();

    const workout = await prisma.workout.findFirst({
        where: {
            id: workoutId,
            workoutGroup: { id: groupId, user_id: userId },
        },
        select: {
            id: true,
            name: true,
            exercisesWithMetadata: {
                orderBy: { order_index: "asc" },
                select: {
                    id: true,
                    exercise_id: true,
                    sets_min: true,
                    sets_max: true,
                    reps_min: true,
                    reps_max: true,
                    rest_min: true,
                    rest_max: true,
                    tempo: true,
                    is_hidden: true,
                    exercise: {
                        select: {
                            id: true,
                            name: true,
                            muscle_group: true,
                        },
                    },
                },
            },
        },
    });

    if (!workout) return null;

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
        select: {
            id: true,
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

    return { workout, session };
}
