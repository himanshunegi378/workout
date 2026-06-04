export type MuscleGroup =
  | "Abs"
  | "Back"
  | "Biceps"
  | "Cardio"
  | "Chest"
  | "Forearms"
  | "Legs"
  | "Shoulders"
  | "Triceps";

export const FeedbackStatus = {
  Submitted: "Submitted",
  UnderReview: "UnderReview",
  Planned: "Planned",
  Completed: "Completed",
  Rejected: "Rejected",
} as const;

export type FeedbackStatus = (typeof FeedbackStatus)[keyof typeof FeedbackStatus];

export interface Exercise {
  id: string;
  name: string;
  description?: string | null;
  muscle_group: MuscleGroup;
  is_global?: boolean;
  user_id?: string | null;
}

export interface ExerciseWithMetadata {
  id: string;
  reps_min: number;
  reps_max: number;
  sets_min: number;
  sets_max: number;
  rest_min: number;
  rest_max: number;
  tempo: string;
  order_index: number;
  is_hidden: boolean;
  exercise_id: string;
  workout_id: string;
}

export interface ExerciseLog {
  id: string;
  weight: number | null;
  reps: number;
  set_order_index: number;
  rpe: number | null;
  date: string | Date;
  pr_type: string | null;
  user_id?: string;
  exerciseId?: string | null;
}
