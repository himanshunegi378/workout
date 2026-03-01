import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ exerciseId: string }> }
) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { exerciseId } = await params;

        // Verify the exercise belongs to the user
        const exercise = await prisma.exercise.findFirst({
            where: { id: exerciseId, user_id: userId },
        });

        if (!exercise) {
            return NextResponse.json(
                { error: "Exercise not found" },
                { status: 404 }
            );
        }

        // Find the absolute latest log for this exercise across all sessions
        const latestLog = await prisma.exerciseLog.findFirst({
            where: {
                user_id: userId,
                OR: [
                    { exerciseId: exerciseId },
                    {
                        sessionExerciseLog: {
                            exerciseWithMetadata: {
                                exercise_id: exerciseId
                            }
                        }
                    }
                ],
            },
            orderBy: {
                date: "desc",
            },
            select: {
                weight: true,
                reps: true,
            },
        });

        return NextResponse.json(latestLog || null);
    } catch (error) {
        console.error("Failed to fetch last log:", error);
        return NextResponse.json(
            { error: "Failed to fetch top log" },
            { status: 500 }
        );
    }
}
