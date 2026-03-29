import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "../query-keys";

export function useFinishWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId }: { sessionId: string }) => {
      const res = await fetch(`/api/workout-sessions/${sessionId}/finish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to finish workout session");
      }

      return res.json();
    },
    onSuccess: (_data, variables) => {
      // Invalidate the workout detail to refresh the session state
      queryClient.invalidateQueries({
        queryKey: workoutKeys.detail(variables.sessionId),
      });
      // Also invalidate dashboard stats if we have any
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
