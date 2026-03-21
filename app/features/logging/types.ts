/**
 * Represents a simplified session exercise log with its relations.
 * This is used for displaying logs in a session context.
 */
export interface SessionExerciseLogWithRelations {
    id: string;
    exercise_with_metadata_id: string | null;
    exerciseLog: {
        id: string;
        weight: number | null;
        reps: number;
        rpe: number | null;
        set_order_index: number;
        pr_type?: string | null;
        exercise: { id: string; name: string; muscle_group: string } | null;
    } | null;
    exerciseWithMetadata: {
        exercise: { id: string; name: string; muscle_group: string };
    } | null;
}

/**
 * Represents a workout session including its associated workout metadata and exercise logs.
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
