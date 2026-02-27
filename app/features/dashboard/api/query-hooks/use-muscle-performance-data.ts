import { useQuery } from "@tanstack/react-query";
import { MuscleGroup } from "@/app/generated/prisma/client";
import type { AnalyticsQueryPayload } from "@/app/features/analytics/server/analytics-validation";

export type MusclePerformanceData = {
    muscleGroup: MuscleGroup;
    currentWeekSets: number;
    lastWeekSets: number;
    performance: "increase" | "decrease" | "stable";
    trendDetail: string; // e.g., "↑ reps", "↓ weight", "stable"
};

export function useMusclePerformanceData() {
    return useQuery({
        queryKey: ["muscle-performance"],
        queryFn: async (): Promise<MusclePerformanceData[]> => {
            // Get date 14 days ago for previous week comparison
            const fourteenDaysAgo = new Date();
            fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
            const isoFourteenDaysAgo = fourteenDaysAgo.toISOString().split('T')[0];

            const payload: AnalyticsQueryPayload = {
                metrics: [
                    { field: "volume", aggregation: "count", alias: "sets" },
                    { field: "reps", aggregation: "avg", alias: "avg_reps" },
                    { field: "weight", aggregation: "avg", alias: "avg_weight" }
                ],
                dimensions: [
                    "session_date",
                    "muscle_group",
                ],
                filters: [
                    { field: "session_date", operator: ">=", value: isoFourteenDaysAgo }
                ],
                order_by: [],
                limit: 1000,
            };

            const res = await fetch("/api/analytics/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to fetch muscle performance data");

            const json = await res.json();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = json.data as any[];

            // Determine boundary between "current week" (last 7 days) and "last week" (days 8-14)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const sevenDaysMs = sevenDaysAgo.getTime();

            const muscleStats = new Map<string, {
                currentSets: number,
                lastSets: number,
                currentAvgWeight: number[],
                lastAvgWeight: number[],
                currentAvgReps: number[],
                lastAvgReps: number[]
            }>();

            for (const row of data) {
                const rowDateMs = new Date(row.session_date).getTime();
                const isCurrentWeek = rowDateMs >= sevenDaysMs;
                const mg = row.muscle_group as string;

                if (!muscleStats.has(mg)) {
                    muscleStats.set(mg, {
                        currentSets: 0, lastSets: 0,
                        currentAvgWeight: [], lastAvgWeight: [],
                        currentAvgReps: [], lastAvgReps: []
                    });
                }

                const stats = muscleStats.get(mg)!;
                if (isCurrentWeek) {
                    stats.currentSets += Number(row.sets);
                    stats.currentAvgWeight.push(Number(row.avg_weight));
                    stats.currentAvgReps.push(Number(row.avg_reps));
                } else {
                    stats.lastSets += Number(row.sets);
                    stats.lastAvgWeight.push(Number(row.avg_weight));
                    stats.lastAvgReps.push(Number(row.avg_reps));
                }
            }

            const result: MusclePerformanceData[] = [];

            for (const [mg, stats] of Array.from(muscleStats.entries())) {
                // If there's absolutely no data for this muscle in the last 14 days, skip
                if (stats.currentSets === 0 && stats.lastSets === 0) continue;

                const avgCWeight = stats.currentAvgWeight.length ? stats.currentAvgWeight.reduce((a, b) => a + b, 0) / stats.currentAvgWeight.length : 0;
                const avgLWeight = stats.lastAvgWeight.length ? stats.lastAvgWeight.reduce((a, b) => a + b, 0) / stats.lastAvgWeight.length : 0;

                const avgCReps = stats.currentAvgReps.length ? stats.currentAvgReps.reduce((a, b) => a + b, 0) / stats.currentAvgReps.length : 0;
                const avgLReps = stats.lastAvgReps.length ? stats.lastAvgReps.reduce((a, b) => a + b, 0) / stats.lastAvgReps.length : 0;

                let performance: "increase" | "decrease" | "stable" = "stable";
                let trendDetail = "stable";

                // Simplify trend logic: 
                // Weight takes precedence. If weight ↑, overall ↑.
                // If weight stable, but reps ↑, overall ↑.
                // (Using 5% margins to consider something "stable")
                const weightDiff = avgCWeight - avgLWeight;
                const repsDiff = avgCReps - avgLReps;

                if (avgLWeight === 0 && avgCWeight > 0) {
                    performance = "increase";
                    trendDetail = "new";
                } else if (weightDiff > (avgLWeight * 0.05)) {
                    performance = "increase";
                    trendDetail = "↑ weight";
                } else if (weightDiff < -(avgLWeight * 0.05)) {
                    performance = "decrease";
                    trendDetail = "↓ weight";
                } else if (repsDiff > (avgLReps * 0.05)) {
                    performance = "increase";
                    trendDetail = "↑ reps";
                } else if (repsDiff < -(avgLReps * 0.05)) {
                    performance = "decrease";
                    trendDetail = "↓ reps";
                }

                result.push({
                    muscleGroup: mg as MuscleGroup,
                    currentWeekSets: stats.currentSets,
                    lastWeekSets: stats.lastSets,
                    performance,
                    trendDetail
                });
            }

            // Sort by current week sets descending
            return result.sort((a, b) => b.currentWeekSets - a.currentWeekSets);
        },
    });
}
