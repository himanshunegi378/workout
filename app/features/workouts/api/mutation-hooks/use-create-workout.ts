import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "../query-keys";
import { programmeKeys } from "@/app/features/programs/api/query-keys";
import { createWorkout } from "../mutations";

export function useCreateWorkout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ programmeId, data }: { programmeId: string, data: { name: string; description?: string | null } }) => createWorkout(programmeId, data),
        onSuccess: (_, variables) => {
            // Invalidate the workout list for this specific programme
            queryClient.invalidateQueries({ queryKey: workoutKeys.list(variables.programmeId) });
            // Also invalidate the program detail since it includes the workout count
            queryClient.invalidateQueries({ queryKey: programmeKeys.detail(variables.programmeId) });
        },
    });
}
