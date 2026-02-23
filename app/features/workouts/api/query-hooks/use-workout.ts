import { useQuery } from "@tanstack/react-query";
import { workoutKeys } from "../query-keys";
import { getWorkouts, getWorkoutById } from "../queries";

export function useWorkouts(groupId: string) {
    return useQuery({
        queryKey: workoutKeys.list(groupId),
        queryFn: () => getWorkouts(groupId),
        enabled: !!groupId,
    });
}

export function useWorkout(groupId: string, workoutId: string) {
    return useQuery({
        queryKey: workoutKeys.detail(workoutId),
        queryFn: () => getWorkoutById(groupId, workoutId),
        enabled: !!groupId && !!workoutId,
    });
}
