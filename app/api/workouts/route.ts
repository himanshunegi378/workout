import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";
import { Prisma } from "@/app/generated/prisma";

export async function GET(request: NextRequest) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const onlyActive = searchParams.get("active") === "true";

        const programmeFilter: Prisma.ProgrammeWhereInput = {
            user_id: userId,
        };

        if (onlyActive) {
            programmeFilter.is_active = true;
        }

        const filter: Prisma.WorkoutWhereInput = {
            programme: programmeFilter
        };

        const workouts = await prisma.workout.findMany({
            where: filter,
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
