import { useQuery } from "@tanstack/react-query";
import { programmeKeys } from "../query-keys";

type ProgrammeDetails = {
    id: string;
    name: string;
    workouts: {
        id: string;
        name: string;
        order_index: number;
        exercisesWithMetadata: {
            exercise: { name: string };
        }[];
        _count: {
            exercisesWithMetadata: number;
        };
    }[];
};

/**
 * A custom query hook for fetching the full structure of a specific training programme.
 * 
 * Context:
 * This hook is used on the "Programme Details" screen to display all workouts and 
 * their underlying exercise counts within a single programme.
 * 
 * Why:
 * - Granular Detail: Provides the necessary structure to allow users to pick a 
 *   specific workout from a cycle (e.g., "Day 1: Upper Body").
 * - Dynamic Resolution: Automatically enables or disables fetching based on the 
 *   presence of a `programmeId`, ensuring robust error handling in navigation.
 */
export function useProgramme(programmeId: string) {
    return useQuery({
        queryKey: programmeKeys.detail(programmeId),
        queryFn: async (): Promise<ProgrammeDetails> => {
            const res = await fetch(`/api/programmes/${programmeId}`);
            if (!res.ok) throw new Error("Failed to fetch programme");
            return res.json() as Promise<ProgrammeDetails>;
        },
        enabled: !!programmeId,
    });
}
