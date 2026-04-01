import { useQuery } from "@tanstack/react-query";
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
            const url = new URL("/api/workouts", window.location.origin);
            if (onlyActive) {
                url.searchParams.set("active", "true");
            }
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error("Failed to fetch workouts");
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
}
