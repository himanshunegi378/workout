import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { programmeKeys } from '../query-keys';
import { ProgrammeSummary } from '../../types';

export function useProgrammes() {
  return useQuery<ProgrammeSummary[]>({
    queryKey: programmeKeys.lists(),
    queryFn: async () => {
      const res = await apiFetch('/api/programmes');
      if (!res.ok) throw new Error('Failed to fetch programmes');
      return res.json();
    },
  });
}
