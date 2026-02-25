"use server";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";

export async function getWorkoutGroups() {
    const userId = await requireUserId();

    return prisma.workoutGroup.findMany({
        where: { user_id: userId },
        select: {
            id: true,
            name: true,
            description: true,
            workouts: {
                select: { id: true },
            },
        },
        orderBy: { name: "asc" },
    });
}

export async function getWorkoutGroup(groupId: string) {
    const userId = await requireUserId();

    return prisma.workoutGroup.findFirst({
        where: { id: groupId, user_id: userId },
        select: {
            id: true,
            name: true,
            workouts: {
                orderBy: { order_index: "asc" },
                select: {
                    id: true,
                    name: true,
                    order_index: true,
                    exercisesWithMetadata: {
                        orderBy: { order_index: "asc" },
                        take: 3,
                        select: {
                            exercise: { select: { name: true } },
                        },
                    },
                    _count: {
                        select: { exercisesWithMetadata: true },
                    },
                },
            },
        },
    });
}
