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

        const dateRange = getDateRange(request.nextUrl.searchParams);
        if ("error" in dateRange) {
            return NextResponse.json({ error: dateRange.error }, { status: 400 });
        }

        const exerciseIds = getExerciseIds(request.nextUrl.searchParams);
        if (exerciseIds.length === 0) {
            return NextResponse.json({ error: "Missing exerciseId query parameter" }, { status: 400 });
        }

        const logs = await prisma.exerciseLog.findMany({
            where: {
                user_id: session.user.id,
                AND: [
                    {
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
                    ...getDateFilterClauses(dateRange),
                ],
            },
            orderBy: [
                { sessionExerciseLog: { workoutSession: { date: "desc" } } },
                { date: "asc" },
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

/**
 * Parses optional ISO date bounds used to limit the returned exercise history.
 */
function getDateRange(searchParams: URLSearchParams): { from: Date | null; to: Date | null } | { error: string } {
    const from = parseIsoDate(searchParams.get("from"), "from");
    if ("error" in from) return { error: from.error };

    const to = parseIsoDate(searchParams.get("to"), "to");
    if ("error" in to) return { error: to.error };

    if (from.value && to.value && from.value > to.value) {
        return { error: "`from` must be before or equal to `to`" };
    }

    return { from: from.value, to: to.value };
}

/**
 * Validates an ISO date or timestamp query param and normalizes it to Date.
 */
function parseIsoDate(value: string | null, paramName: "from" | "to"): { value: Date | null } | { error: string } {
    if (!value) {
        return { value: null };
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return { error: `Invalid \`${paramName}\` query parameter` };
    }

    return { value: parsed };
}

/**
 * Builds date filters for both workout-linked logs and direct ad-hoc logs.
 */
function getDateFilterClauses(dateRange: { from: Date | null; to: Date | null }) {
    if (!dateRange.from && !dateRange.to) {
        return [];
    }

    const sessionDate = {
        ...(dateRange.from ? { gte: dateRange.from } : {}),
        ...(dateRange.to ? { lte: dateRange.to } : {}),
    };

    const adHocDate = {
        ...(dateRange.from ? { gte: dateRange.from } : {}),
        ...(dateRange.to ? { lte: dateRange.to } : {}),
    };

    return [
        {
            OR: [
                {
                    sessionExerciseLog: {
                        is: {
                            workoutSession: {
                                date: sessionDate,
                            },
                        },
                    },
                },
                {
                    AND: [
                        { sessionExerciseLog: { is: null } },
                        { date: adHocDate },
                    ],
                },
            ],
        },
    ];
}
