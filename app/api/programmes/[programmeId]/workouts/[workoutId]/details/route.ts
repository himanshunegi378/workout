import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { startOfDay, addDays } from "date-fns";



export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ programmeId: string; workoutId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { programmeId, workoutId } = await params;
        const userId = session.user.id;

        const today = startOfDay(new Date());
        const tomorrow = addDays(today, 1);

        // 1. Unified Query for Workout, Active Session, and Exercise History (Principles 1, 6, 10)
        const workoutData = await prisma.workout.findFirst({
            where: {
                id: workoutId,
                programme: { id: programmeId, user_id: userId },
            },
            relationLoadStrategy: "join",
            select: {
                id: true,
                name: true,
                exercisesWithMetadata: {
                    where: { is_hidden: false },
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
                        exercise: {
                            select: {
                                id: true,
                                name: true,
                                muscle_group: true,
                                // Join historical logs here (Principle 6: Scalability)
                                exerciseLogs: {
                                    where: {
                                        user_id: userId,
                                        date: { lt: today }
                                    },
                                    orderBy: [
                                        { date: 'desc' },
                                        { set_order_index: 'asc' }
                                    ],
                                    take: 15, // Sufficient to cover most "last sessions"
                                    select: {
                                        id: true,
                                        weight: true,
                                        reps: true,
                                        rpe: true,
                                        set_order_index: true,
                                        date: true,
                                        sessionExerciseLog: {
                                            select: { workout_session_id: true }
                                        }
                                    }
                                }
                            },
                        },
                    },
                },
                // Join today's active session (Principle 1: Efficiency)
                workoutSessions: {
                    where: {
                        user_id: userId,
                        date: { gte: today, lt: tomorrow },
                    },
                    take: 1,
                    select: {
                        id: true,
                        sessionExerciseLogs: {
                            select: {
                                id: true,
                                exercise_with_metadata_id: true,
                                exerciseLog: {
                                    select: {
                                        id: true,
                                        exerciseId: true,
                                        weight: true,
                                        reps: true,
                                        rpe: true,
                                        set_order_index: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!workoutData) {
            return NextResponse.json({ error: "Workout not found" }, { status: 404 });
        }

        // 2. Post-process the unified result (Principle 7: Maintainability)
        const { workoutSessions, ...workout } = workoutData;
        const activeSession = workoutSessions[0] || null;

        interface ExerciseLogOutput {
            id: string;
            weight: number | null;
            reps: number;
            rpe: number | null;
            set_order_index: number;
        }

        const previousLogsByExercise: Record<string, ExerciseLogOutput[]> = {};

        workout.exercisesWithMetadata.forEach((ewm) => {
            const logs = ewm.exercise?.exerciseLogs || [];
            if (logs.length > 0) {
                // The first log is the most recent (due to order_index: desc)
                // We identify its session and collect all logs from that same session
                const lastSessionId = logs[0].sessionExerciseLog?.workout_session_id;

                if (lastSessionId) {
                    previousLogsByExercise[ewm.exercise_id] = logs
                        .filter(l => l.sessionExerciseLog?.workout_session_id === lastSessionId)
                        .map(l => ({
                            id: l.id,
                            weight: l.weight,
                            reps: l.reps,
                            rpe: l.rpe,
                            set_order_index: l.set_order_index
                        }))
                        .sort((a, b) => a.set_order_index - b.set_order_index);
                }
            }
        });

        return NextResponse.json({
            workout,
            session: activeSession,
            previousLogsByExercise
        });

    } catch (error) {
        // Principle 5: Observability
        console.error("[GET_WORKOUT_DETAILS_API_ERROR]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
