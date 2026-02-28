import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string; workoutId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { groupId, workoutId } = await params;
        const userId = session.user.id;

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

        if (!workout) {
            return NextResponse.json({ error: "Workout not found" }, { status: 404 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const activeSession = await prisma.workoutSession.findFirst({
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

        const previousLogsByExercise: Record<string, { id: string; weight: number | null; reps: number; set_order_index: number }[]> = {};

        await Promise.all(
            workout.exercisesWithMetadata.map(async (ewm) => {
                const lastSessionLog = await prisma.exerciseLog.findFirst({
                    where: {
                        user_id: userId,
                        OR: [
                            { exercise_id: ewm.exercise_id },
                            { exerciseWithMetadata: { exercise_id: ewm.exercise_id } }
                        ],
                        workoutSession: {
                            date: { lt: today }
                        }
                    },
                    orderBy: {
                        workoutSession: {
                            date: "desc"
                        }
                    },
                    select: {
                        workout_session_id: true,
                    }
                });

                if (lastSessionLog?.workout_session_id) {
                    const logs = await prisma.exerciseLog.findMany({
                        where: {
                            workout_session_id: lastSessionLog.workout_session_id,
                            user_id: userId,
                            OR: [
                                { exercise_id: ewm.exercise_id },
                                { exerciseWithMetadata: { exercise_id: ewm.exercise_id } }
                            ],
                        },
                        select: {
                            id: true,
                            weight: true,
                            reps: true,
                            set_order_index: true,
                        },
                        orderBy: {
                            set_order_index: "asc"
                        }
                    });
                    previousLogsByExercise[ewm.exercise_id] = logs;
                }
            })
        );

        return NextResponse.json({ workout, session: activeSession, previousLogsByExercise });
    } catch (error) {
        console.error("Failed to fetch workout details:", error);
        return NextResponse.json(
            { error: "Failed to fetch workout details" },
            { status: 500 }
        );
    }
}
