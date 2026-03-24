import { useQuery } from "@tanstack/react-query";
import { logKeys } from "../query-keys";

/**
 * Persistence layer for fetching the most recent performance record for a specific exercise.
 */
export async function getLastLog(exerciseId: string) {
    const res = await fetch(`/api/exercises/${exerciseId}/last-log`);
    if (!res.ok) {
        throw new Error("Failed to fetch last log");
    }
    return res.json();
}

/**
 * A custom query hook for fetching the most recent performance record for a specific exercise.
 * 
 * Context:
 * This hook is critical for "Best Previous" logic when logging a new set. Since 
 * users can perform hundreds of different exercises across different programmes, 
 * this provides a targeted fetch for just the last data point.
 * 
 * Why:
 * - Effortless Recall: Replaces manual lookup by automatically retrieving historical 
 *   performance (weight, reps, etc.) as soon as the user selects an exercise.
 * - Targeted Cache: Keyed specifically to the `exerciseId`, providing granular 
 *   control over which performance data is updated.
 */
export function useLastLog(exerciseId: string, enabled = true) {
    return useQuery({
        queryKey: logKeys.lastLog(exerciseId),
        queryFn: () => getLastLog(exerciseId),
        enabled,
    });
}
