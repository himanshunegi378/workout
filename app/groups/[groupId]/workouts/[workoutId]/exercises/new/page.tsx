import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import { AddExerciseClient } from "./components/AddExerciseClient";

interface PageProps {
    params: Promise<{
        groupId: string;
        workoutId: string;
    }>;
}

export default async function AddExerciseWithMetadataPage({ params }: PageProps) {
    const { groupId, workoutId } = await params;
    const userId = await requireUserId();

    const exercises = await prisma.exercise.findMany({
        where: { user_id: userId },
        select: { id: true, name: true, muscle_group: true },
        orderBy: { name: "asc" },
    });

    return (
        <AddExerciseClient
            groupId={groupId}
            workoutId={workoutId}
            exercises={exercises}
        />
    );
}
