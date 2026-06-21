import { useQuery, useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { queryClient } from '@/lib/query-client';

export interface Programme {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  workouts: { id: string }[];
  isOptimistic?: boolean;
}

export interface CreateProgrammeInput {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
}

/**
 * Hook to query user's workout programmes from `/api/programmes`.
 */
export function useProgrammes() {
  return useQuery<Programme[]>({
    queryKey: ['programmes'],
    queryFn: async () => {
      const res = await apiFetch('/api/programmes');
      if (!res.ok) {
        throw new Error('Failed to fetch programmes');
      }
      return res.json();
    },
  });
}

/**
 * Hook to create a new workout programme with optimistic cache updates.
 */
export function useCreateProgramme() {
  return useMutation<Programme, Error, CreateProgrammeInput, { previousProgrammes?: Programme[] }>({
    mutationFn: async (input) => {
      const res = await apiFetch('/api/programmes', {
        method: 'POST',
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create programme');
      }

      return res.json();
    },
    // Perform optimistic updates in cache before API responds
    onMutate: async (newInput) => {
      await queryClient.cancelQueries({ queryKey: ['programmes'] });
      
      const previousProgrammes = queryClient.getQueryData<Programme[]>(['programmes']);

      if (previousProgrammes) {
        queryClient.setQueryData<Programme[]>(['programmes'], [
          ...previousProgrammes,
          {
            id: newInput.id,
            name: newInput.name,
            description: newInput.description || null,
            is_active: !!newInput.is_active,
            workouts: [],
            isOptimistic: true, // Label for UI diagnostics
          },
        ]);
      }

      return { previousProgrammes };
    },
    // Rollback to previous snapshot if request fails
    onError: (err, newInput, context) => {
      if (context?.previousProgrammes) {
        queryClient.setQueryData(['programmes'], context.previousProgrammes);
      }
    },
    // Refresh cache from server after mutation resolves
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['programmes'] });
    },
  });
}
