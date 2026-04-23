import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys, type WorkoutDetailsResponse } from "@/app/features/workouts";
import { logKeys } from "../query-keys";
import { logSet } from "../mutations";
import { ExerciseHistoryLog } from "../query-hooks/use-exercise-history";

/**
 * A mutation hook for logging a workout set.
 * It includes optimistic updates to both workout details and individual exercise history.
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} A React Query mutation result object.
 */
export function useLogSet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logSet,
        /**
         * Optimistically updates local caches before the server mutation completes.
         * Supports both active workout sessions and ad-hoc quick logs.
         */
        onMutate: async (newLogData: {
            workoutId?: string;
            exerciseId?: string;
            exerciseWithMetadataId?: string;
            setOrderIndex: number;
            weight: string;
            reps: string;
            rpe?: string;
            date?: string;
            id?: string
        }) => {
            const id = newLogData.id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7));
            const commonLogData = {
                id,
                weight: parseFloat(newLogData.weight) || null,
                reps: parseInt(newLogData.reps) || 0,
                rpe: newLogData.rpe ? parseFloat(newLogData.rpe) : null,
                set_order_index: newLogData.setOrderIndex,
            };

            // 1. Optimistic update for Active Workout Details
            let previousWorkoutDetails;
            if (newLogData.workoutId) {
                await queryClient.cancelQueries({ queryKey: workoutKeys.detail(newLogData.workoutId) });
                previousWorkoutDetails = queryClient.getQueryData<WorkoutDetailsResponse>(workoutKeys.detail(newLogData.workoutId));

                if (previousWorkoutDetails) {
                    queryClient.setQueryData<WorkoutDetailsResponse>(workoutKeys.detail(newLogData.workoutId), (old) => {
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
        /**
         * Rollback to the previous cache state if the mutation fails.
         */
        onError: (_err, newLogData, context) => {
            if (newLogData.workoutId && context?.previousWorkoutDetails) {
                queryClient.setQueryData(workoutKeys.detail(newLogData.workoutId), context.previousWorkoutDetails);
            }
            if (newLogData.exerciseId && context?.previousHistory) {
                queryClient.setQueryData(logKeys.history(newLogData.exerciseId), context.previousHistory);
            }
        },
        /**
         * Invalidates relevant queries on success to keep data in sync.
         */
        onSuccess: (_, variables) => {
            if (variables.workoutId) {
                queryClient.invalidateQueries({ queryKey: workoutKeys.detail(variables.workoutId) });
            }
            // Invalidate all log-derived queries including history and last log
            queryClient.invalidateQueries({ queryKey: logKeys.all });
        },
        /**
         * Always refetch after error or success to ensure synchronization.
         */
        onSettled: (_data, _error, variables) => {
            if (variables.workoutId) {
                queryClient.invalidateQueries({ queryKey: workoutKeys.detail(variables.workoutId) });
            }
            if (variables.exerciseId) {
                queryClient.invalidateQueries({ queryKey: logKeys.history(variables.exerciseId) });
            }
        }
    });
}
