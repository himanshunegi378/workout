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

        const { name, description } = body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Workout group name is required" },
                { status: 400 }
            );
        }

        const group = await prisma.workoutGroup.create({
            data: {
                name: name.trim(),
                description: description || null,
                user_id: userId,
            },
        });

        return NextResponse.json(group, { status: 201 });
    } catch (error) {
        console.error("Failed to create workout group:", error);
        return NextResponse.json(
            { error: "Failed to create workout group" },
            { status: 500 }
        );
    }
}
