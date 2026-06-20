import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exerciseKeys } from "../query-keys";
import { createExercise } from "../mutations";

/**
 * A custom mutation hook for creating a new exercise in the global library.
 * 
 * Context:
 * Wraps the `createExercise` API call in a TanStack Query mutation. It ensures 
 * that the cached global exercise list is invalidated immediately upon successful 
 * creation.
 * 
 * Why:
 * - Reactive UI: Ensures that the "Exercise Library" view is automatically updated 
 *   to show the newly added movement without requiring a manual page refresh.
 * - Cache Integrity: Maintaining a central library list requires consistent 
 *   invalidation strategies to prevent stale data from appearing in selectors.
 */
export function useCreateExercise() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createExercise,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
        },
    });
}
