import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";
import { startOfDay, subDays, addDays } from "date-fns";
import { generateACWRTimeSeries, DailySetCount } from "@/app/features/dashboard/api/utils/calculate-acwr";

export async function GET(request: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        // Default to a 30-day view ending today if not provided
        const endDateParam = searchParams.get("endDate");
        const daysParam = searchParams.get("days");

        const targetEndDate = endDateParam ? startOfDay(new Date(endDateParam)) : startOfDay(new Date());
        const daysToView = daysParam ? parseInt(daysParam, 10) : 30;
        const targetStartDate = subDays(targetEndDate, daysToView - 1);

        // ACWR calculation needs an extra 27 days before the start date to build the chronic load
        const calculationStartDate = subDays(targetStartDate, 27);

        // 1. Fetch user's first ever log date to handle "Calibrating" state
        const firstLog = await prisma.exerciseLog.findFirst({
            where: { user_id: userId },
            orderBy: { date: 'asc' },
            select: { date: true }
        });

        const firstEverLogDate = firstLog?.date || null;

        // 2. Fetch all sets (excluding Cardio) since the calculation start date
        const logs = await prisma.exerciseLog.findMany({
            where: {
                user_id: userId,
                date: {
                    gte: calculationStartDate,
                    lte: addDays(targetEndDate, 1) // Ensure we capture the whole end date
                },
                OR: [
                    { exercise: { muscle_group: { not: "Cardio" } } },
                    {
                        sessionExerciseLog: {
                            exerciseWithMetadata: {
                                exercise: { muscle_group: { not: "Cardio" } }
                            }
                        }
                    }
                ]
            },
            select: {
                date: true
            }
        });

        // 3. Aggregate sparse logs by Date
        const logMap = new Map<string, number>();
        for (const log of logs) {
            // Use local date string assuming the DB date represents the actual session date.
            // Using ISO strings to extract just the YYYY-MM-DD
            const dateStr = log.date.toISOString().split("T")[0];
            logMap.set(dateStr, (logMap.get(dateStr) || 0) + 1); // Each record is 1 set
        }

        const dailyLogs: DailySetCount[] = Array.from(logMap.entries()).map(([date, totalSets]) => ({
            date,
            totalSets
        }));

        // 4. Generate the Time Series Data
        const timeSeries = generateACWRTimeSeries(
            dailyLogs,
            targetStartDate,
            targetEndDate,
            firstEverLogDate
        );
        const hasMoreHistory = firstEverLogDate ? startOfDay(firstEverLogDate) < calculationStartDate : false;

        return NextResponse.json({
            timeSeries,
            hasMoreHistory
        }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch fatigue data:", error);
        return NextResponse.json(
            { error: "Failed to calculate fatigue analytics" },
            { status: 500 }
        );
    }
}
