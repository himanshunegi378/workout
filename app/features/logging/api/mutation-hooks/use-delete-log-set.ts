import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "@/app/features/workouts/api/query-keys";
import { logKeys } from "../query-keys";
import { deleteLogSet } from "../mutations";
/**
 * A mutation hook for deleting a workout set.
 * On success, it invalidates workout details and all log-related queries.
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} A React Query mutation result object.
 */
export function useDeleteLogSet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteLogSet,
        onSuccess: () => {
            // Invalidate the workout details cache
            queryClient.invalidateQueries({ queryKey: workoutKeys.details() });
            // Invalidate all log-related queries (sessions, lists, history)
            queryClient.invalidateQueries({ queryKey: logKeys.all });
        },
    });
}
