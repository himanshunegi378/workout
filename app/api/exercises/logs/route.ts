import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Fetches set history for one or more exercises, supporting both direct 
 * exercise associations and sets linked via session metadata.
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const exerciseIds = getExerciseIds(request.nextUrl.searchParams);
        if (exerciseIds.length === 0) {
            return NextResponse.json({ error: "Missing exerciseId query parameter" }, { status: 400 });
        }

        const logs = await prisma.exerciseLog.findMany({
            where: {
                user_id: session.user.id,
                OR: [
                    { exerciseId: { in: exerciseIds } },
                    {
                        sessionExerciseLog: {
                            exerciseWithMetadata: {
                                exercise_id: { in: exerciseIds }
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
                exerciseId: true,
                weight: true,
                reps: true,
                rpe: true,
                set_order_index: true,
                pr_type: true,
                date: true,
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
                                exercise_id: true,
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

        // Preserve the public history shape while hiding Prisma's join model.
        const flattenedLogs = logs.map(log => ({
            id: log.id,
            exerciseId: log.exerciseId ?? log.sessionExerciseLog?.exerciseWithMetadata?.exercise_id ?? null,
            weight: log.weight,
            reps: log.reps,
            rpe: log.rpe,
            set_order_index: log.set_order_index,
            pr_type: log.pr_type,
            workoutSession: log.sessionExerciseLog?.workoutSession
                ? {
                    date: log.sessionExerciseLog.workoutSession.date.toISOString(),
                    start_time: log.sessionExerciseLog.workoutSession.start_time?.toISOString() ?? null,
                }
                : {
                    date: log.date.toISOString(),
                    start_time: null
                },
            exerciseWithMetadata: log.sessionExerciseLog?.exerciseWithMetadata
                ? {
                    reps_min: log.sessionExerciseLog.exerciseWithMetadata.reps_min,
                    reps_max: log.sessionExerciseLog.exerciseWithMetadata.reps_max,
                    sets_min: log.sessionExerciseLog.exerciseWithMetadata.sets_min,
                    sets_max: log.sessionExerciseLog.exerciseWithMetadata.sets_max,
                    tempo: log.sessionExerciseLog.exerciseWithMetadata.tempo,
                    rest_min: log.sessionExerciseLog.exerciseWithMetadata.rest_min,
                    rest_max: log.sessionExerciseLog.exerciseWithMetadata.rest_max,
                }
                : null,
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

/**
 * Parses exercise IDs from query parameters, supporting array-style keys
 * ('exerciseId' or 'exerciseIds') and comma-separated string values.
 */
function getExerciseIds(searchParams: URLSearchParams) {
    return [...new Set([...searchParams.getAll("exerciseId"), ...searchParams.getAll("exerciseIds")]
        .flatMap((value) => value.split(","))
        .map((value) => value.trim())
        .filter(Boolean))]
        .sort();
}
