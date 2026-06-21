import { ExerciseLog } from '../logging/types';

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  description?: string | null;
}

export interface ExerciseWithMetadata {
  id: string;
  exercise_id: string;
  sets_min: number;
  sets_max: number;
  reps_min: number;
  reps_max: number;
  rest_min: number;
  rest_max: number;
  tempo: string;
  exercise: Exercise;
}

export interface WorkoutDetailsResponse {
  workout: {
    id: string;
    name: string;
    exercisesWithMetadata: ExerciseWithMetadata[];
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
