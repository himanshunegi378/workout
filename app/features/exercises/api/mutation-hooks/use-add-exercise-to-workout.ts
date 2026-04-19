import { useMutation, useQueryClient } from "@tanstack/react-query";
import { programmeKeys } from "@/app/features/programs/api/query-keys";
import { workoutKeys } from "@/app/features/workouts/api/query-keys";
import { addExerciseToWorkout } from "../mutations";

interface UseAddExerciseToWorkoutArgs {
    programmeId: string;
    workoutId: string;
    data: Parameters<typeof addExerciseToWorkout>[2];
}

/**
 * A custom mutation hook for linking an exercise to a workout within a programme.
 * 
 * Context:
 * "Adding" an exercise actually creates a configuration (metadata) entry 
 * which specifies the desired sets, reps, and other parameters for that specific 
 * workout session.
 * 
 * Why:
 * - Dynamic Workouts: Allows users to build custom routines from a library of 
 *   pre-defined exercises.
 * - Reactive Success States: Invalidates the specific workout detail query, 
 *   showing the newly added exercise in the workout view right away.
 */
export function useAddExerciseToWorkout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ programmeId, workoutId, data }: UseAddExerciseToWorkoutArgs) =>
            addExerciseToWorkout(programmeId, workoutId, data),
        onSuccess: (_, variables) => {
            // Invalidate the workout details cache so the list of exercises updates instantly
            queryClient.invalidateQueries({ queryKey: workoutKeys.detail(variables.workoutId) });
            queryClient.invalidateQueries({ queryKey: programmeKeys.detail(variables.programmeId) });
        },
    });
}
