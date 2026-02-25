"use server";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";

export async function getSessions() {
    const userId = await requireUserId();

    const sessions = await prisma.workoutSession.findMany({
        where: { user_id: userId },
        orderBy: { date: "desc" },
        take: 30,
        select: {
            id: true,
            date: true,
            start_time: true,
            end_time: true,
            workout: {
                select: {
                    name: true,
                    workoutGroup: {
                        select: { name: true },
                    },
                },
            },
            exerciseLogs: {
                orderBy: { set_order_index: "asc" },
                select: {
                    id: true,
                    weight: true,
                    reps: true,
                    set_order_index: true,
                    exercise: {
                        select: {
                            id: true,
                            name: true,
                            muscle_group: true,
                        },
                    },
                    exerciseWithMetadata: {
                        select: {
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
            },
        },
    });

    return sessions;
}
