import { useQuery } from "@tanstack/react-query";

interface ExerciseLogWithHistory {
    id: string;
    weight: number | null;
    reps: number;
    set_order_index: number;
    workoutSession: {
        date: string;
        start_time: string | null;
    };
    pr_type?: string | null;
    exerciseWithMetadata: {
        reps_min: number;
        reps_max: number;
        sets_min: number;
        sets_max: number;
        tempo: string;
        rest_min: number;
        rest_max: number;
    } | null;
}

import { logKeys } from "@/app/features/logging/api/query-keys";

/**
 * A custom query hook for fetching the historical performance data of a specific exercise.
 * 
 * Context:
 * This hook retrieves all past completed logs (weight, reps, sets) for an exercise. 
 * It is primarily used by the `ExerciseHistoryDrawer` to show user progress.
 * 
 * Why:
 * - Reactive Loading: Leverages TanStack Query to manage the loading state and 
 *   cache the results, so history doesn't need to be refetched every time the drawer opens.
 * - Integration: Incorporates PR (Personal Record) information from the backend directly into 
 *   the history view, making it easy to see when a user hit a milestone for that exercise.
 */
export function useExerciseHistory(exerciseId: string | undefined) {
    return useQuery({
        queryKey: logKeys.history(exerciseId),
        queryFn: async () => {
            if (!exerciseId) throw new Error("Exercise ID is required");
            const res = await fetch(`/api/exercises/${exerciseId}/logs`);
            if (!res.ok) {
                throw new Error("Failed to fetch exercise history");
            }
            const data = await res.json();
            return data as ExerciseLogWithHistory[];
        },
        enabled: !!exerciseId,
    });
}
