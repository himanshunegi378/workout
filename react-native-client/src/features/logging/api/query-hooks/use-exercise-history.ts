import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { logKeys } from '../query-keys';

export interface ExerciseHistoryLog {
  id: string;
  exerciseId: string | null;
  weight: number | null;
  reps: number;
  rpe: number | null;
  set_order_index: number;
  workoutSession: {
    date: string;
    start_time: string | null;
  };
  pr_type?: string | null;
  exerciseWithMetadata: {
    reps_min: number;
    reps_max: number;
    sets_min: number;
    sets_max: number;
    tempo: string;
    rest_min: number;
    rest_max: number;
  } | null;
}

export interface ExerciseHistoryRange {
  from?: string;
  to?: string;
}

export function useExerciseHistory(
  exerciseId: string | string[] | undefined,
  range?: ExerciseHistoryRange
) {
  const exerciseIds = normalizeExerciseIds(exerciseId);

  return useQuery({
    queryKey: logKeys.history(exerciseIds, range),
    queryFn: async () => {
      if (exerciseIds.length === 0) throw new Error('Exercise ID is required');

      const params = new URLSearchParams();
      exerciseIds.forEach((id) => params.append('exerciseId', id));
      if (range?.from) params.set('from', range.from);
      if (range?.to) params.set('to', range.to);

      const res = await apiFetch(`/api/exercises/logs?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch exercise history');
      }

      return res.json() as Promise<ExerciseHistoryLog[]>;
    },
    enabled: exerciseIds.length > 0,
  });
}

export function formatLogDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function normalizeExerciseIds(exerciseId: string | string[] | undefined) {
  return [...new Set((Array.isArray(exerciseId) ? exerciseId : [exerciseId])
    .filter((id): id is string => Boolean(id)))]
    .sort();
}

export function groupLogsByDate(logs: ExerciseHistoryLog[] | undefined) {
  if (!logs) return {};

  return logs.reduce<Record<string, ExerciseHistoryLog[]>>((acc, log) => {
    const dateStr = log.workoutSession?.date
      ? formatLogDate(log.workoutSession.date)
      : 'Previous Records';

    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }

    acc[dateStr].push(log);
    return acc;
  }, {});
}
