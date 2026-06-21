import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logKeys } from '../query-keys';
import { logSet } from '../mutations';
import { ExerciseHistoryLog } from '../query-hooks/use-exercise-history';
import { ExerciseLog } from '../../types';
import { generateUUID } from '@/lib/uuid';

// Stand-in type matching the backend response for workout details
export interface WorkoutDetailsResponse {
  workout: {
    id: string;
    name: string;
    exercisesWithMetadata: any[];
  };
  session: {
    id: string;
    start_time: string | Date | null;
    end_time: string | Date | null;
    sessionExerciseLogs: {
      id: string;
      exercise_with_metadata_id: string | null;
      exercise_id: string | null;
      exerciseLog: ExerciseLog | null;
    }[];
  } | null;
  previousLogsByExercise: Record<string, ExerciseLog[]>;
}

export function useLogSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logSet,
    onMutate: async (newLogData: {
      workoutId?: string;
      exerciseId?: string;
      exerciseWithMetadataId?: string;
      setOrderIndex: number;
      weight: string;
      reps: string;
      rpe?: string;
      date?: string;
      id?: string;
    }) => {
      const id = newLogData.id || generateUUID();
      const commonLogData: ExerciseLog = {
        id,
        weight: parseFloat(newLogData.weight) || null,
        reps: parseInt(newLogData.reps) || 0,
        rpe: newLogData.rpe ? parseFloat(newLogData.rpe) : null,
        set_order_index: newLogData.setOrderIndex,
        user_id: 'temp-user',
        date: new Date(),
        pr_type: null,
        exerciseId: newLogData.exerciseId || null,
      };

      // 1. Optimistic update for Active Workout Details
      let previousWorkoutDetails;
      if (newLogData.workoutId) {
        const workoutKey = ['workouts', 'detail', newLogData.workoutId];
        await queryClient.cancelQueries({ queryKey: workoutKey });
        previousWorkoutDetails = queryClient.getQueryData<WorkoutDetailsResponse>(workoutKey);

        if (previousWorkoutDetails) {
          queryClient.setQueryData<WorkoutDetailsResponse>(workoutKey, (old) => {
            if (!old) return old;

            const sessionId = old.session?.id || 'temp-session';
            const newSessionLog = {
              id: `temp-sel-${Date.now()}`,
              exercise_with_metadata_id: newLogData.exerciseWithMetadataId || null,
              exercise_id: newLogData.exerciseId || null,
              exerciseLog: commonLogData,
            };

            const updatedSession = {
              ...(old.session || { id: sessionId, sessionExerciseLogs: [], start_time: null, end_time: null }),
              sessionExerciseLogs: [...(old.session?.sessionExerciseLogs || []), newSessionLog],
            };

            return { ...old, session: updatedSession };
          });
        }
      }

      // 2. Optimistic update for Exercise History (Quick Logs)
      let previousHistory;
      if (newLogData.exerciseId) {
        const historyKey = logKeys.history(newLogData.exerciseId);
        await queryClient.cancelQueries({ queryKey: historyKey });
        previousHistory = queryClient.getQueryData<ExerciseHistoryLog[]>(historyKey);

        if (previousHistory) {
          queryClient.setQueryData<ExerciseHistoryLog[]>(historyKey, (old) => {
            const newHistoryLog: ExerciseHistoryLog = {
              ...commonLogData,
              exerciseId: newLogData.exerciseId ?? null,
              workoutSession: {
                date: newLogData.date || new Date().toISOString(),
                start_time: newLogData.date || new Date().toISOString(),
              },
              exerciseWithMetadata: null,
              pr_type: null,
            };
            return [newHistoryLog, ...(old || [])];
          });
        }
      }

      return { previousWorkoutDetails, previousHistory };
    },
    onError: (_err, newLogData, context) => {
      if (newLogData.workoutId && context?.previousWorkoutDetails) {
        queryClient.setQueryData(
          ['workouts', 'detail', newLogData.workoutId],
          context.previousWorkoutDetails
        );
      }
      if (newLogData.exerciseId && context?.previousHistory) {
        queryClient.setQueryData(logKeys.history(newLogData.exerciseId), context.previousHistory);
      }
    },
    onSuccess: (_, variables) => {
      if (variables.workoutId) {
        queryClient.invalidateQueries({ queryKey: ['workouts', 'detail', variables.workoutId] });
      }
      queryClient.invalidateQueries({ queryKey: logKeys.all });
    },
    onSettled: (_data, _error, variables) => {
      if (variables.workoutId) {
        queryClient.invalidateQueries({ queryKey: ['workouts', 'detail', variables.workoutId] });
      }
      if (variables.exerciseId) {
        queryClient.invalidateQueries({ queryKey: logKeys.history(variables.exerciseId) });
      }
    },
  });
}
