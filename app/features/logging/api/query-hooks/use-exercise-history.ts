"use client";

import { useQuery } from "@tanstack/react-query";
import { logKeys } from "../query-keys";

export interface ExerciseHistoryLog {
    id: string;
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
 * Fetches the historical logs for a single exercise.
 * 
 * @param {string | undefined} exerciseId - The ID of the exercise.
 * @returns {import("@tanstack/react-query").UseQueryResult<ExerciseHistoryLog[]>} Historical logs.
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

/**
 * Groups exercise history logs by their session date for the timeline UI.
 * 
 * @param {ExerciseHistoryLog[]} logs - The array of historical logs.
 * @returns {Record<string, ExerciseHistoryLog[]>} Logs grouped by formatted date string.
 */
export function groupLogsByDate(logs: ExerciseHistoryLog[] | undefined) {
    if (!logs) return {};
    
    return logs.reduce<Record<string, ExerciseHistoryLog[]>>((acc, log) => {
        // Guard against missing dates to avoid grouping old logs into "Today"
        const dateStr = log.workoutSession?.date
            ? new Date(log.workoutSession.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
              })
            : "Previous Records";

        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }

        acc[dateStr].push(log);
        return acc;
    }, {});
}

