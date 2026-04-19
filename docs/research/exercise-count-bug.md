# 🔬 Research Report: Exercise Count Discrepancy

---

## Executive Summary
The "Exercise Count Wrong" bug is a multi-layered issue involving stale cache management, inconsistent soft-delete filtering in the backend, and disconnected UI logic in the live workout session HUD.

## Identifying the Root Causes

### 1. Cache Invalidation Lag (Primary Cause)
The most visible manifestation is on the **Programme Details** page (`/programmes/[id]`). When a user adds or hides an exercise, the count on the workout card does not update immediately.

- **The Bug:** Mutation hooks like `useAddExerciseToWorkout` and `useEditExerciseMetadata` only invalidate `workoutKeys.detail(workoutId)`.
- **The Gap:** The `WorkoutCard` component on the programme screen pulls data from `programmeKeys.detail(programmeId)`.
- **Result:** The count remains stale until a manual refresh or cache expiry (1 week TTL).

### 2. Inconsistent `is_hidden` Filtering in API
Several API routes calculate indices or counts without accounting for the `is_hidden` soft-delete flag.

- **Order Index Calculation:** `app/api/programmes/[id]/workouts/[id]/exercises/route.ts` uses an unfiltered `_count` to determine the `order_index` for new exercises.
- **Impact:** This creates gaps in ordering logic and can lead to discrepancies if any frontend logic relies on array length vs. aggregate counts.

### 3. Live Progress HUD Mismatch
In the "Live Workout" screen (`ExerciseListContent.tsx`), the progress bar (e.g., "5 OF 5 Exercises Done") is disconnected from dynamic session changes.

- **The Logic Gap:**
    - `totalExercises` is derived strictly from the **prescribed template**.
    - `completedExercises` is also filtered strictly against the **template IDs**.
- **Ad-hoc Exercises:** If a user adds an exercise during a session, it is logged to the session but ignored by the progress HUD. This makes the "Total" and "Completed" metrics feel incorrect to the user.

---

## 🚀 Recommended Fixes

### Phase 1: Immediate UX Fix (Cache)
Modify mutation hooks to invalidate the parent programme query:
```typescript
// In useAddExerciseToWorkout.ts
onSuccess: (_, variables) => {
    queryClient.invalidateQueries({ queryKey: workoutKeys.detail(variables.workoutId) });
    queryClient.invalidateQueries({ queryKey: programmeKeys.detail(variables.programmeId) });
}
```

### Phase 2: Structural Integrity (Backend)
Standardize `_count` queries to always include the `is_hidden: false` filter. Fix the `POST` route for exercises to use a filtered count for calculating `order_index`.

### Phase 3: Live UI Update (Frontend)
Update the progress calculation in `ExerciseListContent` to dynamically count both template and ad-hoc exercises that have been interacted with during the session.

---

## 🏁 Next Steps
1. **Apply Cache Fix**: Update the invalidation logic in exercise mutation hooks.
2. **Standardize API Counts**: Audit and patch all `_count` references to enforce soft-delete filtering.
3. **Patch Progress HUD**: Adjust the live workout screen to account for ad-hoc exercises.
