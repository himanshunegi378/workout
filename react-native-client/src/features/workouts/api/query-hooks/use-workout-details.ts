import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { workoutKeys } from '../query-keys';
import { WorkoutDetailsResponse } from '../../types';

export function useWorkoutDetails(programmeId: string, workoutId: string) {
  return useQuery<WorkoutDetailsResponse>({
    queryKey: workoutKeys.detail(workoutId),
    queryFn: async () => {
      // For ad-hoc/empty workouts, we fetch recent sessions to locate today's active ad-hoc session
      if (workoutId === 'adhoc' || programmeId === 'adhoc') {
        const res = await apiFetch('/api/log/sessions?limit=10');
        if (!res.ok) throw new Error('Failed to fetch sessions for ad-hoc workout');
        const sessionsData = await res.json();

        const todayStr = new Date().toISOString().split('T')[0];
        const activeAdhocSession = sessionsData.data?.find((s: any) => {
          return !s.workout && !s.end_time && s.date.toString().startsWith(todayStr);
        });

        // Map sessionExerciseLogs to the required structure
        const mappedSessionLogs = activeAdhocSession
          ? activeAdhocSession.sessionExerciseLogs.map((sel: any) => ({
              id: sel.id,
              exercise_with_metadata_id: sel.exercise_with_metadata_id || null,
              exercise_id: sel.exercise_log?.exerciseId || sel.exerciseLog?.exerciseId || null,
              exerciseLog: sel.exercise_log || sel.exerciseLog || null,
            }))
          : [];

        // Build list of unique exercises in the ad-hoc session to display in the list
        const exercisesWithMetadata: any[] = [];
        if (activeAdhocSession) {
          const uniqueExerciseIds = new Set<string>();
          mappedSessionLogs.forEach((sel: any) => {
            const log = sel.exerciseLog;
            if (!log || !log.exerciseId) return;
            if (uniqueExerciseIds.has(log.exerciseId)) return;
            uniqueExerciseIds.add(log.exerciseId);

            // Renders a virtual metadata wrapper for the exercise log card
            exercisesWithMetadata.push({
              id: `adhoc-ewm-${log.exerciseId}`,
              exercise_id: log.exerciseId,
              sets_min: 1,
              sets_max: 5,
              reps_min: 8,
              reps_max: 12,
              rest_min: 60,
              rest_max: 90,
              tempo: '2-0-1-0',
              exercise: log.exercise || {
                id: log.exerciseId,
                name: log.exerciseName || 'Logged Exercise',
                muscle_group: 'Other',
              },
            });
          });
        }

        return {
          workout: {
            id: 'adhoc',
            name: 'Empty Workout',
            exercisesWithMetadata,
          },
          session: activeAdhocSession
            ? {
                id: activeAdhocSession.id,
                start_time: activeAdhocSession.start_time,
                end_time: activeAdhocSession.end_time,
                sessionExerciseLogs: mappedSessionLogs,
              }
            : null,
          previousLogsByExercise: {},
        };
      }

      const res = await apiFetch(`/api/programmes/${programmeId}/workouts/${workoutId}/details`);
      if (!res.ok) throw new Error('Failed to fetch workout details');
      return res.json();
    },
    enabled: !!programmeId && !!workoutId,
  });
}
