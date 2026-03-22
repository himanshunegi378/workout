import { useQuery } from "@tanstack/react-query";
import { exerciseKeys } from "../query-keys";

/**
 * A custom query hook for fetching all available exercises from the global library.
 * 
 * Context:
 * This hook is the main entry point for data on the `ExercisesContent` screen. 
 * It populates the list of movements that can be added to any workout.
 * 
 * Why:
 * - Efficient Caching: Uses TanStack Query to keep the exercise list in memory, 
 *   providing instantaneous filtering and search throughout the session.
 * - Global Access: Allows different parts of the application (e.g., workout builders, 
 *   library views) to always access the same consistent source of exercises.
 */
export function useExercises() {
    return useQuery({
        queryKey: exerciseKeys.lists(),
        queryFn: async () => {
            const res = await fetch("/api/exercises");
            if (!res.ok) throw new Error("Failed to fetch exercises");
            return res.json();
        },
    });
}
