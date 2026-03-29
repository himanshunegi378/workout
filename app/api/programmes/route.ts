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
        const { id, name, description, is_active } = body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Programme name is required" },
                { status: 400 }
            );
        }

        // --- Idempotency Check ---
        if (id) {
            const existing = await prisma.programme.findUnique({
                where: { id }
            });
            if (existing) {
                if (existing.user_id !== userId) {
                    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                }
                return NextResponse.json(existing, { status: 200 });
            }
        }

        const programme = await prisma.$transaction(async (tx) => {
            if (is_active) {
                // Deactivate current active programme and close its activity log
                await tx.programme.updateMany({
                    where: { user_id: userId, is_active: true },
                    data: { is_active: false },
                });

                await tx.programmeActivityLog.updateMany({
                    where: { user_id: userId, end_time: null },
                    data: { end_time: new Date() },
                });
            }

            const newProgramme = await tx.programme.create({
                data: {
                    id: id || undefined,
                    name: name.trim(),
                    description: description || null,
                    user_id: userId,
                    is_active: !!is_active,
                },
            });

            if (is_active) {
                // Create new activity log for the new programme
                await tx.programmeActivityLog.create({
                    data: {
                        programme_id: newProgramme.id,
                        user_id: userId,
                        start_time: new Date(),
                    },
                });
            }

            return newProgramme;
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
                is_active: true,
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
