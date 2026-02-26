import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

export async function GET() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessions = await prisma.workoutSession.findMany({
            where: { user_id: userId },
            select: {
                date: true,
                workout: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                exerciseLogs: {
                    select: {
                        weight: true,
                        reps: true,
                    },
                },
            },
            orderBy: {
                date: "asc",
            },
        });

        // Group by workout ID
        const workoutsMap = new Map<
            string,
            { name: string; sessions: Map<string, { volume: number; sessionCount: number }> }
        >();

        for (const session of sessions) {
            const workoutId = session.workout.id;
            const workoutName = session.workout.name;
            const dateStr = session.date.toISOString().split("T")[0];

            if (!workoutsMap.has(workoutId)) {
                workoutsMap.set(workoutId, { name: workoutName, sessions: new Map() });
            }

            const workoutGroup = workoutsMap.get(workoutId)!;

            let sessionVolume = 0;
            for (const log of session.exerciseLogs) {
                const weight = log.weight ?? 0;
                sessionVolume += weight * log.reps;
            }

            if (sessionVolume === 0) continue;

            const current = workoutGroup.sessions.get(dateStr) ?? { volume: 0, sessionCount: 0 };
            workoutGroup.sessions.set(dateStr, {
                volume: current.volume + sessionVolume,
                sessionCount: current.sessionCount + 1,
            });
        }

        // Format and calculate percent changes
        const result = Array.from(workoutsMap.entries())
            .filter(([_, data]) => data.sessions.size > 0)
            .map(([workoutId, data]) => {
                const sortedSessions = Array.from(data.sessions.entries()).sort(
                    (a, b) => a[0].localeCompare(b[0])
                );

                const formattedSessions = sortedSessions.map(([date, sessionData], index) => {
                    let percentChange: number | null = null;

                    if (index > 0) {
                        const prevVolume = sortedSessions[index - 1][1].volume;
                        if (prevVolume > 0) {
                            percentChange = Number((((sessionData.volume - prevVolume) / prevVolume) * 100).toFixed(1));
                        } else if (sessionData.volume > 0) {
                            percentChange = 100;
                        } else {
                            percentChange = 0;
                        }
                    }

                    return {
                        date,
                        volume: sessionData.volume,
                        sessionCount: sessionData.sessionCount,
                        percentChange,
                    };
                });

                return {
                    workoutId,
                    workoutName: data.name,
                    sessions: formattedSessions,
                };
            });

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch session volume:", error);
        return NextResponse.json(
            { error: "Failed to fetch session volume" },
            { status: 500 }
        );
    }
}
