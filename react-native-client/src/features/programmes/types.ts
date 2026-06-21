export interface WorkoutSummary {
  id: string;
  name: string;
  order_index: number;
  exercisesWithMetadata: {
    exercise: { name: string };
  }[];
  _count: {
    exercisesWithMetadata: number;
  };
}

export interface ProgrammeDetails {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  workouts: WorkoutSummary[];
}

export interface ProgrammeSummary {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  workouts: { id: string }[];
}

export interface UpdateProgramData {
  id: string;
  is_active: boolean;
}
