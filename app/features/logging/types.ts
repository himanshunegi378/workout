export interface ExerciseLogWithRelations {
    id: string;
    weight: number | null;
    reps: number;
    set_order_index: number;
    exercise: { id: string; name: string; muscle_group: string } | null;
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
        workoutGroup: { name: string };
    };
    exerciseLogs: ExerciseLogWithRelations[];
}

export interface GroupedSession {
    label: string;
    sessions: SessionWithLogs[];
}
