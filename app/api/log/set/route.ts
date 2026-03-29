import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";
import { detectPR } from "@/lib/pr-utils";

export async function POST(request: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            id, // Client-generated ID for idempotency/offline sync
            workoutId,
            exerciseWithMetadataId,
            exerciseId,
            setOrderIndex,
            weight,
            reps,
            rpe,
        } = body;

        if (setOrderIndex === undefined || !reps) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // --- Idempotency Check ---
        if (id) {
            const existingLog = await prisma.exerciseLog.findUnique({
                where: { id: id },
                include: { sessionExerciseLog: true }
            });

            if (existingLog) {
                if (existingLog.user_id !== userId) {
                    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                }
                // Already exists, return successful 200 (idempotent)
                return NextResponse.json({ ...existingLog, pr: existingLog.pr_type }, { status: 200 });
            }
        }

        // Get today's start and end to find or create a daily session
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let session = await prisma.workoutSession.findFirst({
            where: {
                user_id: userId,
                workout_id: workoutId || null,
                date: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });

        if (!session) {
            session = await prisma.workoutSession.create({
                data: {
                    user_id: userId,
                    workout_id: workoutId || null,
                    start_time: new Date(),
                    date: new Date(),
                },
            });
        }
        const sessionId = session.id;

        // Log the set and create its unique SessionExerciseLog in a transaction
        const exerciseLog = await prisma.$transaction(async (tx) => {
            const el = await tx.exerciseLog.create({
                data: {
                    id: id || undefined, // Use provided ID or let Prisma generate one
                    user_id: userId,
                    exerciseId: exerciseId || null,
                    set_order_index: setOrderIndex,
                    weight: weight ? parseFloat(weight) : null,
                    reps: parseInt(reps),
                    rpe: rpe ? parseFloat(rpe) : null,
                    pr_type: null, // Initial, will update below
                },
            });

            await tx.sessionExerciseLog.create({
                data: {
                    id: `sel_${el.id}`,
                    workout_session_id: sessionId,
                    exercise_with_metadata_id: exerciseWithMetadataId || null,
                    user_id: userId,
                    exercise_log_id: el.id,
                },
            });

            return el;
        });

        // --- PR Detection ---
        // Query historical best weight and best reps for this exercise,
        // EXCLUDING the log we just created to compare only past history.
        let prType: string | null = null;
        if (exerciseId) {
            const historicalBest = await prisma.exerciseLog.aggregate({
                _max: { weight: true, reps: true },
                where: {
                    user_id: userId,
                    id: { not: exerciseLog.id },
                    OR: [
                        { exerciseId: exerciseId },
                        {
                            sessionExerciseLog: {
                                exerciseWithMetadata: {
                                    exercise_id: exerciseId,
                                },
                            },
                        },
                    ],
                },
            });

            prType = detectPR({
                weight: exerciseLog.weight,
                reps: exerciseLog.reps,
                bestWeight: historicalBest._max.weight ?? null,
                bestReps: historicalBest._max.reps ?? null,
            });

            // Update the log with the detected PR type
            if (prType) {
                await prisma.exerciseLog.update({
                    where: { id: exerciseLog.id },
                    data: { pr_type: prType },
                });
            }
        }

        return NextResponse.json({ ...exerciseLog, pr_type: prType, pr: prType }, { status: 201 });
    } catch (error) {
        console.error("Failed to log set:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to log set" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const setId = searchParams.get("setId");

        if (!setId) {
            return NextResponse.json(
                { error: "Set ID is required" },
                { status: 400 }
            );
        }

        // --- Transaction-based Deletion & Session Cleanup ---
        const result = await prisma.$transaction(async (tx) => {
            // Find the log and its parent session (Principle 1: Efficiency)
            const set = await tx.exerciseLog.findUnique({
                where: { id: setId },
                include: { sessionExerciseLog: true }
            });

            if (!set) {
                throw new Error("Set not found");
            }

            if (set.user_id !== userId) {
                throw new Error("Unauthorized");
            }

            const sessionId = set.sessionExerciseLog?.workout_session_id;

            // Delete the log. Cascading delete will remove the associated SessionExerciseLog.
            await tx.exerciseLog.delete({
                where: { id: setId },
            });

            // If the set was part of a session, check if it was the LAST set (Principle 9: Reliability)
            if (sessionId) {
                const remainingSets = await tx.sessionExerciseLog.count({
                    where: { workout_session_id: sessionId }
                });

                if (remainingSets === 0) {
                    // Cleanup empty session
                    await tx.workoutSession.delete({
                        where: { id: sessionId }
                    });
                    return { message: "Set deleted and empty session purged", sessionPurged: true };
                }
            }

            return { message: "Set deleted successfully", sessionPurged: false };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Failed to delete set:", error);
        const status = error instanceof Error && (error.message === "Set not found" ? 404 : error.message === "Unauthorized" ? 403 : 500) || 500;
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to delete set" },
            { status }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { setId, weight, reps, rpe } = body;

        if (!setId || reps === undefined) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify ownership
        const set = await prisma.exerciseLog.findUnique({
            where: { id: setId },
        });

        if (!set) {
            return NextResponse.json(
                { error: "Set not found" },
                { status: 404 }
            );
        }

        if (set.user_id !== userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        const updatedSet = await prisma.exerciseLog.update({
            where: { id: setId },
            data: {
                weight: weight ? parseFloat(weight) : null,
                reps: parseInt(reps),
                rpe: rpe ? parseFloat(rpe) : null,
            },
        });

        return NextResponse.json(updatedSet);
    } catch (error) {
        console.error("Failed to update set:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to update set" },
            { status: 500 }
        );
    }
}
