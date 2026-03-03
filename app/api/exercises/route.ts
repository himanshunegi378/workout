import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";
import { MuscleGroup } from "@/app/generated/prisma/client";

export async function POST(request: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const { id, name, description, muscle_group } = body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Exercise name is required" },
                { status: 400 }
            );
        }

        // --- Idempotency Check ---
        if (id) {
            const existing = await prisma.exercise.findUnique({
                where: { id }
            });
            if (existing) {
                if (existing.user_id !== userId) {
                    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                }
                return NextResponse.json(existing, { status: 200 });
            }
        }

        if (!muscle_group || !Object.values(MuscleGroup).includes(muscle_group as MuscleGroup)) {
            return NextResponse.json(
                { error: "Valid muscle group is required" },
                { status: 400 }
            );
        }

        const exercise = await prisma.exercise.create({
            data: {
                id: id || undefined,
                name: name.trim(),
                description: description || null,
                muscle_group,
                user_id: userId,
            },
        });

        return NextResponse.json(exercise, { status: 201 });
    } catch (error) {
        console.error("Failed to create exercise:", error);
        return NextResponse.json(
            { error: "Failed to create exercise" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const exercises = await prisma.exercise.findMany({
            where: {
                OR: [
                    { user_id: userId },
                    { user_id: "system" } // Handle global exercises if any
                ]
            },
            orderBy: [{ muscle_group: "asc" }, { name: "asc" }],
            select: {
                id: true,
                name: true,
                description: true,
                muscle_group: true,
            },
        });

        return NextResponse.json(exercises);
    } catch (error) {
        console.error("Failed to fetch exercises:", error);
        return NextResponse.json(
            { error: "Failed to fetch exercises" },
            { status: 500 }
        );
    }
}
