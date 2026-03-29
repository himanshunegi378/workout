import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { sessionId } = await params;
        const userId = session.user.id;

        // 1. Check for logged sets (Principle: Data Integrity)
        const sessionWithLogs = await prisma.workoutSession.findUnique({
            where: { id: sessionId, user_id: userId },
            select: {
                _count: {
                    select: { sessionExerciseLogs: true }
                }
            }
        });

        if (!sessionWithLogs) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // 2. Conditional Handling: Discard or Finish
        if (sessionWithLogs._count.sessionExerciseLogs === 0) {
            // No sets logged, discard the session entirely
            await prisma.workoutSession.delete({
                where: { id: sessionId }
            });

            return NextResponse.json({
                message: "Session discarded (zero sets logged)",
                discarded: true
            });
        }

        // Sets were logged, formally finish the session
        const updatedSession = await prisma.workoutSession.update({
            where: { id: sessionId },
            data: { end_time: new Date() },
        });

        return NextResponse.json({
            ...updatedSession,
            discarded: false
        });
    } catch (error) {
        console.error("[FINISH_SESSION_API_ERROR]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
