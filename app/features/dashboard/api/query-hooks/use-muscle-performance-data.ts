import { useQuery } from "@tanstack/react-query";
import { MuscleGroup } from "@/app/generated/prisma/client";
import type { AnalyticsQueryPayload } from "@/app/features/analytics/server/analytics-validation";
import { MusclePerformanceData, ExercisePerformanceData } from "../../types";

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
                    { field: "weight", aggregation: "avg", alias: "avg_weight" },
                    { field: "volume", aggregation: "sum", alias: "total_volume" }
                ],
                dimensions: [
                    "session_date",
                    "muscle_group",
                    "exercise_name"
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
                currentVolume: number,
                lastVolume: number,
                currentAvgWeight: number[],
                lastAvgWeight: number[],
                currentAvgReps: number[],
                lastAvgReps: number[],
                exercises: Map<string, {
                    currentSets: number,
                    lastSets: number,
                    currentVolume: number,
                    lastVolume: number,
                    currentAvgWeight: number[],
                    lastAvgWeight: number[],
                    currentAvgReps: number[],
                    lastAvgReps: number[]
                }>
            }>();

            for (const row of data) {
                const rowDateMs = new Date(row.session_date).getTime();
                const isCurrentWeek = rowDateMs >= sevenDaysMs;
                const mg = row.muscle_group as string;

                if (!muscleStats.has(mg)) {
                    muscleStats.set(mg, {
                        currentSets: 0, lastSets: 0,
                        currentVolume: 0, lastVolume: 0,
                        currentAvgWeight: [], lastAvgWeight: [],
                        currentAvgReps: [], lastAvgReps: [],
                        exercises: new Map()
                    });
                }

                const stats = muscleStats.get(mg)!;
                const exName = row.exercise_name as string;

                if (!stats.exercises.has(exName)) {
                    stats.exercises.set(exName, {
                        currentSets: 0, lastSets: 0,
                        currentVolume: 0, lastVolume: 0,
                        currentAvgWeight: [], lastAvgWeight: [],
                        currentAvgReps: [], lastAvgReps: []
                    });
                }

                const exStats = stats.exercises.get(exName)!;

                if (isCurrentWeek) {
                    stats.currentSets += Number(row.sets);
                    stats.currentVolume += Number(row.total_volume);
                    stats.currentAvgWeight.push(Number(row.avg_weight));
                    stats.currentAvgReps.push(Number(row.avg_reps));

                    exStats.currentSets += Number(row.sets);
                    exStats.currentVolume += Number(row.total_volume);
                    exStats.currentAvgWeight.push(Number(row.avg_weight));
                    exStats.currentAvgReps.push(Number(row.avg_reps));
                } else {
                    stats.lastSets += Number(row.sets);
                    stats.lastVolume += Number(row.total_volume);
                    stats.lastAvgWeight.push(Number(row.avg_weight));
                    stats.lastAvgReps.push(Number(row.avg_reps));

                    exStats.lastSets += Number(row.sets);
                    exStats.lastVolume += Number(row.total_volume);
                    exStats.lastAvgWeight.push(Number(row.avg_weight));
                    exStats.lastAvgReps.push(Number(row.avg_reps));
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
                const volDiff = stats.currentVolume - stats.lastVolume;

                const getTrend = (diff: number, baseline: number): 'up' | 'down' | 'same' => {
                    if (baseline === 0) return diff > 0 ? 'up' : 'same';
                    if (diff > (baseline * 0.05)) return 'up';
                    if (diff < -(baseline * 0.05)) return 'down';
                    return 'same';
                };

                const repsTrend = getTrend(repsDiff, avgLReps);
                const weightTrend = getTrend(weightDiff, avgLWeight);
                const volumeTrend = getTrend(volDiff, stats.lastVolume);

                if (avgLWeight === 0 && avgCWeight > 0) {
                    performance = "increase";
                    trendDetail = "new";
                } else if (weightTrend === 'up') {
                    performance = "increase";
                    trendDetail = "↑ weight";
                } else if (weightTrend === 'down') {
                    performance = "decrease";
                    trendDetail = "↓ weight";
                } else if (repsTrend === 'up') {
                    performance = "increase";
                    trendDetail = "↑ reps";
                } else if (repsTrend === 'down') {
                    performance = "decrease";
                    trendDetail = "↓ reps";
                }

                // Process exercises
                const exercises: ExercisePerformanceData[] = [];
                for (const [en, eStats] of stats.exercises.entries()) {
                    const eAvgCW = eStats.currentAvgWeight.length ? eStats.currentAvgWeight.reduce((a, b) => a + b, 0) / eStats.currentAvgWeight.length : 0;
                    const eAvgLW = eStats.lastAvgWeight.length ? eStats.lastAvgWeight.reduce((a, b) => a + b, 0) / eStats.lastAvgWeight.length : 0;
                    const eAvgCR = eStats.currentAvgReps.length ? eStats.currentAvgReps.reduce((a, b) => a + b, 0) / eStats.currentAvgReps.length : 0;
                    const eAvgLR = eStats.lastAvgReps.length ? eStats.lastAvgReps.reduce((a, b) => a + b, 0) / eStats.lastAvgReps.length : 0;

                    const eWD = eAvgCW - eAvgLW;
                    const eRD = eAvgCR - eAvgLR;
                    const eVD = eStats.currentVolume - eStats.lastVolume;

                    const eRT = getTrend(eRD, eAvgLR);
                    const eWT = getTrend(eWD, eAvgLW);
                    const eVT = getTrend(eVD, eStats.lastVolume);

                    let ep: "increase" | "decrease" | "stable" = "stable";
                    let etd = "stable";

                    if (eAvgLW === 0 && eAvgCW > 0) { ep = "increase"; etd = "new"; }
                    else if (eWT === 'up') { ep = "increase"; etd = "↑ weight"; }
                    else if (eWT === 'down') { ep = "decrease"; etd = "↓ weight"; }
                    else if (eRT === 'up') { ep = "increase"; etd = "↑ reps"; }
                    else if (eRT === 'down') { ep = "decrease"; etd = "↓ reps"; }

                    exercises.push({
                        name: en,
                        currentWeekSets: eStats.currentSets,
                        lastWeekSets: eStats.lastSets,
                        currentWeekVolume: eStats.currentVolume,
                        lastWeekVolume: eStats.lastVolume,
                        repsTrend: eRT,
                        weightTrend: eWT,
                        volumeTrend: eVT,
                        performance: ep,
                        trendDetail: etd
                    });
                }

                result.push({
                    muscleGroup: mg as MuscleGroup,
                    currentWeekSets: stats.currentSets,
                    lastWeekSets: stats.lastSets,
                    currentWeekVolume: stats.currentVolume,
                    lastWeekVolume: stats.lastVolume,
                    repsTrend,
                    weightTrend,
                    volumeTrend,
                    performance,
                    trendDetail,
                    exercises: exercises.sort((a, b) => b.currentWeekVolume - a.currentWeekVolume)
                });
            }

            // Sort by current week sets descending
            return result.sort((a, b) => b.currentWeekSets - a.currentWeekSets);
        },
    });
}
