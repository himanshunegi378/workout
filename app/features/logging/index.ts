/**
 * Entry point for the logging feature.
 * Exports public hooks and components for cross-feature usage.
 */

// UI Components
export { ExerciseQuickLogDrawer } from "./screens/workout-history/ui/ExerciseQuickLogDrawer";

// Hooks
export { useLogSet } from "./api/mutation-hooks/use-log-set";
export { useUpdateLogSet } from "./api/mutation-hooks/use-update-log-set";
export { useDeleteLogSet } from "./api/mutation-hooks/use-delete-log-set";
export { getLastLog } from "./api/query-hooks/use-last-log";
export { useExerciseHistory, groupLogsByDate } from "./api/query-hooks/use-exercise-history";

// Types
export * from "./types";
