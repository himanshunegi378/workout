"use client";

import { useQuery } from "@tanstack/react-query";
import { programKeys } from "../query-keys";
import { getWorkoutGroups } from "../queries";

export function useWorkoutGroups() {
    return useQuery({
        queryKey: programKeys.lists(),
        queryFn: () => getWorkoutGroups(),
    });
}
