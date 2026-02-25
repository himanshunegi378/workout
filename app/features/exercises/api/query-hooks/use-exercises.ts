import { useQuery } from "@tanstack/react-query";
import { exerciseKeys } from "../query-keys";

export function useExercises() {
    return useQuery({
        queryKey: exerciseKeys.lists(),
        queryFn: async () => {
            const res = await fetch("/api/exercises");
            if (!res.ok) throw new Error("Failed to fetch exercises");
            return res.json();
        },
    });
}
