"use client";

import { useQuery } from "@tanstack/react-query";
import { workoutKeys } from "../query-keys";
import { getWorkoutDetails } from "../queries";

export function useWorkoutDetails(groupId: string, workoutId: string) {
    return useQuery({
        queryKey: workoutKeys.detail(workoutId),
        queryFn: () => getWorkoutDetails(groupId, workoutId),
        enabled: !!groupId && !!workoutId,
    });
}
