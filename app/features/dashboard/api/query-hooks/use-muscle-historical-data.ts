import { useQuery } from "@tanstack/react-query";
import { MuscleGroup } from "@/app/generated/prisma/client";
import type { AnalyticsQueryPayload } from "@/app/features/analytics/server/analytics-validation";
import { HistoricalVolumeData } from "../../types";
import { startOfWeek, subWeeks, format, isSameWeek } from "date-fns";

export function useMuscleHistoricalVolume(muscleGroup: MuscleGroup, weeks: number = 8) {
    return useQuery({
        queryKey: ["muscle-historical-volume", muscleGroup, weeks],
        queryFn: async (): Promise<HistoricalVolumeData[]> => {
            const now = new Date();
            const startDate = subWeeks(startOfWeek(now, { weekStartsOn: 0 }), weeks - 1);
            const isoStartDate = format(startDate, 'yyyy-MM-dd');

            const payload: AnalyticsQueryPayload = {
                metrics: [
                    { field: "volume", aggregation: "sum", alias: "total_volume" }
                ],
                dimensions: [
                    "session_date",
                ],
                filters: [
                    { field: "muscle_group", operator: "=", value: muscleGroup },
                    { field: "session_date", operator: ">=", value: isoStartDate }
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = json.data as any[];
            // Prepare buckets for each week
            const historicalData: (HistoricalVolumeData & { weekDate: Date })[] = [];
            for (let i = 0; i < weeks; i++) {
                const weekStart = subWeeks(startOfWeek(now, { weekStartsOn: 0 }), (weeks - 1) - i);
                const isCurrent = isSameWeek(weekStart, now, { weekStartsOn: 0 });
                
                historicalData.push({
                    weekDate: weekStart,
                    weekStart: format(weekStart, 'yyyy-MM-dd'),
                    label: isCurrent ? 'Current' : format(weekStart, 'MMM d'),
                    volume: 0
                });
            }

            // Fill buckets
            for (const row of data) {
                // Parse date safely to avoid timezone shifts and handle time-suffixes
                // session_date can be "YYYY-MM-DD", "YYYY-MM-DD HH:MM:SS", or ISO string
                const rowDateStr = String(row.session_date).split(' ')[0].split('T')[0];
                const [year, month, day] = rowDateStr.split('-').map(Number);
                
                if (isNaN(year) || isNaN(month) || isNaN(day)) continue;
                const rowDate = new Date(year, month - 1, day);

                const bucketIndex = historicalData.findIndex(bucket => 
                    isSameWeek(bucket.weekDate, rowDate, { weekStartsOn: 0 })
                );

                if (bucketIndex !== -1) {
                    historicalData[bucketIndex].volume += Number(row.total_volume);
                }
            }

            return historicalData;
        },
        enabled: !!muscleGroup
    });
}
