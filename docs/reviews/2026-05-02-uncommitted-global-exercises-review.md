# Uncommitted Changes Review: Global Exercises

**Risk:** MEDIUM

**GitNexus:** `detect_changes(scope: "all")` found 15 changed symbols across 12 files, with no indexed execution flows mapped and low overall indexed-flow risk. API impact reports show `/api/exercises` and programme workout exercise creation have direct frontend consumers, so response and identity behavior still need manual review.

**Lens Used:** Security

## Changes Summary

- Adds first-class global exercises via `Exercise.is_global` and nullable `Exercise.user_id`.
- Lets global exercises appear in the exercise list and be used for last-log lookup, ad-hoc logging, and programme workout exercise creation.
- Adds integration coverage for global exercise listing, logging, and workout insertion.

## Findings

### MAJOR Hidden Global Duplicate Orphans Existing History
- **Pillar:** Logical Issue
- **File:** [app/api/exercises/route.ts](/mnt/New_Volume/project/workout/app/api/exercises/route.ts:118)
- **Lines:** L118-L127
- **Problem:** `toPublicExerciseList` hides a global exercise whenever the user has a custom exercise with the same normalized name and muscle group, but history and previous-log APIs remain keyed by the selected exercise id. In the real workout flow, a user can log sets against the built-in "Bench Press", later create their own "Bench Press" variation, and then only see the custom id in selectors. Calls to `/api/exercises/{customId}/last-log` and `/api/exercises/logs?exerciseId={customId}` will not include the older global-id logs.
- **Impact:** The app appears to forget prior performance after a natural customization step. Best-previous, exercise history, and quick logging can show empty or incomplete data even though the user has already trained that movement.

## Missing Coverage

- Current tests cover hiding the global duplicate in the list.
- Missing: a test that logs against a global exercise, creates a same-name user exercise, then verifies history/last-log continuity for the movement the UI now exposes.

## Verification

- `pnpm vitest run --config vitest.integration.config.ts tests/api/exercises.test.ts tests/api/log.test.ts tests/api/programmes.test.ts tests/integration/exercises.integration.test.ts tests/integration/exercises-subroutes.integration.test.ts tests/integration/log-set.integration.test.ts tests/integration/workout-exercises.integration.test.ts`
- Result: 4 integration test files passed, 72 tests passed.

## Recommendation

REQUEST CHANGES before merge. Keep the human movement continuity intact: either return an alias/canonical id mapping so history queries include both ids, migrate/merge logs when a user customizes a global movement, or avoid hiding the global row until the rest of the logging/history model understands duplicate movement identity.

No new issue classes found this session.
