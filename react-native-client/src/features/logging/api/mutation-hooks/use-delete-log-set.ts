import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLogSet } from '../mutations';
import { logKeys } from '../query-keys';

export function useDeleteLogSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLogSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logKeys.all });
    },
  });
}
