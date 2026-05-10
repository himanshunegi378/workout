import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "@/app/features/workouts/api/query-keys";
import { logKeys } from "../query-keys";
import { updateLogSet } from "../mutations";
import { useRouter } from "next/navigation";

/**
 * A mutation hook for updating an existing workout set.
 * On success, it invalidates workout details, global log lists, and refreshes the current page.
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} A React Query mutation result object.
 */
export function useUpdateLogSet() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: updateLogSet,
        onMutate: async (updatedLogData) => {
            const workoutDetailsKey = workoutKeys.details(); // Or specific detail if workoutId is available
            
            // Note: Since updateLogSet only receives setId, weight, reps, rpe, 
            // we have to find which workout detail to update by searching the cache
            // or we could require workoutId in the mutation args.
            // For now, we'll invalidate as before but prepare for more granular updates if needed.
            
            await queryClient.cancelQueries({ queryKey: workoutKeys.details() });
            const previousWorkouts = queryClient.getQueryData(workoutKeys.details());

            return { previousWorkouts };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousWorkouts) {
                queryClient.setQueryData(workoutKeys.details(), context.previousWorkouts);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workoutKeys.details() });
            queryClient.invalidateQueries({ queryKey: logKeys.all });
            router.refresh();
        },
    });
}
