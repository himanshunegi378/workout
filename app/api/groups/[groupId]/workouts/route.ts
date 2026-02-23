import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { groupId } = await params;

        // Verify group belongs to user
        const group = await prisma.workoutGroup.findFirst({
            where: { id: groupId, user_id: userId },
            include: {
                _count: {
                    select: { workouts: true },
                },
            },
        });

        if (!group) {
            return NextResponse.json(
                { error: "Workout program not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { name, description } = body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Workout name is required" },
                { status: 400 }
            );
        }

        // Calculate order index based on existing workouts
        const orderIndex = group._count.workouts;

        const workout = await prisma.workout.create({
            data: {
                name: name.trim(),
                description: description || null,
                workout_group_id: groupId,
                order_index: orderIndex,
            },
        });

        return NextResponse.json(workout, { status: 201 });
    } catch (error) {
        console.error("Failed to create workout:", error);
        return NextResponse.json(
            { error: "Failed to create workout" },
            { status: 500 }
        );
    }
}
