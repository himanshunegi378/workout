import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { HeatmapItem, HeatmapResponse } from '../../types';

export function useHeatmapActivity() {
  return useQuery<HeatmapItem[], Error>({
    queryKey: ['heatmap-activity'],
    queryFn: async () => {
      const res = await apiFetch('/api/analytics/activity-heatmap');
      if (!res.ok) {
        throw new Error('Failed to fetch heatmap data');
      }
      const json: HeatmapResponse = await res.json();
      return json.data;
    },
  });
}
