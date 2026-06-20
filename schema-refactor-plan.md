# Refinement Plan: Prisma Schema Refactoring for Exercise Logs

## Overview
Based on the task requirements, we are refactoring the data model to introduce a `SessionExerciseLog` junction model that acts as the primary parent for `ExerciseLog` (individual sets). This decoupling removes the direct link between raw set data and programme/session templates, ensuring that `ExerciseLog` only interacts with the specific execution context provided by `SessionExerciseLog`.

---

## Proposed Structural Changes

### 1. The Junction Model (`SessionExerciseLog`)
Introduce a new model to act as the bridge between sessions and sets.

- **Current Path**: `WorkoutSession` ➔ `ExerciseLog` ➔ `ExerciseWithMetadata`
- **New Path**: `WorkoutSession` ➔ `SessionExerciseLog` ➔ `ExerciseLog` (Strict hierarchy)

**Model Definition (Conceptual):**
- `id`: Unique identifier (`cuid`).
- **`exercise_log_id`**: Foreign key to the raw performance data (`ExerciseLog`).
- `workout_session_id`: Links to the parent session.
- `exercise_with_metadata_id`: Links to the prescribed exercise template.
- `exercise_id`: Optional link for ad-hoc exercises.
- `notes`: Optional set-specific notes (execution context).

### 2. Model Modifications

#### **`WorkoutSession`**
- **Remove**: Direct relation to `ExerciseLog[]` (`exerciseLogs`).
- **Add**: Direct relation to `SessionExerciseLog[]`.

#### **`ExerciseWithMetadata`**
- **Remove**: Direct relation to `ExerciseLog[]` (`exerciseLogs`).
- **Add**: Relation to `SessionExerciseLog[]` if reverse lookup is required.

#### **`ExerciseLog` (Sets)**
- **Remove**: `exercise_with_metadata_id` (Moved to `SessionExerciseLog`).
- **Remove**: `workout_session_id` (Moved to `SessionExerciseLog`).
- **No Change**: This table now strictly contains performance metrics (weight, reps, order) and no longer manages its own relational context.

### 3. Impact Assessment
- **Queries**: Dashboard and history queries will need to update their `select`/`include` paths to traverse the new junction.
- **Data Integrity**: Existing data must be migrated by creating a `SessionExerciseLog` record for **every existing `ExerciseLog`**, mapping the session and metadata relations from the log to the new context record.
- **Redundancy**: This removes the flat mapping and enforces a hierarchical structure that aligns better with how fitness logging is visualized (Exercise Header ➔ Multiple Sets).
