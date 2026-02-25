import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ exerciseId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { exerciseId } = await params;

        const logs = await prisma.exerciseLog.findMany({
            where: {
                OR: [
                    { exercise_id: exerciseId },
                    { exerciseWithMetadata: { exercise_id: exerciseId } }
                ],
                workoutSession: {
                    user_id: session.user.id,
                },
            },
            orderBy: [
                { workoutSession: { date: "desc" } },
                { set_order_index: "asc" },
            ],
            include: {
                workoutSession: {
                    select: {
                        date: true,
                        start_time: true,
                    },
                },
                exerciseWithMetadata: {
                    select: {
                        reps_min: true,
                        reps_max: true,
                        sets_min: true,
                        sets_max: true,

                        tempo: true,
                        rest_min: true,
                        rest_max: true,
                    },
                },
            },
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error("Error fetching exercise logs:", error);
        return NextResponse.json(
            { error: "Failed to fetch exercise logs" },
            { status: 500 }
        );
    }
}
