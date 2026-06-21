export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  description?: string | null;
}

export interface ExerciseLog {
  id: string;
  weight: number | null;
  reps: number;
  rpe: number | null;
  set_order_index: number;
  user_id: string;
  date: string | Date;
  pr_type?: string | null;
  exerciseId: string | null;
}

export interface SessionExerciseLogWithRelations {
  id: string;
  exercise_with_metadata_id: string | null;
  exercise_id?: string | null;
  exerciseLog: (ExerciseLog & {
    exercise: Exercise | null;
  }) | null;
  exerciseWithMetadata: {
    exercise: Exercise;
    reps_min?: number;
    reps_max?: number;
    sets_min?: number;
    sets_max?: number;
    tempo?: string;
    rest_min?: number;
    rest_max?: number;
  } | null;
}

export interface SessionWithLogs {
  id: string;
  date: string | Date;
  start_time: string | Date | null;
  end_time: string | Date | null;
  workout: {
    name: string;
    programme: { name: string };
  } | null;
  sessionExerciseLogs: SessionExerciseLogWithRelations[];
}

export interface GroupedSession {
  label: string;
  sessions: SessionWithLogs[];
}

export interface PaginatedResponse<T> {
  data: T;
  pagination: {
    from: string | null;
    to: string | null;
    hasMore: boolean;
  };
}
