import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { dashboardKeys } from '../query-keys';
import { ACWRDataPoint } from '../utils/calculate-acwr';

export interface FatigueResponse {
  timeSeries: ACWRDataPoint[];
  hasMoreHistory: boolean;
}

export function useFatigueData(endDate?: Date, days = 30) {
  // Only use YYYY-MM-DD for cache key stability
  const endDateStr = endDate ? endDate.toISOString().split('T')[0] : 'today';

  return useQuery<FatigueResponse, Error>({
    queryKey: [...dashboardKeys.fatigue, days, endDateStr],
    queryFn: async (): Promise<FatigueResponse> => {
      const params = new URLSearchParams();
      params.append('days', days.toString());
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }

      const res = await apiFetch(`/api/analytics/fatigue?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch fatigue data');
      }
      return res.json();
    },
  });
}
