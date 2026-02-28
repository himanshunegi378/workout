import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "@/app/features/workouts/api/query-keys";
import { logKeys } from "../query-keys";
import { logSet } from "../mutations";

export function useLogSet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logSet,
        onSuccess: (_, variables) => {
            // Invalidate the workout details cache so the list of completed sets updates instantly in SetTracker
            if (variables.workoutId) {
                queryClient.invalidateQueries({ queryKey: workoutKeys.detail(variables.workoutId) });
            }
            // Invalidate the global logs lists
            queryClient.invalidateQueries({ queryKey: logKeys.lists() });
        },
    });
}
