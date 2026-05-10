import { 
    ExerciseLog as PrismaExerciseLog,
    Exercise as PrismaExercise,
    ExerciseWithMetadata as PrismaEWM
} from "@/app/generated/prisma";

/**
 * Shared types for the workouts feature.
 * Derived from Prisma to ensure synchronization while remaining 
 * flexible for partial API relations.
 */

export type ExerciseLog = PrismaExerciseLog;

/**
 * A simplified exercise definition for UI relations.
 */
export type Exercise = Pick<PrismaExercise, "id" | "name" | "muscle_group">;

/**
 * An exercise as it appears inside a specific Workout, extended with its 
 * simplified related exercise definition.
 */
export type ExerciseWithMetadata = PrismaEWM & {
    exercise: Exercise;
};

/**
 * Standard response shape for fetching workout session details.
 */
export type WorkoutDetailsResponse = {
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
};
