import { useQuery } from "@tanstack/react-query";
import { MuscleGroup } from "@/app/generated/prisma/client";
import type { AnalyticsQueryPayload } from "@/app/features/analytics/server/analytics-validation";
import { HistoricalMuscleMetricData } from "../../types";
import { format, startOfWeek, subWeeks } from "date-fns";
import { buildHistoricalMuscleMetricData, type MuscleMetricSourceRow } from "../utils/muscle-trends";

/**
 * Fetches weekly muscle-group metrics for the Performance Pulse drawer trend chart.
 */
export function useMuscleHistoricalMetrics(muscleGroup: MuscleGroup, weeks: number = 8) {
    return useQuery({
        queryKey: ["muscle-historical-metrics", muscleGroup, weeks],
        queryFn: async (): Promise<HistoricalMuscleMetricData[]> => {
            const now = new Date();
            const startDate = subWeeks(startOfWeek(now, { weekStartsOn: 0 }), weeks - 1);
            const isoStartDate = format(startDate, 'yyyy-MM-dd');

            const payload: AnalyticsQueryPayload = {
                metrics: [
                    { field: "volume", aggregation: "sum", alias: "total_volume" },
                    { field: "weight", aggregation: "sum", alias: "total_weight" },
                    { field: "weight", aggregation: "count", alias: "loaded_sets" },
                ],
                dimensions: [
                    "session_date",
                ],
                filters: [
                    { field: "muscle_group", operator: "=", value: muscleGroup },
                    { field: "session_date", operator: ">=", value: isoStartDate },
                    { field: "weight", operator: ">", value: 0 },
                ],
                order_by: [{ field: "session_date", direction: "asc" }],
                limit: 1000,
            };

            const res = await fetch("/api/analytics/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to fetch historical volume data");

            const json = await res.json();
            const data = json.data as MuscleMetricSourceRow[];

            return buildHistoricalMuscleMetricData(data, { weeks, now });
        },
        enabled: !!muscleGroup
    });
}

export const useMuscleHistoricalVolume = useMuscleHistoricalMetrics;
