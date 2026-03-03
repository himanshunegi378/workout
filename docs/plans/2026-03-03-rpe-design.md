# Design Document: RPE (Rate of Perceived Exertion) Tracking

**Date:** 2026-03-03
**Status:** Approved

## Purpose
Allow users to log the intensity of their sets using the RPE scale (1-10). This provides context to weight and reps, helping users understand how close they were to failure.

## User Experience
- **Interactions:** Horizontal pill-based selection (Approach 2).
- **Placement:** Integrated into `LogSetDrawer` and `StandaloneLogDrawer`.
- **Options:** Numbers 5 through 10 (effort typically below 5 is not logged).
- **Aesthetics:** High-intent colors (Indigo/Violet) for selection, smooth transitions, and mobile-optimized horizontal scrolling.

## Technical Architecture

### 1. Data Layer
- **Schema:** `ExerciseLog.rpe` (Float, Optional).
- **Incremental migrations:** `prisma db push` during development.

### 2. API & Logic
- **Endpoint:** `/api/log/set` updated to handle `rpe`.
- **Hooks:** `useLogSet` mutation updated for optimistic RPE display.

### 3. Components
- **`RPESelector`:** A reusable component for the pill-row.
- **`LogSetDrawer`:** Displays the selector between inputs and save button.
- **`ExerciseCard`:** Displays RPE badges in the history view.

## Testing Strategy
- **Manual:** Verify RPE persists after logging a set.
- **Visual:** Ensure horizontal scrolling works on mobile viewports.
- **Consistency:** Verify RPE appears in history immediately after optimistic update.
