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

        // Verify ownership and delete
        const set = await prisma.exerciseLog.findUnique({
            where: { id: setId },
            include: {
                workoutSession: true,
            },
        });

        if (!set) {
            return NextResponse.json(
                { error: "Set not found" },
                { status: 404 }
            );
        }

        if (set.workoutSession.user_id !== userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        await prisma.exerciseLog.delete({
            where: { id: setId },
        });

        return NextResponse.json({ message: "Set deleted successfully" });
    } catch (error: any) {
        console.error("Failed to delete set:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to delete set" },
            { status: 500 }
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
        const { setId, weight, reps } = body;

        if (!setId || reps === undefined) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify ownership
        const set = await prisma.exerciseLog.findUnique({
            where: { id: setId },
            include: {
                workoutSession: true,
            },
        });

        if (!set) {
            return NextResponse.json(
                { error: "Set not found" },
                { status: 404 }
            );
        }

        if (set.workoutSession.user_id !== userId) {
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
            },
        });

        return NextResponse.json(updatedSet);
    } catch (error: any) {
        console.error("Failed to update set:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to update set" },
            { status: 500 }
        );
    }
}
