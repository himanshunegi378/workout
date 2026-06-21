import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { workoutKeys } from '../query-keys';

export function useFinishWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId }: { sessionId: string }) => {
      const res = await apiFetch(`/api/workout-sessions/${sessionId}/finish`, {
        method: 'PATCH',
      });

      if (!res.ok) {
        throw new Error('Failed to finish workout session');
      }

      return res.json();
    },
    onSuccess: (_data, variables) => {
      // Invalidate the workout details cache
      queryClient.invalidateQueries({
        queryKey: workoutKeys.detail(variables.sessionId),
      });
      // Invalidate sessions timeline logs lists
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
