import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "@/app/features/workouts/api/query-keys";
import { logKeys } from "../query-keys";
import { logSet } from "../mutations";
import { WorkoutDetailsResponse } from "@/app/features/workouts/api/query-hooks/use-workout-details";

/**
 * A mutation hook for logging a workout set.
 * It includes optimistic updates to the local cache and handles rollback on error.
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} A React Query mutation result object.
 */
export function useLogSet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logSet,
        /**
         * Optimistically updates the local workout details cache before the server mutation completes.
         * 
         * @param {Object} newLogData - The new set data.
         * @returns {Promise<Object>} The previous workout details snapshot for possible rollback.
         */
        onMutate: async (newLogData: {
            workoutId?: string;
            exerciseId?: string;
            exerciseWithMetadataId?: string;
            setOrderIndex: number;
            weight: string;
            reps: string;
            rpe?: string;
            id?: string
        }) => {
            if (!newLogData.workoutId) return;

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: workoutKeys.detail(newLogData.workoutId) });

            // Snapshot the previous value
            const previousWorkoutDetails = queryClient.getQueryData<WorkoutDetailsResponse>(workoutKeys.detail(newLogData.workoutId));

            // Optimistically update to the new value
            if (previousWorkoutDetails) {
                queryClient.setQueryData<WorkoutDetailsResponse>(workoutKeys.detail(newLogData.workoutId), (old) => {
                    if (!old) return old;

                    // Support both new session and existing session
                    const sessionId = old.session?.id || 'temp-session';
                    const newExerciseLog = {
                        id: newLogData.id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7)),
                        weight: parseFloat(newLogData.weight) || null,
                        reps: parseInt(newLogData.reps),
                        rpe: newLogData.rpe ? parseFloat(newLogData.rpe) : null,
                        set_order_index: newLogData.setOrderIndex,
                    };

                    const newSessionLog = {
                        id: `temp-sel-${Date.now()}`,
                        exercise_with_metadata_id: newLogData.exerciseWithMetadataId || null,
                        exercise_id: newLogData.exerciseId || null,
                        exerciseLog: newExerciseLog,
                    };

                    const updatedSession = {
                        ...(old.session || { id: sessionId, sessionExerciseLogs: [], start_time: null, end_time: null }),
                        sessionExerciseLogs: [...(old.session?.sessionExerciseLogs || []), newSessionLog],
                    };

                    return {
                        ...old,
                        session: updatedSession,
                    };
                });
            }

            return { previousWorkoutDetails };
        },
        /**
         * Rollback to the previous cache state if the mutation fails.
         */
        onError: (_err, newLogData, context) => {
            // Roll back to the previous value if the mutation fails
            if (newLogData.workoutId && context?.previousWorkoutDetails) {
                queryClient.setQueryData(workoutKeys.detail(newLogData.workoutId), context.previousWorkoutDetails);
            }
        },
        /**
         * Invalidates relevant queries on success to keep data in sync.
         */
        onSuccess: (_, variables) => {
            // Invalidate the workout details cache so the list of completed sets updates instantly in SetTracker
            if (variables.workoutId) {
                queryClient.invalidateQueries({ queryKey: workoutKeys.detail(variables.workoutId) });
            }
            // Invalidate all log-derived queries so quick logs also appear in exercise history and last-log views.
            queryClient.invalidateQueries({ queryKey: logKeys.all });
        },
        /**
         * Always refetch after error or success to ensure synchronization.
         */
        onSettled: (_data, _error, variables) => {
            // Always refetch after error or success to ensure we're in sync with the server
            if (variables.workoutId) {
                queryClient.invalidateQueries({ queryKey: workoutKeys.detail(variables.workoutId) });
            }
        }
    });
}
