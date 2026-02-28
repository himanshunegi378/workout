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
                _count: { select: { exercisesWithMetadata: true } },
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
            exercise_id,
            sets_min,
            sets_max,
            reps_min,
            reps_max,
            rest_min,
            rest_max,
            tempo,
        } = body;

        if (!exercise_id) {
            return NextResponse.json(
                { error: "Exercise is required" },
                { status: 400 }
            );
        }

        const orderIndex = workout._count.exercisesWithMetadata;

        const ewm = await prisma.exerciseWithMetadata.create({
            data: {
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


