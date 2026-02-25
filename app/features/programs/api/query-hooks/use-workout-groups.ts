import { useQuery } from "@tanstack/react-query";
import { programKeys } from "../query-keys";

type WorkoutGroupSummary = {
    id: string;
    name: string;
    description: string | null;
    workouts: { id: string }[];
};

export function useWorkoutGroups() {
    return useQuery({
        queryKey: programKeys.lists(),
        queryFn: async (): Promise<WorkoutGroupSummary[]> => {
            const res = await fetch("/api/groups");
            if (!res.ok) throw new Error("Failed to fetch workout groups");
            return res.json() as Promise<WorkoutGroupSummary[]>;
        },
    });
}
