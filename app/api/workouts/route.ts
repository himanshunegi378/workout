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
                programme: {
                    user_id: userId
                }
            },
            select: {
                id: true,
                name: true,
                programme: {
                    select: { name: true }
                }
            },
            orderBy: [
                { programme: { name: 'asc' } },
                { order_index: 'asc' }
            ]
        });

        return NextResponse.json(workouts);
    } catch (error) {
        console.error("Failed to fetch workouts:", error);
        return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
    }
}
