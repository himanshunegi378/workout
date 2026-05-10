import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ programmeId: string; workoutId: string }> }
) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { programmeId, workoutId } = await params;

        // Verify the workout belongs to the user
        const workout = await prisma.workout.findFirst({
            where: {
                id: workoutId,
                programme: { id: programmeId, user_id: userId },
            },
            include: {
                _count: {
                    select: {
                        exercisesWithMetadata: {
                            where: { is_hidden: false },
                        },
                    },
                },
            },
        });

        if (!workout) {
            return NextResponse.json(
                { error: "Workout not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const {
            id,
            exercise_id,
            sets_min,
            sets_max,
            reps_min,
            reps_max,
            rest_min,
            rest_max,
            tempo,
        } = body;

        // --- Idempotency Check ---
        if (id) {
            const existing = await prisma.exerciseWithMetadata.findUnique({
                where: { id }
            });
            if (existing) {
                // Verify ownership via workout relationship
                const workoutVerify = await prisma.workout.findFirst({
                    where: { id: existing.workout_id, programme: { user_id: userId } }
                });
                if (!workoutVerify) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                return NextResponse.json(existing, { status: 200 });
            }
        }

        if (!exercise_id) {
            return NextResponse.json(
                { error: "Exercise is required" },
                { status: 400 }
            );
        }

        const exercise = await prisma.exercise.findFirst({
            where: {
                id: exercise_id,
                OR: [
                    { user_id: userId },
                    { is_global: true },
                ],
            },
            select: { id: true },
        });

        if (!exercise) {
            return NextResponse.json(
                { error: "Exercise not found" },
                { status: 404 }
            );
        }

        // --- Calculate Order Index ---
        // We use _aggregate to find the current max order_index to avoid duplicates
        // if exercises have been hidden (soft-deleted).
        const aggregate = await prisma.exerciseWithMetadata.aggregate({
            where: { workout_id: workoutId },
            _max: { order_index: true },
        });

        const orderIndex = (aggregate._max.order_index ?? -1) + 1;

        const ewm = await prisma.exerciseWithMetadata.create({
            data: {
                id: id || undefined,
                exercise_id,
                workout_id: workoutId,
                sets_min,
                sets_max,
                reps_min,
                reps_max,
                rest_min,
                rest_max,
                tempo,
                order_index: orderIndex,
            },
        });

        return NextResponse.json(ewm, { status: 201 });
    } catch (error) {
        console.error("Failed to link exercise to workout:", error);
        return NextResponse.json(
            { error: "Failed to link exercise" },
            { status: 500 }
        );
    }
}
