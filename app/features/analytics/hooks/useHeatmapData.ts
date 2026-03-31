import { useQuery } from "@tanstack/react-query";

export interface HeatmapItem {
    date: string;
    count: number;
}

interface HeatmapResponse {
    data: HeatmapItem[];
}

export function useHeatmapActivity() {
    return useQuery<HeatmapItem[]>({
        queryKey: ["heatmap-activity"],
        queryFn: async () => {
            const response = await fetch("/api/analytics/activity-heatmap");
            if (!response.ok) {
                throw new Error("Failed to fetch heatmap data");
            }
            const json: HeatmapResponse = await response.json();
            return json.data;
        },
    });
}
