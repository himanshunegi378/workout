import { useQuery } from "@tanstack/react-query";
import { apiFetch, apiUrl } from "@/lib/api-client";
import { queryKeys } from "../query-keys";

export interface WorkoutOption {
    id: string;
    name: string;
    programme: {
        name: string;
    };
}

export function useWorkouts(onlyActive: boolean = true) {
    return useQuery<WorkoutOption[], Error>({
        queryKey: queryKeys.workouts.all(onlyActive),
        queryFn: async () => {
            const url = apiUrl("/api/workouts");
            if (onlyActive) {
                url.searchParams.set("active", "true");
            }
            const response = await apiFetch(`${url.pathname}${url.search}`);
            if (!response.ok) {
                throw new Error("Failed to fetch workouts");
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
}
