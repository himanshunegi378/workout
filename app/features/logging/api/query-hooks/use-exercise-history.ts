"use client";

import { useQuery } from "@tanstack/react-query";
import { logKeys } from "../query-keys";

export interface ExerciseHistoryLog {
    id: string;
    exerciseId: string | null;
    weight: number | null;
    reps: number;
    rpe: number | null;
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
 * Fetches planned and ad-hoc set history for one or more exercises.
 * Uses normalized exercise IDs to maintain stable React Query cache entries.
 */
export function useExerciseHistory(exerciseId: string | string[] | undefined) {
    const exerciseIds = normalizeExerciseIds(exerciseId);

    return useQuery({
        queryKey: logKeys.history(exerciseIds),
        queryFn: async () => {
            if (exerciseIds.length === 0) throw new Error("Exercise ID is required");

            const searchParams = new URLSearchParams();
            exerciseIds.forEach((id) => searchParams.append("exerciseId", id));

            const res = await fetch(`/api/exercises/logs?${searchParams.toString()}`);
            if (!res.ok) {
                throw new Error("Failed to fetch exercise history");
            }

            return res.json() as Promise<ExerciseHistoryLog[]>;
        },
        enabled: exerciseIds.length > 0,
    });
}

/**
 * Standardizes date formatting for log grouping and filtering.
 */
export function formatLogDate(date: string | Date) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

/**
 * Normalizes optional single-value and array query inputs for stable cache keys.
 */
function normalizeExerciseIds(exerciseId: string | string[] | undefined) {
    return [...new Set((Array.isArray(exerciseId) ? exerciseId : [exerciseId])
        .filter((id): id is string => Boolean(id)))]
        .sort();
}

/**
 * Groups exercise history logs by their session date for the timeline UI.
 */
export function groupLogsByDate(logs: ExerciseHistoryLog[] | undefined) {
    if (!logs) return {};

    return logs.reduce<Record<string, ExerciseHistoryLog[]>>((acc, log) => {
        // Legacy or partially synced logs may be missing their session date.
        const dateStr = log.workoutSession?.date
            ? formatLogDate(log.workoutSession.date)
            : "Previous Records";

        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }

        acc[dateStr].push(log);
        return acc;
    }, {});
}
