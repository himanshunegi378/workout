import { useQuery } from "@tanstack/react-query";
import { apiFetch, apiUrl } from "@/lib/api-client";
import { queryKeys } from "../query-keys";

export interface SessionVolumeNode {
    id: string;
    date: string;
    volume: number;
    deltaPercentage: number;
    status: "optimal" | "warning" | "deload" | "neutral";
}

export function useSessionVolume(workoutId: string | undefined, limit: number = 15) {
    return useQuery<SessionVolumeNode[], Error>({
        queryKey: queryKeys.analytics.sessionVolume(workoutId || "none", limit),
        queryFn: async () => {
            if (!workoutId) return [];

            const url = apiUrl("/api/analytics/session-volume", { workoutId, limit });
            const response = await apiFetch(`${url.pathname}${url.search}`);
            if (!response.ok) {
                throw new Error("Failed to fetch session volume");
            }
            return response.json();
        },
        enabled: !!workoutId,
        staleTime: 5 * 60 * 1000,
    });
}
