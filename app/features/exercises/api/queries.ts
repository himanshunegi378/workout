"use server";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";

export async function getExercises() {
    const userId = await requireUserId();

    return prisma.exercise.findMany({
        where: { user_id: userId },
        orderBy: [{ muscle_group: "asc" }, { name: "asc" }],
        select: {
            id: true,
            name: true,
            description: true,
            muscle_group: true,
        },
    });
}
