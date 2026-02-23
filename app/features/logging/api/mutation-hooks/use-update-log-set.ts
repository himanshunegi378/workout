import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "@/app/features/workouts/api/query-keys";
import { logKeys } from "../query-keys";
import { updateLogSet } from "../mutations";
import { useRouter } from "next/navigation";

export function useUpdateLogSet() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: updateLogSet,
        onSuccess: () => {
            // Invalidate the workout details cache
            queryClient.invalidateQueries({ queryKey: workoutKeys.details() });
            // Invalidate the global logs lists
            queryClient.invalidateQueries({ queryKey: logKeys.lists() });
            // Refresh server components
            router.refresh();
        },
    });
}
