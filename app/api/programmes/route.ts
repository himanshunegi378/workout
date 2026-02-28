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
                { error: "Programme name is required" },
                { status: 400 }
            );
        }

        const programme = await prisma.programme.create({
            data: {
                name: name.trim(),
                description: description || null,
                user_id: userId,
            },
        });

        return NextResponse.json(programme, { status: 201 });
    } catch (error) {
        console.error("Failed to create programme:", error);
        return NextResponse.json(
            { error: "Failed to create programme" },
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

        const programmes = await prisma.programme.findMany({
            where: { user_id: userId },
            select: {
                id: true,
                name: true,
                description: true,
                workouts: {
                    select: { id: true },
                },
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(programmes);
    } catch (error) {
        console.error("Failed to fetch programmes:", error);
        return NextResponse.json(
            { error: "Failed to fetch programmes" },
            { status: 500 }
        );
    }
}
