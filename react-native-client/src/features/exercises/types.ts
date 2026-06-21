export type MuscleGroup =
  | 'Abs'
  | 'Back'
  | 'Biceps'
  | 'Cardio'
  | 'Chest'
  | 'Forearms'
  | 'Legs'
  | 'Shoulders'
  | 'Triceps';

export interface Exercise {
  id: string;
  name: string;
  description?: string | null;
  muscle_group: string;
}
