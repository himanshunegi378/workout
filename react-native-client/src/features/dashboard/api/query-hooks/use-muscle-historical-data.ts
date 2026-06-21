import { useQuery } from '@tanstack/react-query';
import { MuscleGroup } from '@/features/exercises';
import { apiFetch } from '@/lib/api';
import { HistoricalMuscleMetricData } from '../../types';
import { format, startOfWeek, subWeeks } from 'date-fns';
import { buildHistoricalMuscleMetricData, type MuscleMetricSourceRow } from '../utils/muscle-trends';

export function useMuscleHistoricalMetrics(muscleGroup: MuscleGroup, weeks: number = 8) {
  return useQuery<HistoricalMuscleMetricData[], Error>({
    queryKey: ['muscle-historical-metrics', muscleGroup, weeks],
    queryFn: async (): Promise<HistoricalMuscleMetricData[]> => {
      const now = new Date();
      const startDate = subWeeks(startOfWeek(now, { weekStartsOn: 0 }), weeks - 1);
      const isoStartDate = format(startDate, 'yyyy-MM-dd');

      const payload = {
        metrics: [
          { field: 'volume', aggregation: 'sum', alias: 'total_volume' },
          { field: 'weight', aggregation: 'sum', alias: 'total_weight' },
          { field: 'weight', aggregation: 'count', alias: 'loaded_sets' },
        ],
        dimensions: ['session_date'],
        filters: [
          { field: 'muscle_group', operator: '=', value: muscleGroup },
          { field: 'session_date', operator: '>=', value: isoStartDate },
          { field: 'weight', operator: '>', value: 0 },
        ],
        order_by: [{ field: 'session_date', direction: 'asc' }],
        limit: 1000,
      };

      const res = await apiFetch('/api/analytics/query', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to fetch historical volume data');

      const json = await res.json();
      const data = json.data as MuscleMetricSourceRow[];

      return buildHistoricalMuscleMetricData(data, { weeks, now });
    },
    enabled: !!muscleGroup,
  });
}

export const useMuscleHistoricalVolume = useMuscleHistoricalMetrics;
