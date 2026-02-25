import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const sessions = await prisma.workoutSession.findMany({
            where: { user_id: userId },
            orderBy: { date: "desc" },
            take: 30,
            select: {
                id: true,
                date: true,
                start_time: true,
                end_time: true,
                workout: {
                    select: {
                        name: true,
                        workoutGroup: {
                            select: { name: true },
                        },
                    },
                },
                exerciseLogs: {
                    orderBy: { set_order_index: "asc" },
                    select: {
                        id: true,
                        weight: true,
                        reps: true,
                        set_order_index: true,
                        exercise: {
                            select: {
                                id: true,
                                name: true,
                                muscle_group: true,
                            },
                        },
                        exerciseWithMetadata: {
                            select: {
                                exercise: {
                                    select: {
                                        id: true,
                                        name: true,
                                        muscle_group: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json(
            { error: "Failed to fetch sessions" },
            { status: 500 }
        );
    }
}
