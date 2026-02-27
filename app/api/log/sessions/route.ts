import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import type { SessionWithLogs } from "@/app/features/logging/types";
import { Prisma } from "@/app/generated/prisma/client";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const grouped = searchParams.get("grouped") === "true";
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const fromDate = searchParams.get("from");

        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const whereClause: Prisma.WorkoutSessionWhereInput = {
            user_id: userId,
            exerciseLogs: {
                some: {
                    OR: [
                        { exercise: { isNot: null } },
                        { exerciseWithMetadata: { isNot: null } },
                    ],
                },
            },
        };

        if (fromDate) {
            whereClause.date = { lt: new Date(fromDate) };
        }

        const sessions = await prisma.workoutSession.findMany({
            where: whereClause,
            orderBy: { date: "desc" },
            take: limit,
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

        const pagination = {
            from: sessions.length > 0 ? sessions[0].date.toISOString() : null,
            to: sessions.length > 0 ? sessions[sessions.length - 1].date.toISOString() : null,
            hasMore: sessions.length === limit,
        };

        if (grouped) {
            const data = groupByDate(sessions);
            return NextResponse.json({ data, pagination });
        }

        return NextResponse.json({ data: sessions, pagination });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json(
            { error: "Failed to fetch sessions" },
            { status: 500 }
        );
    }
}


function groupByDate(sessions: SessionWithLogs[]) {
    const map = new Map<string, { label: string; sessions: SessionWithLogs[] }>();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toISOString().split("T")[0];
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    for (const s of sessions) {
        // Filter out sessions with no valid exercise logs
        const hasLogs = s.exerciseLogs.some((log) =>
            log.exerciseWithMetadata?.exercise || log.exercise
        );
        if (!hasLogs) continue;

        const d = new Date(s.date);
        const key = d.toISOString().split("T")[0];

        let label: string;
        if (key === todayStr) {
            label = "Today";
        } else if (key === yesterdayStr) {
            label = "Yesterday";
        } else {
            label = d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        }

        if (!map.has(key)) {
            map.set(key, { label, sessions: [] });
        }
        map.get(key)!.sessions.push(s);
    }

    return Array.from(map.values());
}
