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
