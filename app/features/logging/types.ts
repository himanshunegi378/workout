import { 
    ExerciseLog as PrismaExerciseLog,
    Exercise as PrismaExercise,
} from "@/app/generated/prisma";

/**
 * Represents a raw exercise log entry.
 */
export type ExerciseLog = PrismaExerciseLog;

/**
 * Simplified exercise definition derived from Prisma for UI relations.
 */
export type Exercise = Pick<PrismaExercise, "id" | "name" | "muscle_group">;

/**
 * Represents a simplified session exercise log with its relations.
 */
export interface SessionExerciseLogWithRelations {
    id: string;
    exercise_with_metadata_id: string | null;
    exerciseLog: ExerciseLog & {
        exercise: Exercise | null;
    } | null;
    exerciseWithMetadata: {
        exercise: Exercise;
    } | null;
}

/**
 * Represents a workout session View Model as returned by the API.
 */
export interface SessionWithLogs {
    id: string;
    date: Date;
    start_time: Date | null;
    end_time: Date | null;
    workout: {
        name: string;
        programme: { name: string };
    } | null;
    sessionExerciseLogs: SessionExerciseLogWithRelations[];
}

/**
 * Represents sessions grouped by a label (e.g., month or week).
 */
export interface GroupedSession {
    label: string;
    sessions: SessionWithLogs[];
}

/**
 * Standard paginated response wrapper for API responses.
 * @template T - The type of data being paginated.
 */
export interface PaginatedResponse<T> {
    data: T;
    pagination: {
        from: string | null;
        to: string | null;
        hasMore: boolean;
    };
}
