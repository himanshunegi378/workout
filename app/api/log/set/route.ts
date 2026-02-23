import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

export async function POST(request: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            workoutId,
            exerciseWithMetadataId,
            exerciseId,
            setOrderIndex,
            weight,
            reps,
        } = body;

        if (!workoutId || setOrderIndex === undefined || !reps) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get today's start and end to find or create a daily session
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let session = await prisma.workoutSession.findFirst({
            where: {
                user_id: userId,
                workout_id: workoutId,
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
                    workout_id: workoutId,
                    start_time: new Date(),
                    date: new Date(),
                },
            });
        }

        // Log the set
        const exerciseLog = await prisma.exerciseLog.create({
            data: {
                workout_session_id: session.id,
                exercise_with_metadata_id: exerciseWithMetadataId || null,
                exercise_id: exerciseId || null,
                set_order_index: setOrderIndex,
                weight: weight ? parseFloat(weight) : null,
                reps: parseInt(reps),
            },
        });

        return NextResponse.json(exerciseLog, { status: 201 });
    } catch (error: any) {
        console.error("Failed to log set:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to log set" },
            { status: 500 }
        );
    }
}
