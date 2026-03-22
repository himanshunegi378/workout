import { useQuery } from "@tanstack/react-query";
import { workoutKeys } from "../query-keys";

export type WorkoutDetailsResponse = {
    workout: {
        id: string;
        name: string;
        exercisesWithMetadata: {
            id: string;
            exercise_id: string;
            sets_min: number | null;
            sets_max: number | null;
            reps_min: number | null;
            reps_max: number | null;
            rest_min: number | null;
            rest_max: number | null;
            tempo: string | null;
            is_hidden: boolean;
            exercise: {
                id: string;
                name: string;
                muscle_group: string;
            };
        }[];
    };
    session: {
        id: string;
        start_time: string | Date | null;
        end_time: string | Date | null;
        sessionExerciseLogs: {
            id: string;
            exercise_with_metadata_id: string | null;
            exercise_id: string | null;
            exerciseLog: {
                id: string;
                weight: number | null;
                reps: number;
                rpe: number | null;
                set_order_index: number;
            } | null;
        }[];
    } | null;
    previousLogsByExercise: Record<string, { id: string; weight: number | null; reps: number; rpe: number | null; set_order_index: number }[]>;
};

/**
 * A custom query hook for fetching comprehensive details for a specific workout session.
 * 
 * Context:
 * This hook is the primary data source for the workout execution screen. It retrieves 
 * not only the workout structure (exercises, sets, reps) but also the current active 
 * session data and historical logs for comparison.
 * 
 * Why:
 * - Unified State: Consolidating workout structure, current progress, and historical 
 *   benchmarks into a single request prevents multiple loading states and ensuring 
 *   the UI has all necessary context for progressive overload calculations.
 * - Reactive Tracking: By keying the query to the workoutId, it allows for targeted 
 *   cache invalidation whenever a set is logged or metadata is edited.
 */
export function useWorkoutDetails(programmeId: string, workoutId: string) {
    return useQuery({
        queryKey: workoutKeys.detail(workoutId),
        queryFn: async (): Promise<WorkoutDetailsResponse> => {
            const res = await fetch(`/api/programmes/${programmeId}/workouts/${workoutId}/details`);
            if (!res.ok) throw new Error("Failed to fetch workout details");
            return res.json() as Promise<WorkoutDetailsResponse>;
        },
        enabled: !!programmeId && !!workoutId,
    });
}
