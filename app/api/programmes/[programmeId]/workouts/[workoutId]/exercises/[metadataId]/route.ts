import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ programmeId: string; workoutId: string; metadataId: string }> }
) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { workoutId, metadataId } = await params;
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

        // Fetch the existing EWM (and verify it belongs to this workout)
        const existingEwm = await prisma.exerciseWithMetadata.findFirst({
            where: {
                id: metadataId,
                workout_id: workoutId,
            },
        });

        if (!existingEwm) {
            return NextResponse.json(
                { error: "Exercise metadata not found" },
                { status: 404 }
            );
        }

        // Check whether a WorkoutSession (log) exists for this workout
        const existingSession = await prisma.workoutSession.findFirst({
            where: { workout_id: workoutId, user_id: userId },
        });

        let result;

        if (existingSession) {
            // Log exists — preserve history: create new EWM and hide the old one
            [result] = await prisma.$transaction([
                prisma.exerciseWithMetadata.create({
                    data: {
                        exercise_id: exercise_id ?? existingEwm.exercise_id,
                        workout_id: workoutId,
                        sets_min: sets_min ?? existingEwm.sets_min,
                        sets_max: sets_max ?? existingEwm.sets_max,
                        reps_min: reps_min ?? existingEwm.reps_min,
                        reps_max: reps_max ?? existingEwm.reps_max,
                        rest_min: rest_min ?? existingEwm.rest_min,
                        rest_max: rest_max ?? existingEwm.rest_max,
                        tempo: tempo ?? existingEwm.tempo,
                        order_index: existingEwm.order_index,
                    },
                }),
                prisma.exerciseWithMetadata.update({
                    where: { id: metadataId },
                    data: { is_hidden: true },
                }),
            ]);
        } else {
            // No log yet — safe to update in place
            result = await prisma.exerciseWithMetadata.update({
                where: { id: metadataId },
                data: {
                    ...(exercise_id !== undefined && { exercise_id }),
                    ...(sets_min !== undefined && { sets_min }),
                    ...(sets_max !== undefined && { sets_max }),
                    ...(reps_min !== undefined && { reps_min }),
                    ...(reps_max !== undefined && { reps_max }),
                    ...(rest_min !== undefined && { rest_min }),
                    ...(rest_max !== undefined && { rest_max }),
                    ...(tempo !== undefined && { tempo }),
                },
            });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Failed to edit exercise metadata:", error);
        return NextResponse.json(
            { error: "Failed to edit exercise metadata" },
            { status: 500 }
        );
    }
}
