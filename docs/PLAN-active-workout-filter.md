# PLAN-active-workout-filter.md

## Objective
Filter the workout selection in the `SessionVolumeChart` to only show workouts belonging to "active" programmes. If no active programme exists, show a calibration-style blur overlay.

## Proposed Changes

### 1. API: `app/api/workouts/route.ts`
- Add support for an `active` query parameter.
- When `active=true`, include `where: { programme: { is_active: true } }` in the Prisma query.

### 2. Query Hook: `app/features/dashboard/api/query-hooks/use-workouts.ts`
- Update `useWorkouts` to accept an `onlyActive?: boolean` parameter.
- Pass `active=true` to the fetch URL if `onlyActive` is true.

### 3. UI: `app/features/dashboard/screens/dashboard/ui/SessionVolumeChart.tsx`
- Import `useProgrammes` from `app/features/programs/api/query-hooks/use-programmes`.
- Determine if any programme is active: `const hasActiveProgramme = programmes?.some(p => p.is_active)`.
- Use `useWorkouts(true)` to fetch only active workouts.
- Implement the "No Active Programme" blur overlay if `hasActiveProgramme` is false.
- Match the styling of the calibration overlay in `FatigueTrendLine.tsx`.

## Verification Steps
1. Navigate to the dashboard.
2. Toggle a programme off in the programmes list and verify its workouts disappear from the dropdown.
3. Toggle all programmes off and verify the chart blurs with the appropriate message.
4. Active a programme and verify the dropdown and chart reappear.
