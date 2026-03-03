import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ programmeId: string }> }
) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { programmeId } = await params;

        // Verify programme belongs to user
        const programme = await prisma.programme.findFirst({
            where: { id: programmeId, user_id: userId },
            include: {
                _count: {
                    select: { workouts: true },
                },
            },
        });

        if (!programme) {
            return NextResponse.json(
                { error: "Programme not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { id, name, description } = body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Workout name is required" },
                { status: 400 }
            );
        }

        // --- Idempotency Check ---
        if (id) {
            const existing = await prisma.workout.findUnique({
                where: { id }
            });
            if (existing) {
                // Verify owner
                const prog = await prisma.programme.findUnique({
                    where: { id: existing.programme_id }
                });
                if (!prog || prog.user_id !== userId) {
                    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                }
                return NextResponse.json(existing, { status: 200 });
            }
        }

        // Calculate order index based on existing workouts
        const orderIndex = programme._count.workouts;

        const workout = await prisma.workout.create({
            data: {
                id: id || undefined,
                name: name.trim(),
                description: description || null,
                programme_id: programmeId,
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
