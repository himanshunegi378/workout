import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "@/app/features/workouts/api/query-keys";
import { logKeys } from "../query-keys";
import { logSet } from "../mutations";

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
            id?: string
        }) => {
            if (!newLogData.workoutId) return;

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: workoutKeys.detail(newLogData.workoutId) });

            // Snapshot the previous value
            const previousWorkoutDetails = queryClient.getQueryData(workoutKeys.detail(newLogData.workoutId));

            // Optimistically update to the new value
            if (previousWorkoutDetails) {
                queryClient.setQueryData(workoutKeys.detail(newLogData.workoutId), (old: any) => {
                    if (!old) return old;

                    // Support both new session and existing session
                    const sessionId = old.session?.id || 'temp-session';
                    const newExerciseLog = {
                        id: newLogData.id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7)),
                        weight: parseFloat(newLogData.weight) || null,
                        reps: parseInt(newLogData.reps),
                        set_order_index: newLogData.setOrderIndex,
                    };

                    const newSessionLog = {
                        id: `temp-sel-${Date.now()}`,
                        exercise_with_metadata_id: newLogData.exerciseWithMetadataId || null,
                        exercise_id: newLogData.exerciseId || null,
                        exerciseLog: newExerciseLog,
                    };

                    const updatedSession = {
                        ...(old.session || { id: sessionId, sessionExerciseLogs: [] }),
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
        onError: (err: any, newLogData: any, context: any) => {
            // Roll back to the previous value if the mutation fails
            if (newLogData.workoutId && context?.previousWorkoutDetails) {
                queryClient.setQueryData(workoutKeys.detail(newLogData.workoutId), context.previousWorkoutDetails);
            }
        },
        onSuccess: (_, variables) => {
            // Invalidate the workout details cache so the list of completed sets updates instantly in SetTracker
            if (variables.workoutId) {
                queryClient.invalidateQueries({ queryKey: workoutKeys.detail(variables.workoutId) });
            }
            // Invalidate the global logs lists
            queryClient.invalidateQueries({ queryKey: logKeys.lists() });
        },
        onSettled: (data: any, error: any, variables: any) => {
            // Always refetch after error or success to ensure we're in sync with the server
            if (variables.workoutId) {
                queryClient.invalidateQueries({ queryKey: workoutKeys.detail(variables.workoutId) });
            }
        }
    });
}
