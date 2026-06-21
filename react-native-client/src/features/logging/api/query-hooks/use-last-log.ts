import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { logKeys } from '../query-keys';

export async function getLastLog(exerciseId: string) {
  const res = await apiFetch(`/api/exercises/${exerciseId}/last-log`);
  if (!res.ok) {
    throw new Error('Failed to fetch last log');
  }
  return res.json();
}

export function useLastLog(exerciseId: string, enabled = true) {
  return useQuery({
    queryKey: logKeys.lastLog(exerciseId),
    queryFn: () => getLastLog(exerciseId),
    enabled,
  });
}
