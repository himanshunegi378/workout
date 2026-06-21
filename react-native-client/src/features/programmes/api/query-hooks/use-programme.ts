import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { programmeKeys } from '../query-keys';
import { ProgrammeDetails } from '../../types';

export function useProgramme(programmeId: string) {
  return useQuery<ProgrammeDetails>({
    queryKey: programmeKeys.detail(programmeId),
    queryFn: async () => {
      const res = await apiFetch(`/api/programmes/${programmeId}`);
      if (!res.ok) throw new Error('Failed to fetch programme details');
      return res.json();
    },
    enabled: !!programmeId,
  });
}
