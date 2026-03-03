import { useQuery } from "@tanstack/react-query";

interface ExerciseLogWithHistory {
    id: string;
    weight: number | null;
    reps: number;
    set_order_index: number;
    workoutSession: {
        date: string;
        start_time: string | null;
    };
    pr_type?: string | null;
    exerciseWithMetadata: {
        reps_min: number;
        reps_max: number;
        sets_min: number;
        sets_max: number;
        tempo: string;
        rest_min: number;
        rest_max: number;
    } | null;
}

import { logKeys } from "@/app/features/logging/api/query-keys";

export function useExerciseHistory(exerciseId: string | undefined) {
    return useQuery({
        queryKey: logKeys.history(exerciseId),
        queryFn: async () => {
            if (!exerciseId) throw new Error("Exercise ID is required");
            const res = await fetch(`/api/exercises/${exerciseId}/logs`);
            if (!res.ok) {
                throw new Error("Failed to fetch exercise history");
            }
            const data = await res.json();
            return data as ExerciseLogWithHistory[];
        },
        enabled: !!exerciseId,
    });
}
