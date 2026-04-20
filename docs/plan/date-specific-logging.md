# Date-Specific Exercise Logging & Tabbed History Plan

## Overview
Enhance the exercise logging UX by allowing users to log sets directly to historical dates when clicking exercises in the log timeline. Additionally, improve the drawer UX by separating the specific day's activity from the overall exercise history using a tabbed interface.

## Goals
- Allow logging sets to a specific historical date via the `ExerciseQuickLogDrawer`.
- Default the drawer view to focus on the sets logged for the specific date instance clicked.
- Introduce a tabbed UI in the drawer to toggle between the current session/day and full history.

## Technical Tasks

### 1. Backend Updates
- [ ] **Modify `POST /api/log/set`**:
    - Accept an optional `date` (ISO string) in the request body.
    - If `date` is provided, find or create a `WorkoutSession` for that specific 24-hour window instead of defaulting to `new Date()`.
    - Ensure logical defaults if `date` is not provided (maintain current "today" behavior).

### 2. API & Mutation Hooks
- [ ] **Update `LogSetData` interface**: Add `date?: string` to `logSet` and `useLogSet` arguments.
- [ ] **Update `useLogSet` optimistic update**:
    - Adjust history cache update to use the provided `date` instead of always using `new Date().toISOString()`.

### 3. Component Data Flow
- [ ] **`ExerciseLogGroup`**: Accept a `date` prop and pass it to `ExerciseQuickLogDrawer`.
- [ ] **`SessionCard`**: Pass its `startTime` (as a date string) to `ExerciseLogGroup`.
- [ ] **`LogContent`**: Ensure `SessionCard` receives the correct date context.

### 4. `ExerciseQuickLogDrawer` Refactoring
- [ ] **State Management**:
    - Add `activeTab` state ("session" | "history").
- [ ] **UI Implementation**:
    - Implement a sleek, animated tab switcher using `framer-motion`.
    - **Tab 1 (Session)**: Filter the `logs` (from history) to show only sets matching the `initialDate`.
    - **Tab 2 (History)**: Show the full history (grouped by date) as it is currently.
- [ ] **Logging Logic**:
    - Ensure `handleSubmit` passes the `initialDate` to the mutation.
    - Update `getNextSetIndex` to count sets specifically for the `initialDate`.

### 5. Polish & UX
- [ ] Add transitions between tabs.
- [ ] Ensure "Quick Log" form updates correctly when switching contexts.

## TODO List
- [ ] Update `app/api/log/set/route.ts` to handle `date` param.
- [ ] Update `app/features/logging/api/mutations.ts` (`LogSetData`).
- [ ] Update `app/features/logging/api/mutation-hooks/use-log-set.ts`.
- [ ] Pass date from `LogContent` -> `SessionCard` -> `ExerciseLogGroup`.
- [ ] Refactor `ExerciseQuickLogDrawer` with tabs and date-aware filtering/logging.
