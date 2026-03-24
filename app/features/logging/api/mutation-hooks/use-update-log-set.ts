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
        onSuccess: () => {
            // Invalidate the workout details cache
            queryClient.invalidateQueries({ queryKey: workoutKeys.details() });
            // Invalidate all log-derived queries so exercise-specific history stays in sync.
            queryClient.invalidateQueries({ queryKey: logKeys.all });
            // Refresh server components
            router.refresh();
        },
    });
}
