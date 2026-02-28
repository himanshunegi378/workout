import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";

export interface WorkoutOption {
    id: string;
    name: string;
    programme: {
        name: string;
    };
}

export function useWorkouts() {
    return useQuery<WorkoutOption[], Error>({
        queryKey: queryKeys.workouts.all(),
        queryFn: async () => {
            const response = await fetch("/api/workouts");
            if (!response.ok) {
                throw new Error("Failed to fetch workouts");
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
}
