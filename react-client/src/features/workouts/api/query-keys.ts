/**
 * A centralized factory for TanStack Query keys related to the workout feature.
 * 
 * Context:
 * These keys uniquely identify workout lists (per-programme) and detailed workout 
 * session data. 
 * 
 * Why:
 * - Consistency: Ensures that any modification to a workout or a logged set 
 *   can precisely invalidate the correct cached data across different screens.
 * - Cache Isolation: Prevents data for one workout from leaking into another's 
 *   detail view by using unique identifiers in the key array.
 */
export const workoutKeys = {
    all: ["workouts"] as const,
    lists: () => [...workoutKeys.all, "list"] as const,
    list: (programmeId: string) => [...workoutKeys.lists(), { programmeId }] as const,
    details: () => [...workoutKeys.all, "detail"] as const,
    detail: (id: string) => [...workoutKeys.details(), id] as const,
};
