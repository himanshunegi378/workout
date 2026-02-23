import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exerciseKeys } from "../query-keys";
import { createExercise } from "../mutations";

export function useCreateExercise() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createExercise,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
        },
    });
}
