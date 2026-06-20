# Unifying Ad-hoc and Planned Exercise Logs Plan

## Overview
Currently, ad-hoc exercise sets (logged via "Quick Log") are placed into separate `WorkoutSession` records, even if a planned session exists for that same date. This causes them to appear as distinct "Ad-hoc Exercises" cards in the timeline. The goal is to merge these ad-hoc sets into existing sessions for that day and visually distinguish them with a subtle icon.

## Goals
- Merge ad-hoc sets into existing `WorkoutSession` records for the same date.
- Unify the visual representation so all sets of the same exercise appear under one header within a session.
- Add a subtle visual indicator (icon) for ad-hoc sets.

## Technical Tasks

### 1. Backend: Smart Session Lookup
- [ ] **Modify `app/api/log/set/route.ts`**:
    - Update the session finding logic for ad-hoc sets (`workoutId` is null).
    - Instead of searching specifically for a session with `workout_id: null`, search for ANY session by that user on the target date.
    - If multiple sessions exist:
        - Prioritize an "active" session (one with `workout_id` present).
        - If multiple planned sessions exist, pick the most recent one.
    - This ensures ad-hoc sets are "attached" to the day's main activity if it exists.

### 2. Frontend: Data Enrichment
- [ ] **Update `LogContent.tsx`**:
    - When building `exerciseGroups`, include the `isAdHoc` status for each set.
    - Set `isAdHoc: sel.exercise_with_metadata_id === null`.
- [ ] **Update `types.ts`**:
    - Add `isAdHoc` to the set object within `SessionCard` and `ExerciseLogGroup` props if necessary.

### 3. UI: Set Row Indicators
- [ ] **Modify `ExerciseLogGroup.tsx` (SetRow)**:
    - Accept an `isAdHoc` prop.
    - If `isAdHoc` is true, render a subtle icon (e.g., `Zap` icon from `lucide-react`) near the set index.
    - Ensure the icon is non-distracting (low opacity or small size).

### 4. Cleanup & Polish
- [ ] Verify that adding an ad-hoc set to a day with NO sessions still creates a new "Ad-hoc Exercises" session as expected.
- [ ] Check if the `SessionCard` title/subtitle logic needs adjustment (e.g., if a session becomes "mixed").

## TODO List
- [ ] Update `POST` logic in `app/api/log/set/route.ts`.
- [ ] Update grouping logic in `app/features/logging/screens/workout-history/LogContent.tsx`.
- [ ] Update `ExerciseLogGroup.tsx` / `SetRow` with the `isAdHoc` icon.
- [ ] Test the experience by logging an ad-hoc set to a date with an existing planned session.
