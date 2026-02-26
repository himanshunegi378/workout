import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "@/app/features/workouts/api/query-keys";
import { logKeys } from "../query-keys";
import { deleteLogSet } from "../mutations";
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
