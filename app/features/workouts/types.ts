/**
 * Shared types for the workouts feature.
 */

export interface ExerciseLog {
    id: string;
    weight: number | null;
    reps: number;
    set_order_index: number;
    rpe: number | null;
}

export type WorkoutDetailsResponse = {
    workout: {
        id: string;
        name: string;
        exercisesWithMetadata: {
            id: string;
            exercise_id: string;
            sets_min: number | null;
            sets_max: number | null;
            reps_min: number | null;
            reps_max: number | null;
            rest_min: number | null;
            rest_max: number | null;
            tempo: string | null;
            is_hidden: boolean;
            exercise: {
                id: string;
                name: string;
                muscle_group: string;
            };
        }[];
    };
    session: {
        id: string;
        start_time: string | Date | null;
        end_time: string | Date | null;
        sessionExerciseLogs: {
            id: string;
            exercise_with_metadata_id: string | null;
            exercise_id: string | null;
            exerciseLog: {
                id: string;
                exerciseId?: string | null;
                weight: number | null;
                reps: number;
                rpe: number | null;
                set_order_index: number;
            } | null;
        }[];
    } | null;
    previousLogsByExercise: Record<string, ExerciseLog[]>;
};
