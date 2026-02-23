import { useQuery } from "@tanstack/react-query";
import { exerciseKeys } from "../query-keys";
import { getExercises } from "../queries";

export function useExercises() {
    return useQuery({
        queryKey: exerciseKeys.lists(),
        queryFn: getExercises,
    });
}
