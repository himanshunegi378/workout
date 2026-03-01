import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Domain: Backend/API Development
 * 
 * 1. Efficiency: Minimizing database queries to reduce latency and server load.
 * 2. Type Safety: Using TypeScript effectively to catch errors at compile time.
 * 3. Security: Ensuring users can only access and modify their own data.
 * 4. Consistency: Maintaining a predictable structure for responses and error handling.
 * 5. Observability: Including meaningful logging for production debugging.
 * 6. Scalability: Avoiding N+1 queries to ensure performance as data grows.
 * 7. Maintainability: Writing clean, modular, and well-documented code.
 * 8. Statelessness: Ensuring API routes are independent and easily testable.
 * 9. Reliability: Handling edge cases and potential failures gracefully.
 * 10. Resource Optimization: Selecting only necessary fields to minimize bandwidth.
 */

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

        // Fetch programme with optimized selection (Principle 10: Resource Optimization)
        const programme = await prisma.programme.findFirst({
            where: { id: programmeId, user_id: userId },
            relationLoadStrategy: "join",
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
                            // Only show active exercises (Principle 9: Reliability)
                            where: { is_hidden: false },
                            orderBy: { order_index: "asc" },
                            take: 3, // Preview limit
                            select: {
                                exercise: { select: { name: true } },
                            },
                        },
                        _count: {
                            select: {
                                exercisesWithMetadata: {
                                    // Count only active exercises
                                    where: { is_hidden: false }
                                }
                            },
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
        // Principle 5: Observability
        console.error("[GET_PROGRAMME_API_ERROR]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
