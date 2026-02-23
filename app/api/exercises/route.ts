import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

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

        const { name, description, muscle_group } = body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Exercise name is required" },
                { status: 400 }
            );
        }

        const validGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];
        if (!muscle_group || !validGroups.includes(muscle_group)) {
            return NextResponse.json(
                { error: "Valid muscle group is required" },
                { status: 400 }
            );
        }

        const exercise = await prisma.exercise.create({
            data: {
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
