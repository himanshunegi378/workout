import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ exerciseId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { exerciseId } = await params;

        const logs = await prisma.exerciseLog.findMany({
            where: {
                user_id: session.user.id,
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
            orderBy: [
                { sessionExerciseLog: { workoutSession: { date: "desc" } } },
                { set_order_index: "asc" },
            ],
            select: {
                id: true,
                weight: true,
                reps: true,
                set_order_index: true,
                pr_type: true,
                sessionExerciseLog: {
                    select: {
                        workoutSession: {
                            select: {
                                date: true,
                                start_time: true,
                            },
                        },
                        exerciseWithMetadata: {
                            select: {
                                reps_min: true,
                                reps_max: true,
                                sets_min: true,
                                sets_max: true,
                                tempo: true,
                                rest_min: true,
                                rest_max: true,
                            },
                        },
                    },
                },
            },
        });

        // Flatten the structure for the frontend
        const flattenedLogs = logs.map(log => ({
            id: log.id,
            weight: log.weight,
            reps: log.reps,
            set_order_index: log.set_order_index,
            pr_type: log.pr_type,
            workoutSession: log.sessionExerciseLog?.workoutSession ?? { date: new Date().toISOString(), start_time: null },
            exerciseWithMetadata: log.sessionExerciseLog?.exerciseWithMetadata ?? null,
        }));

        return NextResponse.json(flattenedLogs);
    } catch (error) {
        console.error("Error fetching exercise logs:", error);
        return NextResponse.json(
            { error: "Failed to fetch exercise logs" },
            { status: 500 }
        );
    }
}
