import { useQuery } from "@tanstack/react-query";
import { programmeKeys } from "../query-keys";

export type ProgrammeSummary = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    workouts: { id: string }[];
};

/**
 * A custom query hook for fetching a summary of all training programmes available to the user.
 * 
 * Context:
 * This hook is the primary data source for the programme list screen. It provides 
 * high-level metrics for each programme, such as the number of scheduled workouts.
 * 
 * Why:
 * - High-level Overview: Allows users to quickly see their current training cycles 
 *   and navigate into specific workout protocols.
 * - Centralized Loading: Standardizes the fetching of programme data and manages 
 *   the global loading state via TanStack Query.
 */
export function useProgrammes() {
    return useQuery({
        queryKey: programmeKeys.lists(),
        queryFn: async (): Promise<ProgrammeSummary[]> => {
            const res = await fetch("/api/programmes");
            if (!res.ok) throw new Error("Failed to fetch programmes");
            return res.json() as Promise<ProgrammeSummary[]>;
        },
    });
}
