import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const workoutId = searchParams.get('workoutId');
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam, 10) : 15;

        if (!workoutId) {
            return NextResponse.json({ error: "Missing workoutId parameter" }, { status: 400 });
        }

        // 1. Fetch raw logs for this specific workout template
        // We order by session_date ASC so we can calculate chronologically
        const logs = await prisma.exercise_analytics_view.findMany({
            where: {
                user_id: userId,
                workout_id: workoutId,
                // Exclude cardio from volume metrics physically
                muscle_group: { not: "Cardio" }
            },
            orderBy: {
                session_date: 'asc'
            }
        });

        if (logs.length === 0) {
            return NextResponse.json([]);
        }

        // 2. Group logs by session ID to sum total volume per session
        const sessionMap = new Map<string, { date: Date, volume: number }>();

        for (const log of logs) {
            // Ignore bodyweight-only exercises (0 weight) because it breaks mathematical volume tracking
            const actualVolume = log.volume > 0 ? log.volume : 0;

            if (!sessionMap.has(log.workout_session_id)) {
                sessionMap.set(log.workout_session_id, {
                    date: log.session_date,
                    volume: actualVolume
                });
            } else {
                const existing = sessionMap.get(log.workout_session_id)!;
                existing.volume += actualVolume;
                // Use the latest date in the session just in case of weird logging mismatches
                if (log.session_date > existing.date) {
                    existing.date = log.session_date;
                }
            }
        }

        // 3. Convert to array and ensure chronological sort
        const sessions = Array.from(sessionMap.entries()).map(([id, data]) => ({
            id,
            date: data.date,
            volume: data.volume
        })).sort((a, b) => a.date.getTime() - b.date.getTime());

        // 4. Calculate % Deltas and apply statuses
        const result = [];
        let previousVolume: number | null = null;

        for (let i = 0; i < sessions.length; i++) {
            const current = sessions[i];
            let deltaPercentage = 0;
            let status: "optimal" | "warning" | "deload" | "neutral" = "neutral";

            if (previousVolume !== null && previousVolume > 0) {
                // Calculate percentage change
                deltaPercentage = ((current.volume - previousVolume) / previousVolume) * 100;

                if (deltaPercentage < 0) {
                    status = "deload";
                } else if (deltaPercentage <= 5) {
                    status = "optimal"; // Target overload zone (0-5%)
                } else {
                    status = "warning"; // High jump (>5%)
                }
            } else if (previousVolume === 0 && current.volume > 0) {
                // Recovering from a completely empty/zero-registered session
                deltaPercentage = 100;
                status = "warning";
            }

            result.push({
                id: current.id,
                date: current.date.toISOString(),
                volume: current.volume,
                deltaPercentage: Number(deltaPercentage.toFixed(1)),
                status
            });

            // Update tracker for next iteration
            previousVolume = current.volume;
        }

        // 5. Apply the limit to get only the most recent sessions
        const limitedResult = result.slice(-limit);

        return NextResponse.json(limitedResult);

    } catch (error) {
        console.error("Failed to fetch session volume data:", error);
        return NextResponse.json({ error: "Failed to calculate session volume" }, { status: 500 });
    }
}
