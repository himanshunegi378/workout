/**
 * Entry point for the workouts feature.
 * Exports public keys, hooks, and types for cross-feature usage.
 */

// Query Keys
export { workoutKeys } from "./api/query-keys";

// Types
export type { WorkoutDetailsResponse } from "./api/query-hooks/use-workout-details";
