import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLogSet } from '../mutations';
import { logKeys } from '../query-keys';

export function useUpdateLogSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLogSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logKeys.all });
    },
  });
}
