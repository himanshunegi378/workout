import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import { ExerciseListClient } from "./ExerciseListClient";

export async function ExercisesContent() {
    const userId = await requireUserId();

    const exercises = await prisma.exercise.findMany({
        where: { user_id: userId },
        orderBy: [{ muscle_group: "asc" }, { name: "asc" }],
        select: {
            id: true,
            name: true,
            description: true,
            muscle_group: true,
        },
    });

    return <ExerciseListClient exercises={exercises} />;
}
