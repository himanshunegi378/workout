import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { groupId } = await params;
        const userId = session.user.id;

        const group = await prisma.workoutGroup.findFirst({
            where: { id: groupId, user_id: userId },
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

        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        return NextResponse.json(group);
    } catch (error) {
        console.error("Failed to fetch workout group:", error);
        return NextResponse.json(
            { error: "Failed to fetch workout group" },
            { status: 500 }
        );
    }
}
