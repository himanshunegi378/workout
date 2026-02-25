---
name: workout-db
description: Prisma database patterns and schema reference for the workout/fitness app. Use when writing Prisma queries, creating or modifying schema models, running migrations, or debugging database-related issues. Covers select vs include, enum usage, OR queries, soft-delete patterns, the singleton client, and common gotchas.
---

# Workout Database (Prisma)

Database layer for the workout app using **Prisma v7** with **PostgreSQL** (Supabase).

## Setup

- **Generator output:** `../app/generated/prisma` — import types from `@/app/generated/prisma/client`, **NOT** `@prisma/client`
- **Prisma client:** import from `@/lib/prisma` (singleton via `globalThis.prismaGlobal`)
- **Schema file:** `prisma/schema.prisma`
- **Migrations:** `pnpm prisma migrate dev --name <name>`
- **After `prisma generate`:** always restart `pnpm dev` — the `globalThis` singleton caches the old client

See **[references/schema-reference.md](references/schema-reference.md)** for the full annotated schema with model relationships.

## Schema Conventions

- All table names use `@@map("snake_case")` (e.g., `@@map("exercise_logs")`)
- All IDs use `cuid()`: `@id @default(cuid())`
- User ownership: every user-facing model has `user_id String` + `User` relation
- Soft-delete pattern: `is_hidden Boolean @default(false)` on `ExerciseWithMetadata` — used when metadata is replaced but logs still reference the old entry

## Query Patterns

### Always Use `select` — Never `include`

```ts
// ✅ Correct — fetch only what UI needs
const groups = await prisma.workoutGroup.findMany({
    where: { user_id: userId },
    select: { id: true, name: true, description: true },
});

// ❌ Wrong — fetches entire related models
const groups = await prisma.workoutGroup.findMany({
    where: { user_id: userId },
    include: { workouts: true },
});
```

### Always Filter by `user_id`

Every query returning user-owned data **MUST** include `user_id` in the `where` clause:

```ts
where: { id: groupId, user_id: userId }
```

### Enum Types — Never Plain Strings

```ts
import { MuscleGroup } from "@/app/generated/prisma/client";
muscle_group: MuscleGroup.Chest   // ✅
muscle_group: "Chest"             // ❌ TypeScript error
```

### Complex Nested OR Queries

When fetching logs tied to an `Exercise` either directly or through `ExerciseWithMetadata`:

```ts
where: {
    OR: [
        { exercise_id: exerciseId },
        { exerciseWithMetadata: { exercise_id: exerciseId } }
    ],
    workoutSession: { user_id: userId },
}
```

## Model Overview

| Model | Table | Purpose |
|---|---|---|
| `User` | `users` | Authenticated user |
| `Exercise` | `exercises` | Reusable exercise definition |
| `ExerciseWithMetadata` | `exercise_with_metadata` | Exercise with prescribed sets/reps/tempo in a workout |
| `Workout` | `workouts` | Ordered list of exercises |
| `WorkoutGroup` | `workout_groups` | Programme / collection of workouts |
| `WorkoutSession` | `workout_sessions` | A single logged training session |
| `ExerciseLog` | `exercise_logs` | A single logged set |

### Key Relationships

```
User ──┬── WorkoutGroup ── Workout ── ExerciseWithMetadata ── Exercise
       ├── Exercise
       └── WorkoutSession ── ExerciseLog ──┬── ExerciseWithMetadata (planned)
                                           └── Exercise (ad-hoc)
```

## Don'ts

- **No `include`** — always use `select`
- **No plain strings for enums** — always import from `@/app/generated/prisma/client`
- **No queries without `user_id`** — data isolation is mandatory
- **No forgetting to restart dev** — after `prisma generate`, `pnpm dev` must be restarted
