# API Documentation

This document provides a comprehensive guide to the backend API route handlers (`app/api/**/route.ts`) in the Workout Tracker application. It is designed to help frontend developers, backend engineers, and new joiners understand endpoint structures, authentication requirements, input validation, database side-effects, and client-side integrations.

---

## 1. Authentication & Session Architecture

Authentication is powered by the NestJS backend using a signed HttpOnly `workout_auth` JWT cookie.
- **Provider**: credentials-based logins via username and password.
- **Backend Auth Endpoints**: `/api/auth/login`, `/api/auth/logout`, and `/api/auth/me`.
- **Database Helper**: `@/lib/auth-helpers` implements two session recovery mechanisms:
  - `getUserId()`: Returns `string | null` representing the authenticated user's ID. Used in API routes to gracefully return `401 Unauthorized`.
  - `requireUserId()`: Returns `string` or redirects to `/login`. Used in Server Components and Server Actions.

---

## 2. Core Auth & Users Domain

### 2.1. User Registration (Signup)
- **Endpoint**: `/api/auth/signup`
- **Method**: `POST`
- **Purpose**: Creates a new credentials-based user account.
- **Auth Requirement**: Public (No authentication required)
- **Request Parameters**:
  - **Body fields**:
    - `username` (string, required): Minimum 3 characters. Trimmed and converted to lowercase.
    - `password` (string, required): Minimum 6 characters.
- **Validation Rules**:
  - Manual validation for types, min length, and existence.
  - Checks database for existing username (unique constraint).
- **Request Example**:
  ```json
  {
    "username": "jack_fit",
    "password": "supersecurepassword123"
  }
  ```
- **Response Shape**:
  ```typescript
  {
    id: string;
    username: string;
  }
  ```
- **Success Response Example (201 Created)**:
  ```json
  {
    "id": "cldy12abcde345678fghij901",
    "username": "jack_fit"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Username must be at least 3 characters"}` or `{"error": "Password must be at least 6 characters"}`
  - `409 Conflict`: `{"error": "Username already taken"}`
  - `500 Internal Server Error`: `{"error": "Something went wrong. Please try again."}`
- **Side Effects**:
  - **Database Writes**: Inserts a new row into the `users` table. Password is securely hashed using `bcryptjs` with salt round cost `12`.
- **Related Frontend Usage**: Call on the sign-up page registration forms.
- **Code Reference**: [app/api/auth/signup/route.ts](file:///mnt/New_Volume/project/workout/app/api/auth/signup/route.ts)

---

## 3. Exercises Domain

### 3.1. Fetch Exercise Library
- **Endpoint**: `/api/exercises`
- **Method**: `GET`
- **Purpose**: Returns the list of available exercises. Includes global shared exercises and the user's custom exercises.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**: None
- **Response Shape**: `Array<Exercise>` (selecting only `id`, `name`, `description`, and `muscle_group`)
  ```typescript
  Array<{
    id: string;
    name: string;
    description: string | null;
    muscle_group: "Abs" | "Back" | "Biceps" | "Cardio" | "Chest" | "Forearms" | "Legs" | "Shoulders" | "Triceps";
  }>
  ```
- **Success Response Example (200 OK)**:
  ```json
  [
    {
      "id": "ex_benchpress",
      "name": "Barbell Bench Press",
      "description": "Flat bench barbell chest press.",
      "muscle_group": "Chest"
    },
    {
      "id": "cldy99abc123",
      "name": "Incline DB Flyes",
      "description": "Custom incline dumbbell chest flyes.",
      "muscle_group": "Chest"
    }
  ]
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `500 Internal Server Error`: `{"error": "Failed to fetch exercises"}`
- **Side Effects**: None (Read-only)
- **Related Frontend Usage**: Hook `useExercises` in [use-exercises.ts](file:///mnt/New_Volume/project/workout/app/features/exercises/api/query-hooks/use-exercises.ts)
- **Code Reference**: [app/api/exercises/route.ts](file:///mnt/New_Volume/project/workout/app/api/exercises/route.ts#L68)

### 3.2. Create Custom Exercise
- **Endpoint**: `/api/exercises`
- **Method**: `POST`
- **Purpose**: Creates a custom, user-scoped exercise entry.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Body fields**:
    - `id` (string, optional): Client-generated UUID for offline sync idempotency.
    - `name` (string, required): Non-empty exercise title.
    - `description` (string, optional): Detailed descriptions.
    - `muscle_group` (MuscleGroup, required): Must match one of the defined `MuscleGroup` enum values.
- **Validation Rules**:
  - Enforces `name` check.
  - Enforces `muscle_group` membership validation against the Prisma enum.
- **Idempotency**:
  - If a custom exercise with the client-submitted `id` already exists, checks ownership.
  - If it belongs to the user, it skips creation and returns the existing exercise (`200 OK`).
  - If it is global or owned by another user, returns `403 Forbidden`.
- **Request Example**:
  ```json
  {
    "id": "e8d7c485-f5b2-4d2d-82d2-8b63b2f5d7cf",
    "name": "Zottman Curl",
    "description": "Bicep curls with a pronated rotation at the top",
    "muscle_group": "Biceps"
  }
  ```
- **Response Shape**: Full `Exercise` DB model object.
- **Success Response Example (210/200/201 Created)**:
  ```json
  {
    "id": "e8d7c485-f5b2-4d2d-82d2-8b63b2f5d7cf",
    "name": "Zottman Curl",
    "description": "Bicep curls with a pronated rotation at the top",
    "muscle_group": "Biceps",
    "user_id": "usr_123456",
    "is_global": false
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Exercise name is required"}` or `{"error": "Valid muscle group is required"}`
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `403 Forbidden`: `{"error": "Forbidden"}` (idempotency collision)
  - `500 Internal Server Error`: `{"error": "Failed to create exercise"}`
- **Side Effects**:
  - **Database Writes**: Inserts a record into the `exercises` table.
- **Related Frontend Usage**: Called by mutation function `createExercise` in [mutations.ts](file:///mnt/New_Volume/project/workout/app/features/exercises/api/mutations.ts#L15) triggered from the `useCreateExercise` hook.
- **Code Reference**: [app/api/exercises/route.ts](file:///mnt/New_Volume/project/workout/app/api/exercises/route.ts#L6)

### 3.3. Fetch Exercise Last Log
- **Endpoint**: `/api/exercises/[exerciseId]/last-log`
- **Method**: `GET`
- **Purpose**: Retrieves the single latest completed set log for a specific exercise to establish progressive overload baseline targets in the active workout screen.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Path parameters**:
    - `exerciseId` (string, required): ID of the exercise.
- **Validation Rules**:
  - Verifies exercise exists and belongs to either the user or is part of the global library.
- **Response Shape**:
  ```typescript
  {
    id: string;
    weight: number | null;
    reps: number;
    rpe: number | null;
  } | null
  ```
- **Success Response Example (200 OK)**:
  ```json
  {
    "id": "log_set_778899",
    "weight": 85,
    "reps": 8,
    "rpe": 9
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `404 Not Found`: `{"error": "Exercise not found"}`
  - `500 Internal Server Error`: `{"error": "Failed to fetch top log"}`
- **Side Effects**: None (Read-only)
- **Related Frontend Usage**: Hook `useLastLog` in [use-last-log.ts](file:///mnt/New_Volume/project/workout/app/features/logging/api/query-hooks/use-last-log.ts)
- **Code Reference**: [app/api/exercises/[exerciseId]/last-log/route.ts](file:///mnt/New_Volume/project/workout/app/api/exercises/[exerciseId]/last-log/route.ts)

### 3.4. Fetch Exercise History & Logs
- **Endpoint**: `/api/exercises/logs`
- **Method**: `GET`
- **Purpose**: Fetches historical completed sets logs for one or more exercises. Supports loading logs linked directly to ad-hoc sessions as well as structured workout-session metadata.
- **Auth Requirement**: Authenticated (requires backend `workout_auth` cookie)
- **Request Params**:
  - **Query parameters**:
    - `exerciseId` / `exerciseIds` (string, required): Comma-separated list or array of exercise IDs.
    - `from` (string, optional): ISO date limit boundary (restrict query start range).
    - `to` (string, optional): ISO date limit boundary (restrict query end range).
- **Validation Rules**:
  - Validates `from` is before or equal to `to` date.
  - Normalizes multiple format patterns (comma splits, duplicate params, array keys).
- **Response Shape**:
  ```typescript
  Array<{
    id: string;
    exerciseId: string | null;
    weight: number | null;
    reps: number;
    rpe: number | null;
    set_order_index: number;
    pr_type: string | null;
    workoutSession: {
      date: string; // ISO String
      start_time: string | null;
    };
    exerciseWithMetadata: {
      reps_min: number;
      reps_max: number;
      sets_min: number;
      sets_max: number;
      tempo: string;
      rest_min: number;
      rest_max: number;
    } | null;
  }>
  ```
- **Success Response Example (200 OK)**:
  ```json
  [
    {
      "id": "log_set_101112",
      "exerciseId": "ex_squat",
      "weight": 140,
      "reps": 5,
      "rpe": 9,
      "set_order_index": 0,
      "pr_type": "REP_PR",
      "workoutSession": {
        "date": "2026-05-30T10:00:00.000Z",
        "start_time": "2026-05-30T09:45:00.000Z"
      },
      "exerciseWithMetadata": {
        "reps_min": 5,
        "reps_max": 5,
        "sets_min": 3,
        "sets_max": 3,
        "tempo": "3-1-1-0",
        "rest_min": 180,
        "rest_max": 240
      }
    }
  ]
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Missing exerciseId query parameter"}` or `{"error": "from must be before or equal to to"}`
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `500 Internal Server Error`: `{"error": "Failed to fetch exercise logs"}`
- **Side Effects**: None (Read-only)
- **Related Frontend Usage**: Hook `useExerciseHistory` in [use-exercise-history.ts](file:///mnt/New_Volume/project/workout/app/features/logging/api/query-hooks/use-exercise-history.ts)
- **Code Reference**: [app/api/exercises/logs/route.ts](file:///mnt/New_Volume/project/workout/app/api/exercises/logs/route.ts)

---

## 4. Programmes & Templates Domain

### 4.1. List Programmes
- **Endpoint**: `/api/programmes`
- **Method**: `GET`
- **Purpose**: Retrieves all training programmes owned by the user.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**: None
- **Response Shape**:
  ```typescript
  Array<{
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    workouts: Array<{ id: string }>;
  }>
  ```
- **Success Response Example (200 OK)**:
  ```json
  [
    {
      "id": "prog_ppl",
      "name": "Push Pull Legs (PPL)",
      "description": "Hypertrophy-focused training cycle",
      "is_active": true,
      "workouts": [{ "id": "wk_push" }, { "id": "wk_pull" }]
    }
  ]
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `500 Internal Server Error`: `{"error": "Failed to fetch programmes"}`
- **Side Effects**: None
- **Related Frontend Usage**: Hook `useProgrammes` in [use-programmes.ts](file:///mnt/New_Volume/project/workout/app/features/programmes/api/query-hooks/use-programmes.ts)
- **Code Reference**: [app/api/programmes/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/route.ts#L86)

### 4.2. Create Programme
- **Endpoint**: `/api/programmes`
- **Method**: `POST`
- **Purpose**: Creates a new training programme.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Body fields**:
    - `id` (string, optional): Client-generated UUID for offline sync idempotency.
    - `name` (string, required): Non-empty program title.
    - `description` (string, optional): Notes/details.
    - `is_active` (boolean, optional): Active state.
- **Validation Rules**:
  - Checks if `name` is valid and non-empty.
- **Idempotency**:
  - If a programme with the provided `id` already exists, returns the existing record (`200 OK`) if owned, otherwise `403 Forbidden`.
- **Side Effects**:
  - **Database Writes**: Inserts a new `Programme` record.
  - **Active Programme Transition (Transaction)**: If `is_active` is true, deactivates all other user programmes (`is_active = false`), closes their open `ProgrammeActivityLog` entries (sets `end_time = now`), and writes a new `ProgrammeActivityLog` for this programme.
- **Request Example**:
  ```json
  {
    "id": "a6f231e8-782b-4720-9118-29219b16accd",
    "name": "Arnold Split",
    "description": "High frequency chest/back, shoulders/arms split",
    "is_active": true
  }
  ```
- **Response Shape**: Full `Programme` DB model object.
- **Success Response (201 Created)**:
  ```json
  {
    "id": "a6f231e8-782b-4720-9118-29219b16accd",
    "name": "Arnold Split",
    "description": "High frequency chest/back, shoulders/arms split",
    "user_id": "usr_123456",
    "is_active": true
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Programme name is required"}`
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `403 Forbidden`: `{"error": "Forbidden"}`
  - `500 Internal Server Error`: `{"error": "Failed to create programme"}`
- **Related Frontend Usage**: Called by `createProgramme` in [mutations.ts](file:///mnt/New_Volume/project/workout/app/features/programmes/api/mutations.ts#L15) via the `useCreateProgramme` hook.
- **Code Reference**: [app/api/programmes/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/route.ts#L5)

### 4.3. Fetch Programme Details
- **Endpoint**: `/api/programmes/[programmeId]`
- **Method**: `GET`
- **Purpose**: Fetches details of a specific programme, its workouts, and a preview of their active exercises.
- **Auth Requirement**: Authenticated (requires backend `workout_auth` cookie)
- **Request Params**:
  - **Path parameters**:
    - `programmeId` (string, required): The ID of the programme.
- **Response Shape**:
  ```typescript
  {
    id: string;
    name: string;
    is_active: boolean;
    workouts: Array<{
      id: string;
      name: string;
      order_index: number;
      exercisesWithMetadata: Array<{
        exercise: { name: string };
      }>;
      _count: {
        exercisesWithMetadata: number; // Active count
      };
    }>;
  }
  ```
- **Success Response Example (200 OK)**:
  ```json
  {
    "id": "prog_123",
    "name": "Arnold Split",
    "is_active": true,
    "workouts": [
      {
        "id": "wk_1",
        "name": "Chest & Back",
        "order_index": 0,
        "exercisesWithMetadata": [
          { "exercise": { "name": "Barbell Row" } },
          { "exercise": { "name": "Incline Dumbbell Bench Press" } }
        ],
        "_count": { "exercisesWithMetadata": 2 }
      }
    ]
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `404 Not Found`: `{"error": "Programme not found"}`
  - `500 Internal Server Error`: `{"error": "Internal Server Error"}`
- **Implementation Details**:
  - Optimizes joins using Prisma's `relationLoadStrategy: "join"`.
  - Excludes soft-deleted exercise templates (`is_hidden: false`).
  - Limits exercise previews inside workouts to the first 3 (`take: 3`).
- **Related Frontend Usage**: Hook `useProgramme` in [use-programme.ts](file:///mnt/New_Volume/project/workout/app/features/programmes/api/query-hooks/use-programme.ts)
- **Code Reference**: [app/api/programmes/[programmeId]/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/%5BprogrammeId%5D/route.ts#L20)

### 4.4. Update Programme Activation Status
- **Endpoint**: `/api/programmes/[programmeId]`
- **Method**: `PATCH`
- **Purpose**: Activates or deactivates a programme.
- **Auth Requirement**: Authenticated (requires backend `workout_auth` cookie)
- **Request Params**:
  - **Path parameters**:
    - `programmeId` (string, required): The ID of the programme.
  - **Body fields**:
    - `is_active` (boolean, required): The active toggle state.
- **Side Effects**:
  - **Database Writes**: Updates `is_active` on the `Programme` record.
  - **Activity Log Transactions**:
    - If activating (`is_active = true`): Deactivates other user programmes (`is_active = false`), closes their open `ProgrammeActivityLog` entries (`end_time = now`), and starts a new activity log entry for the targeted programme.
    - If deactivating (`is_active = false`): Closes the active `ProgrammeActivityLog` entry.
- **Request Example**:
  ```json
  { "is_active": true }
  ```
- **Response Shape**: Full updated `Programme` object.
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Invalid is_active status"}`
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `404 Not Found`: `{"error": "Programme not found"}`
  - `500 Internal Server Error`: `{"error": "Internal Server Error"}`
- **Related Frontend Usage**: Hook `useUpdateProgramme` in [use-update-programme.ts](file:///mnt/New_Volume/project/workout/app/features/programmes/api/mutation-hooks/use-update-programme.ts) calling helper `updateProgramme` in [mutations.ts](file:///mnt/New_Volume/project/workout/app/features/programmes/api/mutations.ts#L44).
- **Code Reference**: [app/api/programmes/[programmeId]/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/%5BprogrammeId%5D/route.ts#L83)

### 4.5. Add Workout to Programme
- **Endpoint**: `/api/programmes/[programmeId]/workouts`
- **Method**: `POST`
- **Purpose**: Creates and links a new workout template within a programme.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Path parameters**:
    - `programmeId` (string, required): Parent programme ID.
  - **Body fields**:
    - `id` (string, optional): Client-generated UUID for offline idempotency.
    - `name` (string, required): Non-empty workout title.
    - `description` (string, optional): Description of the workout.
- **Validation Rules**:
  - Enforces `name` validation.
  - Verifies parent programme belongs to the requesting user.
- **Idempotency**:
  - If a workout with the given `id` already exists, validates ownership (via programme user relation). Returns existing workout (`200 OK`) if valid, or `403 Forbidden`.
- **Side Effects**:
  - **Database Writes**: Creates a new `Workout` record. Automatically calculates the `order_index` sequence as equivalent to the count of existing workouts in the programme.
- **Response Shape**: Full created `Workout` object.
- **Success Response Example (201 Created)**:
  ```json
  {
    "id": "wk_arnold_shoulders",
    "name": "Shoulders & Arms",
    "description": "Arnold split overhead press and isolation work",
    "programme_id": "a6f231e8-782b-4720-9118-29219b16accd",
    "order_index": 2
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Workout name is required"}`
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `403 Forbidden`: `{"error": "Forbidden"}`
  - `404 Not Found`: `{"error": "Programme not found"}`
  - `500 Internal Server Error`: `{"error": "Failed to create workout"}`
- **Related Frontend Usage**: Called by `createWorkout` in [mutations.ts](file:///mnt/New_Volume/project/workout/app/features/workouts/api/mutations.ts#L7) via the `useCreateWorkout` hook.
- **Code Reference**: [app/api/programmes/[programmeId]/workouts/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/%5BprogrammeId%5D/workouts/route.ts)

### 4.6. Fetch Workout Details
- **Endpoint**: `/api/programmes/[programmeId]/workouts/[workoutId]/details`
- **Method**: `GET`
- **Purpose**: Fetches the full template for a workout, today's active session, and logs from the user's last logged session (to facilitate side-by-side progress comparisons).
- **Auth Requirement**: Authenticated (requires backend `workout_auth` cookie)
- **Request Params**:
  - **Path parameters**:
    - `programmeId` (string, required): Parent programme ID.
    - `workoutId` (string, required): Workout ID.
- **Response Shape**:
  ```typescript
  {
    workout: {
      id: string;
      name: string;
      exercisesWithMetadata: Array<{
        id: string;
        exercise_id: string;
        sets_min: number;
        sets_max: number;
        reps_min: number;
        reps_max: number;
        rest_min: number;
        rest_max: number;
        tempo: string;
        exercise: {
          id: string;
          name: string;
          muscle_group: string;
        };
      }>;
    };
    session: {
      id: string;
      sessionExerciseLogs: Array<{
        id: string;
        exercise_with_metadata_id: string | null;
        exerciseLog: {
          id: string;
          exerciseId: string | null;
          weight: number | null;
          reps: number;
          rpe: number | null;
          set_order_index: number;
          user_id: string;
          date: string;
          pr_type: string | null;
        };
      }>;
    } | null;
    previousLogsByExercise: Record<
      string, // exercise_id key
      Array<{
        id: string;
        weight: number | null;
        reps: number;
        rpe: number | null;
        set_order_index: number;
      }>
    >;
  }
  ```
- **Success Response Example (200 OK)**:
  ```json
  {
    "workout": {
      "id": "wk_push",
      "name": "Push Day",
      "exercisesWithMetadata": [
        {
          "id": "ewm_dbpress",
          "exercise_id": "ex_dbpress",
          "sets_min": 4,
          "sets_max": 4,
          "reps_min": 8,
          "reps_max": 10,
          "rest_min": 90,
          "rest_max": 120,
          "tempo": "2-0-1-0",
          "exercise": {
            "id": "ex_dbpress",
            "name": "Dumbbell Bench Press",
            "muscle_group": "Chest"
          }
        }
      ]
    },
    "session": null,
    "previousLogsByExercise": {
      "ex_dbpress": [
        {
          "id": "log_9911",
          "weight": 36,
          "reps": 10,
          "rpe": 9,
          "set_order_index": 0
        }
      ]
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `404 Not Found`: `{"error": "Workout not found"}`
  - `500 Internal Server Error`: `{"error": "Internal Server Error"}`
- **Important Implementation Patterns**:
  - Performs a single unified query leveraging Prisma joins.
  - Resolves "previous logs" by locating the absolute latest session containing logs for that specific exercise, and then fetching all sets logged in that same session.
  - Excludes soft-deleted exercise links (`is_hidden: false`).
- **Related Frontend Usage**: Hook `useWorkoutDetails` in [use-workout-details.ts](file:///mnt/New_Volume/project/workout/app/features/workouts/api/query-hooks/use-workout-details.ts)
- **Code Reference**: [app/api/programmes/[programmeId]/workouts/[workoutId]/details/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/%5BprogrammeId%5D/workouts/%5BworkoutId%5D/details/route.ts)

### 4.7. Link Exercise to Workout Template
- **Endpoint**: `/api/programmes/[programmeId]/workouts/[workoutId]/exercises`
- **Method**: `POST`
- **Purpose**: Creates an association (metadata prescription) linking an exercise to a workout template.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Path parameters**:
    - `programmeId` (string, required): Parent programme ID.
    - `workoutId` (string, required): Target workout template.
  - **Body fields**:
    - `id` (string, optional): Client-generated UUID for offline idempotency.
    - `exercise_id` (string, required): Associated exercise ID.
    - `sets_min` / `sets_max` (number, required): Rep ranges.
    - `reps_min` / `reps_max` (number, required): Set ranges.
    - `rest_min` / `rest_max` (number, required): Rest seconds.
    - `tempo` (string, required): Eccentric-pause-concentric-pause string (e.g., `"3-0-1-0"`).
- **Validation Rules**:
  - Checks if `exercise_id` is provided and exists in the user's database scope.
  - Automatically queries existing exercises in the workout template to set `order_index = max(order_index) + 1` (to prevent duplicates if some were soft-deleted).
- **Idempotency**:
  - Resolves duplicate requests containing the same client-generated `id`. Returns existing metadata if validly owned, or `403 Forbidden`.
- **Side Effects**:
  - **Database Writes**: Inserts a new `ExerciseWithMetadata` record.
- **Response Shape**: Full `ExerciseWithMetadata` object.
- **Success Response (201 Created)**:
  ```json
  {
    "id": "ewm_dbpress_new",
    "exercise_id": "ex_dbpress",
    "workout_id": "wk_push",
    "sets_min": 3,
    "sets_max": 4,
    "reps_min": 8,
    "reps_max": 12,
    "rest_min": 90,
    "rest_max": 120,
    "tempo": "3-0-1-0",
    "order_index": 2,
    "is_hidden": false
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Exercise is required"}`
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `403 Forbidden`: `{"error": "Forbidden"}`
  - `404 Not Found`: `{"error": "Exercise not found"}` or `{"error": "Workout not found"}`
  - `500 Internal Server Error`: `{"error": "Failed to link exercise"}`
- **Related Frontend Usage**: Called by `addExerciseToWorkout` in [mutations.ts](file:///mnt/New_Volume/project/workout/app/features/exercises/api/mutations.ts#L54) via the `useAddExerciseToWorkout` hook.
- **Code Reference**: [app/api/programmes/[programmeId]/workouts/[workoutId]/exercises/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/%5BprogrammeId%5D/workouts/%5BworkoutId%5D/exercises/route.ts)

### 4.8. Update Linked Exercise Parameters
- **Endpoint**: `/api/programmes/[programmeId]/workouts/[workoutId]/exercises/[metadataId]`
- **Method**: `PATCH`
- **Purpose**: Modifies the prescriptions (reps, sets, rest, tempo) of an exercise associated with a workout template.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Path parameters**:
    - `programmeId` (string, required): Parent programme ID.
    - `workoutId` (string, required): Workout ID.
    - `metadataId` (string, required): Specific association ID.
  - **Body fields (all optional)**:
    - `exercise_id` (string), `sets_min` (number), `sets_max` (number), `reps_min` (number), `reps_max` (number), `rest_min` (number), `rest_max` (number), `tempo` (string).
- **Core Business Logic (CRITICAL DATA INTEGRITY PATTERN)**:
  - If a user has **already completed or started a session** (a `WorkoutSession` exists in the database for that `workoutId`):
    - *Why?* Updating the metadata directly would alter historical workout structures and corrupt previous session summaries.
    - *How?* The API executes a **Prisma Transaction** that performs a soft-delete on the old metadata record (`is_hidden: true`), and writes a **brand new** `ExerciseWithMetadata` record containing the updated specifications.
  - If **no workout session exists** for this workout template:
    - *How?* Performs a simple, safe in-place update on the existing `ExerciseWithMetadata` record.
- **Response Shape**: The created or updated `ExerciseWithMetadata` record.
- **Success Response Example (200 OK)**:
  ```json
  {
    "id": "ewm_dbpress_new_hash",
    "exercise_id": "ex_dbpress",
    "workout_id": "wk_push",
    "sets_min": 4,
    "sets_max": 4,
    "reps_min": 10,
    "reps_max": 12,
    "rest_min": 120,
    "rest_max": 120,
    "tempo": "3-0-1-0",
    "order_index": 2,
    "is_hidden": false
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `404 Not Found`: `{"error": "Exercise metadata not found"}`
  - `500 Internal Server Error`: `{"error": "Failed to edit exercise metadata"}`
- **Related Frontend Usage**: Called by `editExerciseMetadata` in [mutations.ts](file:///mnt/New_Volume/project/workout/app/features/exercises/api/mutations.ts#L92) via the `useEditExerciseMetadata` hook.
- **Code Reference**: [app/api/programmes/[programmeId]/workouts/[workoutId]/exercises/[metadataId]/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/%5BprogrammeId%5D/workouts/%5BworkoutId%5D/exercises/%5BmetadataId%5D/route.ts)

### 4.9. List Workouts
- **Endpoint**: `/api/workouts`
- **Method**: `GET`
- **Purpose**: Fetches the list of all workouts owned by the user. Supports filtering for workouts associated specifically with the active training programme.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Query parameters**:
    - `active` (string, optional): If set to `"true"`, filters out workouts that do not belong to the user's currently active programme.
- **Response Shape**:
  ```typescript
  Array<{
    id: string;
    name: string;
    programme: {
      name: string;
    };
  }>
  ```
- **Success Response Example (200 OK)**:
  ```json
  [
    {
      "id": "wk_push",
      "name": "Push Day",
      "programme": {
        "name": "Push Pull Legs (PPL)"
      }
    }
  ]
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `500 Internal Server Error`: `{"error": "Failed to fetch workouts"}`
- **Side Effects**: None
- **Related Frontend Usage**: Hook `useWorkouts` in [use-workouts.ts](file:///mnt/New_Volume/project/workout/app/features/dashboard/api/query-hooks/use-workouts.ts)
- **Code Reference**: [app/api/workouts/route.ts](file:///mnt/New_Volume/project/workout/app/api/workouts/route.ts)

---

## 5. Workout Logging Domain

### 5.1. Log Set Performance
- **Endpoint**: `/api/log/set`
- **Method**: `POST`
- **Purpose**: Logs a single completed training set. Supports mapping to planned workouts and ad-hoc sets. Generates workout sessions automatically on the fly.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Body fields**:
    - `id` (string, optional): Client-generated UUID to provide offline-first idempotency support.
    - `workoutId` (string, optional): Target workout template ID.
    - `exerciseWithMetadataId` (string, optional): Links to the workout template prescription metadata.
    - `exerciseId` (string, optional): Associated exercise ID.
    - `setOrderIndex` (number, required): Index position of the set in the exercise stack.
    - `weight` (string, required): Float representation of weight lifted.
    - `reps` (string, required): Reps completed.
    - `rpe` (string, optional): Rate of Perceived Exertion (1 to 10 scale).
    - `date` (string, optional): ISO string to log to a specific historical date.
- **Validation Rules**:
  - Enforces `setOrderIndex` and `reps` check.
  - Verifies target exercise is valid and scoped to the user or global libraries.
- **Idempotency Flow**:
  - A client-generated `id` is required for offline first synchronization queues.
  - If a log matching `id` exists in the database:
    - Ownership is verified. If invalid, returns `403 Forbidden`.
    - If valid, skips creation entirely and returns `200 OK` with the record's existing `pr_type` metadata. This prevents duplicate sets if the client retries an API call upon resuming network connectivity.
- **Session Auto-Creation**:
  - The API determines the targeted calendar date.
  - If an active `WorkoutSession` exists for the user on that local date, the logged set is appended to it.
  - If no session exists, the API auto-generates a new `WorkoutSession` for that date, ensuring logs remain structured by training calendar days.
- **PR Detection Mechanism**:
  - When the log is successfully saved, the database queries all historical completed sets for this exercise, excluding the current log.
  - It extracts the max historical weight and max historical reps.
  - The `detectPR` utility evaluates performance:
    - `REP_PR`: User completed more reps with their previous maximum weight.
    - `ESTIMATED_1RM_PR`: User achieved a higher calculated 1-Rep Max.
    - `WEIGHT_PR`: User completed at least 1 rep at a weight higher than any historic lifts.
  - If a PR is detected, the API updates the log in the database with the resulting `pr_type`.
- **Response Shape**: Full `ExerciseLog` details containing `pr_type` status flags.
- **Success Response Example (210/200/201 Created)**:
  ```json
  {
    "id": "log_set_778899",
    "user_id": "usr_123456",
    "exerciseId": "ex_squat",
    "set_order_index": 0,
    "weight": 140,
    "reps": 5,
    "rpe": 9,
    "date": "2026-05-31T12:00:00.000Z",
    "pr_type": "WEIGHT_PR",
    "pr": "WEIGHT_PR"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Missing required fields"}`
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `403 Forbidden`: `{"error": "Forbidden"}`
  - `404 Not Found`: `{"error": "Exercise not found"}`
  - `500 Internal Server Error`: `{"error": "Failed to log set"}`
- **Related Frontend Usage**: Called by client mutation `logSet` in [mutations.ts](file:///mnt/New_Volume/project/workout/app/features/logging/api/mutations.ts#L25) via the `useLogSet` hook.
- **Code Reference**: [app/api/log/set/route.ts](file:///mnt/New_Volume/project/workout/app/api/log/set/route.ts#L14)

### 5.2. Delete Logged Set
- **Endpoint**: `/api/log/set`
- **Method**: `DELETE`
- **Purpose**: Deletes a completed set.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Query parameters**:
    - `setId` (string, required): ID of the set log to delete.
- **Side Effects (DATA INTEGRITY PATTERN)**:
  - **Database Writes (Prisma Transaction)**: Deletes the `ExerciseLog` record.
  - **Session Cleanup**: The API queries the session linked to this deleted log. If no sets remain logged within that session, the API deletes the parent `WorkoutSession` row.
- **Response Shape**:
  ```typescript
  {
    message: string;
    sessionPurged: boolean;
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Set deleted and empty session purged",
    "sessionPurged": true
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Set ID is required"}`
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `403 Forbidden`: `{"error": "Unauthorized"}` (ownership violation)
  - `404 Not Found`: `{"error": "Set not found"}`
  - `500 Internal Server Error`: `{"error": "Failed to delete set"}`
- **Related Frontend Usage**: Called by client mutation `deleteLogSet` in [mutations.ts](file:///mnt/New_Volume/project/workout/app/features/logging/api/mutations.ts#L53) via the `useDeleteLogSet` hook.
- **Code Reference**: [app/api/log/set/route.ts](file:///mnt/New_Volume/project/workout/app/api/log/set/route.ts#L200)

### 5.3. Update Logged Set Data
- **Endpoint**: `/api/log/set`
- **Method**: `PATCH`
- **Purpose**: Modifies the performance records of an already logged set.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Body fields**:
    - `setId` (string, required): The ID of the set log to update.
    - `weight` (string, required): Float representation of weight.
    - `reps` (string, required): Number of reps.
    - `rpe` (string, optional): RPE value.
- **Side Effects**:
  - **Database Writes**: Updates details in the target `ExerciseLog` record.
- **Response Shape**: Full updated `ExerciseLog` object.
- **Success Response (200 OK)**:
  ```json
  {
    "id": "log_set_778899",
    "user_id": "usr_123456",
    "exerciseId": "ex_squat",
    "set_order_index": 0,
    "weight": 142.5,
    "reps": 5,
    "rpe": 9.5,
    "date": "2026-05-31T12:00:00.000Z",
    "pr_type": "WEIGHT_PR"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Missing required fields"}`
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `403 Forbidden`: `{"error": "Unauthorized"}` (ownership check failed)
  - `404 Not Found`: `{"error": "Set not found"}`
  - `500 Internal Server Error`: `{"error": "Failed to update set"}`
- **Related Frontend Usage**: Called by `updateLogSet` in [mutations.ts](file:///mnt/New_Volume/project/workout/app/features/logging/api/mutations.ts#L77) via the `useUpdateLogSet` hook.
- **Code Reference**: [app/api/log/set/route.ts](file:///mnt/New_Volume/project/workout/app/api/log/set/route.ts#L270)

### 5.4. List Logged Sessions
- **Endpoint**: `/api/log/sessions`
- **Method**: `GET`
- **Purpose**: Fetches completed workout sessions containing completed set logs.
- **Auth Requirement**: Authenticated (requires backend `workout_auth` cookie)
- **Request Params**:
  - **Query parameters**:
    - `grouped` (string, optional): If set to `"true"`, groups completed sessions by date (e.g. `"Today"`, `"Yesterday"`, or formatted string like `"May 31, 2026"`).
    - `limit` (string, optional): Number of sessions to load. Defaults to `10`.
    - `from` (string, optional): ISO date limit boundary to load sessions completed *before* this date (pagination cursor).
- **Response Shape**:
  ```typescript
  {
    data: Array<SessionWithLogs> | Array<{ label: string; sessions: SessionWithLogs[] }>;
    pagination: {
      from: string | null; // ISO Date of first session in result
      to: string | null;   // ISO Date of last session in result
      hasMore: boolean;    // If results.length === limit
    };
  }
  ```
- **Success Response Example (200 OK - Grouped)**:
  ```json
  {
    "data": [
      {
        "label": "Today",
        "sessions": [
          {
            "id": "sess_1234",
            "date": "2026-05-31T12:00:00.000Z",
            "start_time": "2026-05-31T11:45:00.000Z",
            "end_time": "2026-05-31T12:30:00.000Z",
            "workout": {
              "name": "Push Day",
              "programme": {
                "name": "Push Pull Legs (PPL)"
              }
            },
            "sessionExerciseLogs": [
              {
                "id": "sel_log_set_778899",
                "exercise_with_metadata_id": "ewm_dbpress",
                "exerciseLog": {
                  "id": "log_set_778899",
                  "weight": 36,
                  "reps": 10,
                  "rpe": 9,
                  "set_order_index": 0,
                  "pr_type": null,
                  "user_id": "usr_123456",
                  "date": "2026-05-31T12:00:00.000Z",
                  "exerciseId": "ex_dbpress",
                  "exercise": {
                    "id": "ex_dbpress",
                    "name": "Dumbbell Bench Press",
                    "muscle_group": "Chest"
                  }
                },
                "exerciseWithMetadata": {
                  "exercise": {
                    "id": "ex_dbpress",
                    "name": "Dumbbell Bench Press",
                    "muscle_group": "Chest"
                  }
                }
              }
            ]
          }
        ]
      }
    ],
    "pagination": {
      "from": "2026-05-31T12:00:00.000Z",
      "to": "2026-05-31T12:00:00.000Z",
      "hasMore": false
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `500 Internal Server Error`: `{"error": "Failed to fetch sessions"}`
- **Side Effects**: None
- **Related Frontend Usage**: Hook `useSessions` in [use-sessions.ts](file:///mnt/New_Volume/project/workout/app/features/logging/api/query-hooks/use-sessions.ts)
- **Code Reference**: [app/api/log/sessions/route.ts](file:///mnt/New_Volume/project/workout/app/api/log/sessions/route.ts)

### 5.5. Finish Workout Session
- **Endpoint**: `/api/workout-sessions/[sessionId]/finish`
- **Method**: `PATCH`
- **Purpose**: Formalizes the completion of an active workout session.
- **Auth Requirement**: Authenticated (requires backend `workout_auth` cookie)
- **Request Params**:
  - **Path parameters**:
    - `sessionId` (string, required): Active session ID.
- **Core Business Logic (DATA INTEGRITY PATTERN)**:
  - If a user triggers the completion of a session but **has logged zero sets** inside it:
    - *Why?* Prevents cluttering database tables and dashboard feeds with empty sessions.
    - *How?* The API discards the session by running a delete command directly against the `WorkoutSession` record.
    - *Result*: Returns `200 OK` with `{ discarded: true }`.
  - If sets **were logged**:
    - Updates `end_time` to the current system timestamp.
    - Returns `200 OK` with `{ discarded: false }` along with updated session details.
- **Response Shape**:
  ```typescript
  {
    id?: string;
    start_time?: string;
    end_time?: string;
    notes?: string | null;
    workout_id?: string | null;
    user_id?: string;
    date?: string;
    message?: string;
    discarded: boolean;
  }
  ```
- **Success Response Example (200 OK - Finished)**:
  ```json
  {
    "id": "sess_1234",
    "start_time": "2026-05-31T11:45:00.000Z",
    "end_time": "2026-05-31T12:30:00.000Z",
    "notes": null,
    "workout_id": "wk_push",
    "user_id": "usr_123456",
    "date": "2026-05-31T12:00:00.000Z",
    "discarded": false
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `404 Not Found`: `{"error": "Session not found"}`
  - `500 Internal Server Error`: `{"error": "Internal Server Error"}`
- **Related Frontend Usage**: Hook `useFinishWorkout` in [use-finish-workout.ts](file:///mnt/New_Volume/project/workout/app/features/workouts/api/mutation-hooks/use-finish-workout.ts)
- **Code Reference**: [app/api/workout-sessions/[sessionId]/finish/route.ts](file:///mnt/New_Volume/project/workout/app/api/workout-sessions/%5BsessionId%5D/finish/route.ts)

---

## 6. Analytics Engine Domain

### 6.1. Custom Analytical Query API
- **Endpoint**: `/api/analytics/query`
- **Method**: `POST`
- **Purpose**: Provides an ad-hoc report builder against the consolidated database view `exercise_analytics_view`. Computes volume aggregations, set counts, and averages grouped dynamically by session dates, muscle groups, or exercises.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Body fields (validated via Zod)**:
    - `metrics` (Array, required, min 1 item): Columns to aggregate.
      - `{ field: "weight" | "reps" | "volume", aggregation: "sum" | "avg" | "min" | "max" | "count", alias: string }`
    - `dimensions` (Array, optional): Columns to group by. Supported values:
      - `"exercise_name"`, `"muscle_group"`, `"workout_name"`, `"workout_id"`, `"programme_name"`, `"programme_id"`, `"session_date"`, `"week_start"`.
    - `filters` (Array, optional): WHERE clauses.
      - `{ field: string, operator: "=" | "!=" | ">" | ">=" | "<" | "<=" | "in" | "between", value: string | number | boolean | Array<string | number> }`
    - `order_by` (Array, optional): Sorting specifications.
      - `{ field: string, direction: "asc" | "desc" }`
    - `limit` (number, optional): Defaults to `50`, maximum `1000`.
- **Validation Rules**:
  - Strictly parsed via `AnalyticsQueryPayloadSchema` Zod model to ensure SQL safety (prevent injection on dynamic table aliases and filters).
- **Request Example**:
  ```json
  {
    "metrics": [
      { "field": "volume", "aggregation": "sum", "alias": "total_volume" },
      { "field": "weight", "aggregation": "max", "alias": "max_weight" }
    ],
    "dimensions": ["muscle_group"],
    "filters": [
      { "field": "session_date", "operator": ">=", "value": "2026-05-01" }
    ],
    "order_by": [{ "field": "total_volume", "direction": "desc" }],
    "limit": 5
  }
  ```
- **Response Shape**:
  ```typescript
  {
    meta: {
      dimensions: string[];
      metrics: string[];
    };
    data: Array<Record<string, any>>;
  }
  ```
- **Success Response Example (200 OK)**:
  ```json
  {
    "meta": {
      "dimensions": ["muscle_group"],
      "metrics": ["total_volume", "max_weight"]
    },
    "data": [
      {
        "muscle_group": "Chest",
        "total_volume": 12450.5,
        "max_weight": 110
      },
      {
        "muscle_group": "Legs",
        "total_volume": 9800,
        "max_weight": 160
      }
    ]
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Invalid payload", "details": {...}}` (Zod formatted errors)
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `500 Internal Server Error`: `{"error": "Failed to query analytics"}`
- **Important Implementation Patterns**:
  - Sanitizes dynamic SQL parameters using Prisma's `Prisma.raw` and `Prisma.sql` values to preserve user isolation (`user_id = userId`).
  - Serializes `BigInt` columns dynamically returned from raw query engine to prevent Next.js JSON stringification crashes.
- **Related Frontend Usage**: Called by custom dashboard hooks:
  - `useMuscleHistoricalMetrics` in [use-muscle-historical-data.ts](file:///mnt/New_Volume/project/workout/app/features/dashboard/api/query-hooks/use-muscle-historical-data.ts)
  - `useMusclePerformanceData` in [use-muscle-performance-data.ts](file:///mnt/New_Volume/project/workout/app/features/dashboard/api/query-hooks/use-muscle-performance-data.ts)
- **Code Reference**: [app/api/analytics/query/route.ts](file:///mnt/New_Volume/project/workout/app/api/analytics/query/route.ts)

### 6.2. Calendar Activity Heatmap
- **Endpoint**: `/api/analytics/activity-heatmap`
- **Method**: `GET`
- **Purpose**: Computes count of unique exercises completed per calendar date over the last 365 days.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**: None
- **Response Shape**:
  ```typescript
  {
    data: Array<{
      date: string; // YYYY-MM-DD
      count: number;
    }>;
  }
  ```
- **Success Response Example (200 OK)**:
  ```json
  {
    "data": [
      { "date": "2026-05-28", "count": 4 },
      { "date": "2026-05-30", "count": 6 }
    ]
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `500 Internal Server Error`: `{"error": "Failed to fetch activity data"}`
- **Related Frontend Usage**: Hook `useHeatmapData` in [useHeatmapData.ts](file:///mnt/New_Volume/project/workout/app/features/analytics/hooks/useHeatmapData.ts)
- **Code Reference**: [app/api/analytics/activity-heatmap/route.ts](file:///mnt/New_Volume/project/workout/app/api/analytics/activity-heatmap/route.ts)

### 6.3. Fatigue ACWR Analytics
- **Endpoint**: `/api/analytics/fatigue`
- **Method**: `GET`
- **Purpose**: Calculates the Acute-to-Chronic Workload Ratio (ACWR) time series over a specific range to determine athlete fatigue, training build stress, and injury risk levels.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Query parameters**:
    - `endDate` (string, optional): ISO date representing the end of the analysis period. Defaults to today.
    - `days` (string, optional): Number of days of time series history to return. Defaults to `30`.
- **ACWR Calculation Details**:
  - **Acute Workload**: Sum of completed sets (excluding Cardio) over a rolling 7-day window.
  - **Chronic Workload**: Average of completed sets (excluding Cardio) over a rolling 28-day window.
  - **Chronic Offset**: To compute acute and chronic load values starting precisely on `targetStartDate`, the API queries an additional **27 days** prior to build the initial chronic average context.
  - **Calibrating State**: If the date of the user's first ever exercise log is after the chronic calculation date window, those periods are marked as "Calibrating" as there is not enough historical baseline to build a chronic workload average.
- **Response Shape**:
  ```typescript
  {
    timeSeries: Array<{
      date: string; // YYYY-MM-DD
      acuteLoad: number;
      chronicLoad: number;
      acwr: number | null; // Null if Calibrating
      status: "Calibrating" | "Optimal" | "Detraining" | "Overreaching" | "Danger";
    }>;
    hasMoreHistory: boolean;
  }
  ```
- **Success Response Example (200 OK)**:
  ```json
  {
    "timeSeries": [
      {
        "date": "2026-05-30",
        "acuteLoad": 18,
        "chronicLoad": 16.5,
        "acwr": 1.09,
        "status": "Optimal"
      }
    ],
    "hasMoreHistory": true
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `500 Internal Server Error`: `{"error": "Failed to calculate fatigue analytics"}`
- **Related Frontend Usage**: Hook `useFatigueData` in [use-fatigue-data.ts](file:///mnt/New_Volume/project/workout/app/features/dashboard/api/query-hooks/use-fatigue-data.ts)
- **Code Reference**: [app/api/analytics/fatigue/route.ts](file:///mnt/New_Volume/project/workout/app/api/analytics/fatigue/route.ts)

### 6.4. Session Volume & Overload Alerts
- **Endpoint**: `/api/analytics/session-volume`
- **Method**: `GET`
- **Purpose**: Computes total weight volume per completed session for a specific workout template, calculating percentage changes between sessions to generate progressive overload feedback.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Query parameters**:
    - `workoutId` (string, required): Workout ID template.
    - `limit` (string, optional): Number of historical sessions to return. Defaults to `15`.
- **Core Business Logic**:
  - Queries `exercise_analytics_view` to locate all completed sets of this workout template (filtering out muscle group "Cardio").
  - Groups sets by `workout_session_id` and sums the total volume (`weight * reps`).
  - Ignores bodyweight-only exercises (volume of 0) to prevent mathematical skews.
  - Traverses the chronological sessions to compute percent volume change relative to the previous session:
    - **optimal**: Volume increased by `0%` to `5%` (progressive overload zone).
    - **warning**: Volume increased by **greater than 5%** (higher risk of injury/overreaching).
    - **deload**: Volume decreased.
    - **neutral**: First session in history or no change.
- **Response Shape**:
  ```typescript
  Array<{
    id: string; // Session ID
    date: string; // ISO Date String
    volume: number;
    deltaPercentage: number;
    status: "optimal" | "warning" | "deload" | "neutral";
  }>
  ```
- **Success Response Example (200 OK)**:
  ```json
  [
    {
      "id": "sess_0990",
      "date": "2026-05-24T18:00:00.000Z",
      "volume": 3200,
      "deltaPercentage": 0,
      "status": "neutral"
    },
    {
      "id": "sess_1234",
      "date": "2026-05-31T12:00:00.000Z",
      "volume": 3320,
      "deltaPercentage": 3.7,
      "status": "optimal"
    }
  ]
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Missing workoutId parameter"}`
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `500 Internal Server Error`: `{"error": "Failed to calculate session volume"}`
- **Related Frontend Usage**: Hook `useSessionVolume` in [use-session-volume.ts](file:///mnt/New_Volume/project/workout/app/features/dashboard/api/query-hooks/use-session-volume.ts)
- **Code Reference**: [app/api/analytics/session-volume/route.ts](file:///mnt/New_Volume/project/workout/app/api/analytics/session-volume/route.ts)

### 6.5. Legacy Chronological Volume API
- **Endpoint**: `/api/log/volume`
- **Method**: `GET`
- **Purpose**: Returns chronological raw training volumes grouped by date, workout, and muscle group.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**: None
- **Response Shape**:
  ```typescript
  Array<{
    date: string; // YYYY-MM-DD
    workoutId: string;
    workoutName: string;
    muscleGroup: string;
    volume: number;
    exercises: Array<{
      name: string;
      volume: number;
    }>;
  }>
  ```
- **Success Response Example (200 OK)**:
  ```json
  [
    {
      "date": "2026-05-31",
      "workoutId": "wk_push",
      "workoutName": "Push Day",
      "muscleGroup": "Chest",
      "volume": 360,
      "exercises": [
        { "name": "Dumbbell Bench Press", "volume": 360 }
      ]
    }
  ]
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `500 Internal Server Error`: `{"error": "Failed to fetch session volume"}`
- **Notes**: This endpoint has integration test coverage (`tests/integration/log-sessions-volume.integration.test.ts`) but is currently not requested directly in the active frontend application routes.
- **Code Reference**: [app/api/log/volume/route.ts](file:///mnt/New_Volume/project/workout/app/api/log/volume/route.ts)

---

## 7. Product Feedback Domain

### 7.1. Get User Feedback History
- **Endpoint**: `/api/feedback`
- **Method**: `GET`
- **Purpose**: Retrieves all suggestions and bug reports previously submitted by the authenticated user.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**: None
- **Response Shape**:
  ```typescript
  Array<{
    id: string;
    description: string;
    status: "Submitted" | "UnderReview" | "Planned" | "Completed" | "Rejected";
    created_at: Date;
    updated_at: Date;
  }>
  ```
- **Success Response Example (200 OK)**:
  ```json
  [
    {
      "id": "fb_123",
      "description": "Please add a rest timer notification system.",
      "status": "UnderReview",
      "created_at": "2026-05-20T10:00:00.000Z",
      "updated_at": "2026-05-21T09:00:00.000Z"
    }
  ]
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `500 Internal Server Error`: `{"error": "Failed to fetch feedback"}`
- **Related Frontend Usage**: Hook `useFeedbackHistory` in [use-feedback-history.ts](file:///mnt/New_Volume/project/workout/app/features/settings/api/query-hooks/use-feedback-history.ts)
- **Code Reference**: [app/api/feedback/route.ts](file:///mnt/New_Volume/project/workout/app/api/feedback/route.ts#L19)

### 7.2. Submit Feedback
- **Endpoint**: `/api/feedback`
- **Method**: `POST`
- **Purpose**: Submits a new feedback or feature suggestion.
- **Auth Requirement**: Authenticated (Requires `getUserId()`)
- **Request Params**:
  - **Body fields (validated via Zod)**:
    - `description` (string, required): Length must be between 5 and 1000 characters.
- **Side Effects**:
  - **Database Writes**: Inserts a new suggestion row into the `feedback` table.
- **Request Example**:
  ```json
  {
    "description": "It would be great to see bar velocity tracking."
  }
  ```
- **Response Shape**:
  ```typescript
  {
    id: string;
    status: "Submitted" | "UnderReview" | "Planned" | "Completed" | "Rejected";
    created_at: Date;
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "id": "fb_124",
    "status": "Submitted",
    "created_at": "2026-05-31T12:25:00.000Z"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"error": "Invalid payload", "details": {...}}` (Zod validation failed)
  - `401 Unauthorized`: `{"error": "Unauthorized"}`
  - `500 Internal Server Error`: `{"error": "Failed to submit feedback"}`
- **Related Frontend Usage**: Called by `submitFeedback` in [mutations.ts](file:///mnt/New_Volume/project/workout/app/features/settings/api/mutations.ts#L14) via the `useSubmitFeedback` hook.
- **Code Reference**: [app/api/feedback/route.ts](file:///mnt/New_Volume/project/workout/app/api/feedback/route.ts#L54)

---

## API Inventory Summary

| Path | Method | Auth Required | File Path Reference |
| :--- | :--- | :---: | :--- |
| `/api/auth/signup` | `POST` | No | `backend/src/auth/auth.controller.ts` |
| `/api/auth/login` | `POST` | No | `backend/src/auth/auth.controller.ts` |
| `/api/auth/logout` | `POST` | No | `backend/src/auth/auth.controller.ts` |
| `/api/auth/me` | `GET` | Yes | `backend/src/auth/auth.controller.ts` |
| `/api/exercises` | `GET` | Yes | [app/api/exercises/route.ts](file:///mnt/New_Volume/project/workout/app/api/exercises/route.ts#L68) |
| `/api/exercises` | `POST` | Yes | [app/api/exercises/route.ts](file:///mnt/New_Volume/project/workout/app/api/exercises/route.ts#L6) |
| `/api/exercises/[exerciseId]/last-log` | `GET` | Yes | [app/api/exercises/[exerciseId]/last-log/route.ts](file:///mnt/New_Volume/project/workout/app/api/exercises/%5BexerciseId%5D/last-log/route.ts) |
| `/api/exercises/logs` | `GET` | Yes | [app/api/exercises/logs/route.ts](file:///mnt/New_Volume/project/workout/app/api/exercises/logs/route.ts) |
| `/api/programmes` | `GET` | Yes | [app/api/programmes/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/route.ts#L86) |
| `/api/programmes` | `POST` | Yes | [app/api/programmes/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/route.ts#L5) |
| `/api/programmes/[programmeId]` | `GET` | Yes | [app/api/programmes/[programmeId]/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/%5BprogrammeId%5D/route.ts#L20) |
| `/api/programmes/[programmeId]` | `PATCH` | Yes | [app/api/programmes/[programmeId]/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/%5BprogrammeId%5D/route.ts#L83) |
| `/api/programmes/[programmeId]/workouts` | `POST` | Yes | [app/api/programmes/[programmeId]/workouts/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/%5BprogrammeId%5D/workouts/route.ts) |
| `/api/programmes/[programmeId]/workouts/[workoutId]/details` | `GET` | Yes | [app/api/programmes/[programmeId]/workouts/[workoutId]/details/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/%5BprogrammeId%5D/workouts/%5BworkoutId%5D/details/route.ts) |
| `/api/programmes/[programmeId]/workouts/[workoutId]/exercises` | `POST` | Yes | [app/api/programmes/[programmeId]/workouts/[workoutId]/exercises/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/%5BprogrammeId%5D/workouts/%5BworkoutId%5D/exercises/route.ts) |
| `/api/programmes/[programmeId]/workouts/[workoutId]/exercises/[metadataId]` | `PATCH` | Yes | [app/api/programmes/[programmeId]/workouts/[workoutId]/exercises/[metadataId]/route.ts](file:///mnt/New_Volume/project/workout/app/api/programmes/%5BprogrammeId%5D/workouts/%5BworkoutId%5D/exercises/%5BmetadataId%5D/route.ts) |
| `/api/workouts` | `GET` | Yes | [app/api/workouts/route.ts](file:///mnt/New_Volume/project/workout/app/api/workouts/route.ts) |
| `/api/log/set` | `POST` | Yes | [app/api/log/set/route.ts](file:///mnt/New_Volume/project/workout/app/api/log/set/route.ts#L14) |
| `/api/log/set` | `PATCH` | Yes | [app/api/log/set/route.ts](file:///mnt/New_Volume/project/workout/app/api/log/set/route.ts#L270) |
| `/api/log/set` | `DELETE` | Yes | [app/api/log/set/route.ts](file:///mnt/New_Volume/project/workout/app/api/log/set/route.ts#L200) |
| `/api/log/sessions` | `GET` | Yes | [app/api/log/sessions/route.ts](file:///mnt/New_Volume/project/workout/app/api/log/sessions/route.ts) |
| `/api/workout-sessions/[sessionId]/finish` | `PATCH` | Yes | [app/api/workout-sessions/[sessionId]/finish/route.ts](file:///mnt/New_Volume/project/workout/app/api/workout-sessions/%5BsessionId%5D/finish/route.ts) |
| `/api/analytics/query` | `POST` | Yes | [app/api/analytics/query/route.ts](file:///mnt/New_Volume/project/workout/app/api/analytics/query/route.ts) |
| `/api/analytics/activity-heatmap` | `GET` | Yes | [app/api/analytics/activity-heatmap/route.ts](file:///mnt/New_Volume/project/workout/app/api/analytics/activity-heatmap/route.ts) |
| `/api/analytics/fatigue` | `GET` | Yes | [app/api/analytics/fatigue/route.ts](file:///mnt/New_Volume/project/workout/app/api/analytics/fatigue/route.ts) |
| `/api/analytics/session-volume` | `GET` | Yes | [app/api/analytics/session-volume/route.ts](file:///mnt/New_Volume/project/workout/app/api/analytics/session-volume/route.ts) |
| `/api/log/volume` | `GET` | Yes | [app/api/log/volume/route.ts](file:///mnt/New_Volume/project/workout/app/api/log/volume/route.ts) |
| `/api/feedback` | `GET` | Yes | [app/api/feedback/route.ts](file:///mnt/New_Volume/project/workout/app/api/feedback/route.ts#L19) |
| `/api/feedback` | `POST` | Yes | [app/api/feedback/route.ts](file:///mnt/New_Volume/project/workout/app/api/feedback/route.ts#L54) |
