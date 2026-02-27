import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "../query-keys";
import type { AnalyticsQueryPayload } from "@/app/features/analytics/server/analytics-validation";
import { VolumeDataPoint } from "../../types";



export function useVolumeData() {
    return useQuery({
        queryKey: dashboardKeys.volume(),
        queryFn: async (): Promise<VolumeDataPoint[]> => {
            const payload: AnalyticsQueryPayload = {
                metrics: [{ field: "volume", aggregation: "sum", alias: "total_volume" }],
                dimensions: [
                    "session_date",
                    "workout_id",
                    "workout_name",
                    "muscle_group",
                    "exercise_name"
                ],
                filters: [
                    // Filter out ad-hoc exercises if needed, or keep them. We'll keep them for total volume.
                ],
                order_by: [],
                limit: 1000,
            };

            const res = await fetch("/api/analytics/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to fetch volume data via Analytics API");

            const json = await res.json();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = json.data as any[];

            // Reshape the flat analytics response into the grouped VolumeDataPoint shape 
            // that the existing Dashboard UI expects.
            const grouped = new Map<string, VolumeDataPoint>();

            for (const row of data) {
                // Formatting session_date into YYYY-MM-DD
                const dateSplit = new Date(row.session_date).toISOString().split('T')[0];
                const key = `${dateSplit}-${row.workout_id}-${row.muscle_group}`;

                if (!grouped.has(key)) {
                    grouped.set(key, {
                        date: dateSplit,
                        workoutId: row.workout_id,
                        workoutName: row.workout_name,
                        muscleGroup: row.muscle_group,
                        volume: 0,
                        exercises: []
                    });
                }

                const point = grouped.get(key)!;
                point.volume += Number(row.total_volume);

                // Aggregate exercise names
                const existingEx = point.exercises.find((e: { name: string; volume: number }) => e.name === row.exercise_name);
                if (existingEx) {
                    existingEx.volume += Number(row.total_volume);
                } else {
                    point.exercises.push({
                        name: row.exercise_name,
                        volume: Number(row.total_volume)
                    });
                }
            }

            return Array.from(grouped.values());
        },
    });
}
