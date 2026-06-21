import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { programmeKeys } from '../query-keys';
import { UpdateProgramData } from '../../types';

export function useUpdateProgramme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProgramData) => {
      const { id, ...payload } = data;
      const res = await apiFetch(`/api/programmes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update programme');
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate both lists and this specific detail view
      queryClient.invalidateQueries({ queryKey: programmeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: programmeKeys.detail(variables.id) });
    },
  });
}
