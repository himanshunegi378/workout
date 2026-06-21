import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { queryKeys } from '../query-keys';

export interface WorkoutOption {
  id: string;
  name: string;
  programme: {
    name: string;
  };
}

export function useWorkouts(onlyActive: boolean = true) {
  return useQuery<WorkoutOption[], Error>({
    queryKey: queryKeys.workouts.all(onlyActive),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (onlyActive) {
        params.append('active', 'true');
      }
      const url = `/api/workouts${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiFetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
