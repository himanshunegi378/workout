import { useQuery } from "@tanstack/react-query";
import { logKeys } from "../query-keys";

/**
 * Fetches the last logged set for a specific exercise.
 * 
 * @param {string} exerciseId - The unique identifier of the exercise.
 * @returns {Promise<any>} The parsed JSON response containing the last log entry.
 * @throws {Error} If the fetch request fails.
 */
export async function getLastLog(exerciseId: string) {
    const res = await fetch(`/api/exercises/${exerciseId}/last-log`);
    if (!res.ok) {
        throw new Error("Failed to fetch last log");
    }
    return res.json();
}

/**
 * A query hook for retrieving the last log entry for a specific exercise.
 * 
 * @param {string} exerciseId - The unique identifier of the exercise.
 * @param {boolean} [enabled=true] - Whether the query should be enabled.
 * @returns {import("@tanstack/react-query").UseQueryResult} A React Query result object.
 */
export function useLastLog(exerciseId: string, enabled = true) {
    return useQuery({
        queryKey: [...logKeys.all, "last-log", exerciseId],
        queryFn: () => getLastLog(exerciseId),
        enabled,
    });
}
