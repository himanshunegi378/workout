# Hook Templates

## Query Hook — List

```ts
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
```

## Query Hook — Single Resource with Params

```ts
import { useQuery } from "@tanstack/react-query";
import { workoutKeys } from "../query-keys";

type WorkoutDetailsResponse = {
    workout: {
        id: string;
        name: string;
        exercisesWithMetadata: {
            id: string;
            exercise_id: string;
            sets_min: number | null;
            sets_max: number | null;
            // ... other fields
            exercise: { id: string; name: string; muscle_group: string };
        }[];
    };
    session: {
        id: string;
        exerciseLogs: {
            id: string;
            weight: number | null;
            reps: number;
            exercise_with_metadata_id: string | null;
            set_order_index: number;
        }[];
    } | null;
};

export function useWorkoutDetails(groupId: string, workoutId: string) {
    return useQuery({
        queryKey: workoutKeys.detail(workoutId),
        queryFn: async (): Promise<WorkoutDetailsResponse> => {
            const res = await fetch(`/api/groups/${groupId}/workouts/${workoutId}/details`);
            if (!res.ok) throw new Error("Failed to fetch workout details");
            return res.json() as Promise<WorkoutDetailsResponse>;
        },
        enabled: !!groupId && !!workoutId,
    });
}
```

## Mutation Hook — Delete with Cache Invalidation

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logKeys } from "../query-keys";

export function useDeleteLogSet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (setId: string) => {
            const res = await fetch(`/api/log/set/${setId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete log set");
            return res.json();
        },
        onSuccess: () => {
            // Invalidate broadly — affects session list AND history drawer
            queryClient.invalidateQueries({ queryKey: logKeys.all });
        },
    });
}
```

## Query Key Factory

```ts
export const logKeys = {
    all: ["logs"] as const,
    lists: () => [...logKeys.all, "list"] as const,
    list: (filters: string) => [...logKeys.lists(), { filters }] as const,
    sessions: () => [...logKeys.all, "sessions"] as const,
    history: (exerciseId?: string) => [...logKeys.all, "history", exerciseId].filter(Boolean),
};
```
