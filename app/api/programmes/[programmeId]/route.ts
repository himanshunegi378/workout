import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ programmeId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { programmeId } = await params;
        const userId = session.user.id;

        const programme = await prisma.programme.findFirst({
            where: { id: programmeId, user_id: userId },
            select: {
                id: true,
                name: true,
                workouts: {
                    orderBy: { order_index: "asc" },
                    select: {
                        id: true,
                        name: true,
                        order_index: true,
                        exercisesWithMetadata: {
                            orderBy: { order_index: "asc" },
                            take: 3,
                            select: {
                                exercise: { select: { name: true } },
                            },
                        },
                        _count: {
                            select: { exercisesWithMetadata: true },
                        },
                    },
                },
            },
        });

        if (!programme) {
            return NextResponse.json({ error: "Programme not found" }, { status: 404 });
        }

        return NextResponse.json(programme);
    } catch (error) {
        console.error("Failed to fetch programme:", error);
        return NextResponse.json(
            { error: "Failed to fetch programme" },
            { status: 500 }
        );
    }
}
