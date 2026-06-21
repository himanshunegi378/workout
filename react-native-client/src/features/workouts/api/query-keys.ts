/**
 * CENTRALIZED QUERY KEYS FOR WORKOUTS
 */
export const workoutKeys = {
  all: ['workouts'] as const,
  lists: () => [...workoutKeys.all, 'list'] as const,
  list: (programmeId: string) => [...workoutKeys.lists(), programmeId] as const,
  details: () => [...workoutKeys.all, 'detail'] as const,
  detail: (workoutId: string) => [...workoutKeys.details(), workoutId] as const,
};
