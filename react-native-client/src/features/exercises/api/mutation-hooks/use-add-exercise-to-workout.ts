import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addExerciseToWorkout } from '../mutations';

interface UseAddExerciseToWorkoutArgs {
  programmeId: string;
  workoutId: string;
  data: Parameters<typeof addExerciseToWorkout>[2];
}

export function useAddExerciseToWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programmeId, workoutId, data }: UseAddExerciseToWorkoutArgs) =>
      addExerciseToWorkout(programmeId, workoutId, data),
    onSuccess: (_, variables) => {
      // Invalidate the workout and programme details cache so the list of exercises updates instantly
      queryClient.invalidateQueries({ queryKey: ['workouts', 'detail', variables.workoutId] });
      queryClient.invalidateQueries({ queryKey: ['programmes', 'detail', variables.programmeId] });
    },
  });
}
