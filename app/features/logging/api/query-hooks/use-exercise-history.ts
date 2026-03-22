"use client";

import { useQuery } from "@tanstack/react-query";
import { logKeys } from "../query-keys";

export interface ExerciseHistoryLog {
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

/**
 * Fetches the historical logs for a single exercise so workout and logging UIs
 * can render a focused performance timeline.
 */
export function useExerciseHistory(exerciseId: string | undefined) {
    return useQuery({
        queryKey: logKeys.history(exerciseId),
        queryFn: async () => {
            if (!exerciseId) throw new Error("Exercise ID is required");

            const res = await fetch(`/api/exercises/${exerciseId}/logs`);
            if (!res.ok) {
                throw new Error("Failed to fetch exercise history");
            }

            return res.json() as Promise<ExerciseHistoryLog[]>;
        },
        enabled: !!exerciseId,
    });
}
