# Prisma Schema Reference

Full annotated schema for the workout application.

## Enums

```prisma
enum MuscleGroup {
  Chest
  Back
  Legs
  Shoulders
  Arms
  Core
}
```

## Models

### User
```prisma
model User {
  id            String   @id @default(cuid())
  username      String   @unique
  password_hash String
  created_at    DateTime @default(now())

  workoutGroups   WorkoutGroup[]
  exercises       Exercise[]
  workoutSessions WorkoutSession[]

  @@map("users")
}
```

### Exercise
Reusable exercise definition owned by a user.
```prisma
model Exercise {
  id           String      @id @default(cuid())
  name         String
  description  String?
  muscle_group MuscleGroup

  user_id String
  user    User   @relation(fields: [user_id], references: [id])

  exercisesWithMetadata ExerciseWithMetadata[]
  exerciseLogs          ExerciseLog[]

  @@map("exercises")
}
```

### ExerciseWithMetadata
An exercise as it appears in a specific Workout, with prescribed parameters.

**Soft-delete:** `is_hidden` is set to `true` when metadata is replaced but existing logs still reference the old record.

```prisma
model ExerciseWithMetadata {
  id          String  @id @default(cuid())
  reps_min    Int
  reps_max    Int
  sets_min    Int
  sets_max    Int
  rest_min    Int          -- seconds
  rest_max    Int          -- seconds
  tempo       String       -- format: "3-1-2-0" (ecc-pause-con-pause)
  order_index Int          -- position within workout
  is_hidden   Boolean @default(false)

  exercise_id String
  workout_id  String

  exercise     Exercise      @relation(...)
  workout      Workout       @relation(...)
  exerciseLogs ExerciseLog[]

  @@map("exercise_with_metadata")
}
```

### Workout
```prisma
model Workout {
  id          String  @id @default(cuid())
  name        String
  description String?
  order_index Int

  workout_group_id String

  workoutGroup          WorkoutGroup           @relation(...)
  exercisesWithMetadata ExerciseWithMetadata[]
  workoutSessions       WorkoutSession[]

  @@map("workouts")
}
```

### WorkoutGroup
A programme or collection of workouts (e.g., "Push Pull Legs").
```prisma
model WorkoutGroup {
  id          String  @id @default(cuid())
  name        String
  description String?

  user_id String
  user    User   @relation(...)

  workouts Workout[]

  @@map("workout_groups")
}
```

### WorkoutSession
A single logged training session tied to a Workout.
```prisma
model WorkoutSession {
  id         String    @id @default(cuid())
  start_time DateTime?
  end_time   DateTime?
  notes      String?
  date       DateTime  @default(now())

  workout_id String
  user_id    String

  workout      Workout       @relation(...)
  user         User          @relation(...)
  exerciseLogs ExerciseLog[]

  @@map("workout_sessions")
}
```

### ExerciseLog
A single logged set. Can be linked to either a planned exercise (via `exercise_with_metadata_id`) or an ad-hoc exercise (via `exercise_id`).
```prisma
model ExerciseLog {
  id              String @id @default(cuid())
  weight          Float?     -- null means bodyweight
  reps            Int
  set_order_index Int

  exercise_with_metadata_id String?   -- planned exercises
  exercise_id               String?   -- ad-hoc exercises
  workout_session_id        String

  exerciseWithMetadata ExerciseWithMetadata? @relation(...)
  exercise             Exercise?             @relation(...)
  workoutSession       WorkoutSession        @relation(...)

  @@map("exercise_logs")
}
```

## Relationship Diagram

```
User
 ├── WorkoutGroup
 │    └── Workout
 │         ├── ExerciseWithMetadata ──→ Exercise
 │         └── WorkoutSession
 │              └── ExerciseLog ──→ ExerciseWithMetadata? (planned)
 │                               ──→ Exercise? (ad-hoc)
 └── Exercise (standalone definitions)
```
