# Schema Refactor Impact List

This document tracks the files impacted by the Prisma schema refactoring (introducing `SessionExerciseLog` junction model).

## 1. Schema Changes
- [x] `prisma/schema.prisma`: Add `SessionExerciseLog` and update relations in `WorkoutSession`, `ExerciseWithMetadata`, and `ExerciseLog`.

## 2. Affected Code Files
### Backend (API Routes)
- [x] `app/api/log/set/route.ts`: Creation and updates of sets use `SessionExerciseLog`. Added auto-cleanup for empty containers.
- [x] `app/api/log/sessions/route.ts`: Fetching sessions traversals updated.
- [x] `app/api/log/volume/route.ts`: Volume calculations updated for nested structure.
- [x] `app/api/analytics/session-volume/route.ts`: (Using updated `exercise_analytics_view`).
- [x] `app/api/programmes/[programmeId]/workouts/[workoutId]/details/route.ts`: Logic for active and previous logs updated.
- [x] `app/api/exercises/[exerciseId]/logs/route.ts`: Relation traversal updated.
- [x] `app/api/exercises/[exerciseId]/last-log/route.ts`: Hierarchy traversal updated.
- [x] `app/api/analytics/fatigue/route.ts`: ACWR calculation traversal updated.

### Frontend (Hooks & Components)
- [x] `app/features/logging/types.ts`: Updated interfaces to include `SessionExerciseLogWithRelations`.
- [x] `app/features/workouts/api/query-hooks/use-workout-details.ts`: Response types synchronized.
- [x] `app/features/workouts/components/ExerciseListContent.tsx`: Session log mapping updated.
- [x] `app/features/logging/components/LogContent.tsx`: Nested group mapping updated.
- [x] `app/features/workouts/api/mutation-hooks/use-create-workout.ts`: Fixed `programmeId` naming.
- [x] `app/features/workouts/components/AddWorkoutForm.tsx`: Fixed `programmeId` naming and routing.
- [x] `app/programmes/[programmeId]/workouts/new/page.tsx`: Fixed parameter names.
- [x] `app/programmes/[programmeId]/workouts/[workoutId]/page.tsx`: Fixed parameter names.
- [x] `app/features/workouts/components/ui/LoadingState.tsx`: Fixed back links and props.
- [x] `app/features/workouts/api/query-keys.ts`: Synchronized `programmeId` in keys.
- [x] `app/features/workouts/api/mutations.ts`: Updated API endpoints.
- [x] `app/features/exercises/api/mutations.ts`: Updated API endpoints.

### Scripts
- [x] `scripts/create-analytics-view.ts`: SQL view updated to join through `session_exercise_logs`.

## 3. Data Migration
- [x] Create a migration script to populate `SessionExerciseLog` from existing `ExerciseLog` records. (`scripts/migrate-to-junction.ts`)
- [x] Run the migration. (Completed successfully).
