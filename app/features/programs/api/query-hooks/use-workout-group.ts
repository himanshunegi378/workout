"use client";

import { useQuery } from "@tanstack/react-query";
import { programKeys } from "../query-keys";
import { getWorkoutGroup } from "../queries";

export function useWorkoutGroup(groupId: string) {
    return useQuery({
        queryKey: programKeys.detail(groupId),
        queryFn: () => getWorkoutGroup(groupId),
        enabled: !!groupId,
    });
}
