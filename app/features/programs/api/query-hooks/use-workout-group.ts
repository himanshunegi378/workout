import { useQuery } from "@tanstack/react-query";
import { programKeys } from "../query-keys";

type WorkoutGroupDetails = {
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

export function useWorkoutGroup(groupId: string) {
    return useQuery({
        queryKey: programKeys.detail(groupId),
        queryFn: async (): Promise<WorkoutGroupDetails> => {
            const res = await fetch(`/api/groups/${groupId}`);
            if (!res.ok) throw new Error("Failed to fetch workout group");
            return res.json() as Promise<WorkoutGroupDetails>;
        },
        enabled: !!groupId,
    });
}
