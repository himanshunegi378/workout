import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

export async function GET() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch all workouts authored by the user to populate the chart dropdown
        const workouts = await prisma.workout.findMany({
            where: {
                workoutGroup: {
                    user_id: userId
                }
            },
            select: {
                id: true,
                name: true,
                workoutGroup: {
                    select: { name: true }
                }
            },
            orderBy: [
                { workoutGroup: { name: 'asc' } },
                { order_index: 'asc' }
            ]
        });

        return NextResponse.json(workouts);
    } catch (error) {
        console.error("Failed to fetch workouts:", error);
        return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
    }
}
