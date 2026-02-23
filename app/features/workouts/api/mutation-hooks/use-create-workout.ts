import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "../query-keys";
import { programKeys } from "@/app/features/programs/api/query-keys";
import { createWorkout } from "../mutations";

export function useCreateWorkout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ groupId, data }: { groupId: string, data: { name: string; description?: string | null } }) => createWorkout(groupId, data),
        onSuccess: (_, variables) => {
            // Invalidate the workout list for this specific group
            queryClient.invalidateQueries({ queryKey: workoutKeys.list(variables.groupId) });
            // Also invalidate the program detail since it includes the workout count
            queryClient.invalidateQueries({ queryKey: programKeys.detail(variables.groupId) });
        },
    });
}
