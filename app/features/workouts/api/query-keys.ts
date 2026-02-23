export const workoutKeys = {
    all: ["workouts"] as const,
    lists: () => [...workoutKeys.all, "list"] as const,
    list: (groupId: string) => [...workoutKeys.lists(), { groupId }] as const,
    details: () => [...workoutKeys.all, "detail"] as const,
    detail: (id: string) => [...workoutKeys.details(), id] as const,
};
