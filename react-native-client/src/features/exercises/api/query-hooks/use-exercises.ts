import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { exerciseKeys } from '../query-keys';
import { Exercise } from '../../types';

export function useExercises() {
  return useQuery<Exercise[]>({
    queryKey: exerciseKeys.lists(),
    queryFn: async () => {
      const res = await apiFetch('/api/exercises');
      if (!res.ok) throw new Error('Failed to fetch exercises');
      return res.json();
    },
  });
}
