# API Migration Verification

This document records endpoint-by-endpoint checks comparing migrated NestJS behavior against the existing Next.js source and tests.

## Status Legend
- `Pass`: checked behavior matches the legacy route.
- `Fail`: checked behavior differs and needs a fix.
- `Not run`: check has not been performed.
- `Needs confirmation`: behavior requires a product or deployment decision.

## Auth

### POST `/api/auth/signup`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Signup success | `201`, returns `{ id, username }`, omits `password_hash` | `201`, returns `{ id, username }`, omits `password_hash` | Pass | Backend test covers extra ignored body fields too. |
| Username normalization | Trims/lowercases before lookup and create | Trims/lowercases before lookup and create | Pass | Existing Next.js integration test and backend e2e test passed. |
| Short username | `400`, `{ "error": "Username must be at least 3 characters" }` | Same status and body | Pass | |
| Short password | `400`, `{ "error": "Password must be at least 6 characters" }` | Same status and body | Pass | Password length uses raw string length. |
| Duplicate username | `409`, `{ "error": "Username already taken" }` | Same status and body | Pass | Duplicate check uses normalized username. |
| Password hashing | `bcrypt.hash(password, 12)` before persistence | `bcrypt.hash(password, 12)` before persistence | Pass | Backend test mocks hash output; source uses cost 12. |

Commands run:

```sh
cd backend && pnpm build
cd backend && pnpm test
pnpm vitest run tests/api/auth.test.ts tests/integration/auth-signup.integration.test.ts --config vitest.integration.config.ts
```

Known gaps:
- `/api/auth/[...nextauth]` has been removed; NestJS now owns login, logout, current-user lookup, and auth cookie verification.

## Exercises

### GET `/api/exercises`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | Backend guard validates the `workout_auth` JWT cookie and emits the legacy body. |
| Success response | `200`, array of selected exercise fields | Same status and shape | Pass | Only `id`, `name`, `description`, `muscle_group`. |
| User/global scoping | Returns current user exercises and global exercises | Same Prisma `OR` scope | Pass | Foreign user custom exercises excluded. |
| Sorting | `muscle_group asc`, then `name asc` | Same `orderBy` | Pass | |

### POST `/api/exercises`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Create success | `201`, full exercise DB model | Same status and shape | Pass | Persists `user_id`, `is_global: false`, trimmed `name`. |
| Missing/blank name | `400`, `{ "error": "Exercise name is required" }` | Same status and body | Pass | |
| Invalid/missing muscle group | `400`, `{ "error": "Valid muscle group is required" }` | Same status and body | Pass | Uses generated Prisma `MuscleGroup` enum values. |
| Owned client ID replay | `200`, returns existing record and skips create | Same status and behavior | Pass | Muscle group validation is skipped on owned replay, matching source order. |
| Global/foreign client ID collision | `403`, `{ "error": "Forbidden" }` | Same status and body | Pass | |

Commands run:

```sh
cd backend && pnpm build
cd backend && pnpm test
pnpm vitest run tests/api/exercises.test.ts tests/integration/exercises.integration.test.ts --config vitest.integration.config.ts
pnpm vitest run tests/api/exercises.test.ts --config vitest.config.ts
```

Notes:
- The targeted legacy integration suite passed: `tests/integration/exercises.integration.test.ts` with 16 tests.
- The `vitest.integration.config.ts` command only includes integration tests by config, so `tests/api/exercises.test.ts` was not selected there.
- Running `tests/api/exercises.test.ts` with the root unit config failed before exercising migration behavior because several existing Prisma methods are not mocked as functions in that test setup. This was not changed in this slice because it also covers out-of-scope subroutes.

### GET `/api/exercises/[exerciseId]/last-log`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Exercise not found/foreign-owned | `404`, `{ "error": "Exercise not found" }` | Same status and body | Pass | |
| Existing exercise with no logs | `200`, JSON `null` | Same status and body | Pass | Needed explicit Express JSON response because Nest default serialized `null` as `{}`. |
| Latest direct or metadata-linked log | `200`, selected `{ id, weight, reps, rpe }` | Same status and shape | Pass | Filters logs by authenticated user. |

### GET `/api/exercises/logs`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Missing exercise ID | `400`, `{ "error": "Missing exerciseId query parameter" }` | Same status and body | Pass | |
| Invalid date query | `400`, invalid `from`/`to` messages | Same status and body | Pass | |
| Invalid date range | `400`, `{ "error": "`from` must be before or equal to `to`" }` | Same status and body | Pass | |
| Repeated/comma exercise IDs | De-dupes, trims, sorts, and queries IDs | Same behavior | Pass | |
| Flattened history response | Hides join model and returns workout session/metadata shape | Same shape | Pass | Handles ad-hoc fallback date and `exerciseId`. |

Commands run:

```sh
cd backend && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/exercises-subroutes.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- A first backend test run caught a null-response mismatch for `last-log`; the controller now writes `response.json(latestLog)` to preserve JSON `null`.
- The first build attempt raced before backend dependencies were installed after cleanup; rerunning after `pnpm install --ignore-workspace --lockfile-dir .` passed.

## Programmes

### GET `/api/programmes`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Empty list | `200`, `[]` | Same behavior | Pass | Covered by legacy integration suite. |
| User scoping | Only current user's programmes | Same Prisma `where` | Pass | |
| Sort and shape | Ordered by `name asc`, includes workout IDs only | Same `orderBy` and select | Pass | |

### POST `/api/programmes`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Create success | `201`, full programme DB model | Same status and shape | Pass | Trims name and stores `description || null`. |
| Missing/blank name | `400`, `{ "error": "Programme name is required" }` | Same status and body | Pass | |
| Owned client ID replay | `200`, existing programme, skips transaction | Same behavior | Pass | |
| Foreign client ID collision | `403`, `{ "error": "Forbidden" }` | Same status and body | Pass | |
| Active create side effects | Deactivates active programmes, closes open activity logs, creates new activity log | Same transaction calls | Pass | `is_active` behavior remains truthy/falsy. |

Commands run:

```sh
cd backend && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/programmes.integration.test.ts --config vitest.integration.config.ts
```

### GET `/api/programmes/[programmeId]`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Missing/foreign programme | `404`, `{ "error": "Programme not found" }` | Same status and body | Pass | |
| Detail success | `200`, programme with ordered workout previews | Same status and shape | Pass | Uses `relationLoadStrategy: "join"`. |
| Hidden metadata handling | Preview and count exclude `is_hidden: true` | Same select/where clauses | Pass | |

### PATCH `/api/programmes/[programmeId]`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Non-boolean `is_active` | `400`, `{ "error": "Invalid is_active status" }` | Same status and body | Pass | Strict boolean unlike create. |
| Missing/foreign programme | `404`, `{ "error": "Programme not found" }` | Same status and body | Pass | |
| Activate | Deactivates other active programmes, closes open logs, creates new log, updates target | Same transaction calls | Pass | |
| Deactivate active programme | Closes open log for target and updates target | Same transaction calls | Pass | |

Commands run:

```sh
cd backend && pnpm install --ignore-workspace --lockfile-dir . && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/programmes.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- A first backend test invocation raced before backend dependencies were installed after cleanup. Reran sequentially after install; build and tests passed.

## Workouts

### POST `/api/programmes/[programmeId]/workouts`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Missing/foreign programme | `404`, `{ "error": "Programme not found" }` | Same status and body | Pass | Parent programme check happens before body validation. |
| Missing/blank name | `400`, `{ "error": "Workout name is required" }` | Same status and body | Pass | |
| Create success | `201`, full workout DB model | Same status and shape | Pass | `order_index` uses parent programme workout count. |
| Owned client ID replay | `200`, existing workout, skips create | Same behavior | Pass | Source checks owner via existing workout's programme. |
| Foreign client ID collision | `403`, `{ "error": "Forbidden" }` | Same status and body | Pass | |

Commands run:

```sh
cd backend && pnpm install --ignore-workspace --lockfile-dir . && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/programmes.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- Initial parallel backend test invocation raced before dependency install completed; rerunning `cd backend && pnpm test` afterward passed.

### POST `/api/programmes/[programmeId]/workouts/[workoutId]/exercises`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Missing/foreign workout | `404`, `{ "error": "Workout not found" }` | Same status and body | Pass | Workout check precedes body validation. |
| Missing exercise ID | `400`, `{ "error": "Exercise is required" }` | Same status and body | Pass | |
| Foreign/missing exercise | `404`, `{ "error": "Exercise not found" }` | Same status and body | Pass | Exercise scope is user-owned or global. |
| Create success | `201`, full metadata DB model | Same status and shape | Pass | `order_index` uses max existing metadata order plus one. |
| Owned client ID replay | `200`, existing metadata, skips create | Same behavior | Pass | Can bypass exercise validation, matching source order. |
| Foreign metadata ID collision | `403`, `{ "error": "Forbidden" }` | Same status and body | Pass | |

Commands run:

```sh
cd backend && pnpm install --ignore-workspace --lockfile-dir . && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/workout-exercises.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- Initial parallel backend test invocation raced before dependency install completed; rerunning `cd backend && pnpm test` afterward passed.

### PATCH `/api/programmes/[programmeId]/workouts/[workoutId]/exercises/[metadataId]`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Missing metadata | `404`, `{ "error": "Exercise metadata not found" }` | Same status and body | Pass | Lookup uses `metadataId` plus `workoutId`. |
| In-place update | `200`, updated metadata DB model | Same status and shape | Pass | Used when no user session exists for the workout. |
| History-preserving update | `200`, newly created metadata DB model | Same status and shape | Pass | Existing row is hidden in the same transaction. |
| Unknown fields | Ignored | Same behavior | Pass | |
| Hidden metadata | Can still be updated when `metadataId` and `workoutId` match | Same behavior | Pass | Source does not filter `is_hidden: false`. |
| Mismatched programme ID | Still succeeds when metadata and workout match | Same behavior | Pass | Source does not read `programmeId`. |
| Foreign metadata ownership gap | Can update foreign workout metadata when IDs match | Same behavior | Pass | Documented as compatibility risk. |
| `null` field behavior | Clone path falls back via `??`; in-place path sends `null` to Prisma | Same behavior | Pass | |

Commands run:

```sh
cd backend && pnpm install --ignore-workspace --lockfile-dir . && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/workout-exercises.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- GitNexus API impact reported 1 direct frontend consumer and medium route risk because response shape affects `app/features/exercises/api/mutations.ts`.
- GitNexus symbol impact on the legacy `PATCH` handler reported low risk, with direct test callers in `tests/integration/workout-exercises.integration.test.ts` and `tests/api/programmes.test.ts`.
- GitNexus could not resolve the new backend controller/service symbols because the backend additions are not indexed yet.

### GET `/api/programmes/[programmeId]/workouts/[workoutId]/details`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Missing/foreign workout | `404`, `{ "error": "Workout not found" }` | Same status and body | Pass | |
| Workout detail success | Returns `workout`, `session`, and `previousLogsByExercise` | Same status and shape | Pass | |
| Active session | Includes today's session when present, otherwise `null` | Same behavior | Pass | Uses local start-of-day window. |
| Previous logs | Groups logs from latest historical session by exercise and sorts by set order | Same behavior | Pass | Ad-hoc logs without session do not populate previous logs. |

Commands run:

```sh
cd backend && pnpm install --ignore-workspace --lockfile-dir . && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/workout-exercises.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- Initial parallel backend test invocation raced before dependency install completed; rerunning `cd backend && pnpm test` afterward passed.

### GET `/api/workouts`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Empty result | `200`, `[]` | Same status and body | Pass | |
| User scoping | Returns workouts through programmes owned by current user | Same behavior | Pass | Foreign-user workouts are excluded. |
| Active filter | Adds `programme.is_active = true` only when `active=true` | Same behavior | Pass | Other active values are unfiltered. |
| Response shape | `id`, `name`, nested `programme.name` | Same shape | Pass | Omits order/index and programme ID. |
| Ordering | Programme name ascending, then workout `order_index` ascending | Same behavior | Pass | |

Commands run:

```sh
cd backend && pnpm install --ignore-workspace --lockfile-dir . && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/workout-exercises.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- GitNexus API impact reported low route risk with no detected consumers, but source inspection found the dashboard `useWorkouts` hook fetches this route.
- GitNexus symbol impact on the legacy `GET` handler reported medium risk due to direct test references.

## Logging

### POST/DELETE/PATCH `/api/log/set`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| POST auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| POST missing fields | `400`, `{ "error": "Missing required fields" }` | Same status and body | Pass | `setOrderIndex === undefined` and falsy `reps` are the source checks. |
| POST exercise scope | Foreign/missing exercise returns `404`, `{ "error": "Exercise not found" }` | Same behavior | Pass | User-owned and global exercises are accepted. |
| POST create | `201`, created `ExerciseLog` plus `pr_type` and `pr` | Same behavior | Pass | Creates/links `SessionExerciseLog`. |
| POST client ID replay | `200`, existing owned log plus `pr` alias | Same behavior | Pass | Skips creation. |
| POST foreign client ID collision | `403`, `{ "error": "Forbidden" }` | Same status and body | Pass | |
| POST session handling | Reuses same local-day session or creates one | Same behavior | Pass | Ad-hoc lookup prefers sessions with `workout_id`. |
| POST PR detection | Historical max aggregate drives lower-case `weight`, `reps`, `estimated_1rm`, or `null` | Same behavior | Pass | First set is not a PR. |
| DELETE missing set ID | `400`, `{ "error": "Set ID is required" }` | Same status and body | Pass | |
| DELETE not found | `404`, `{ "error": "Set not found" }` | Same status and body | Pass | |
| DELETE ownership | `403`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| DELETE success | Deletes log and returns `sessionPurged: false` unless session is empty | Same behavior | Pass | |
| DELETE empty session purge | Deletes session and returns `"Set deleted and empty session purged"` | Same behavior | Pass | |
| PATCH missing fields | `400`, `{ "error": "Missing required fields" }` | Same status and body | Pass | |
| PATCH not found | `404`, `{ "error": "Set not found" }` | Same status and body | Pass | |
| PATCH ownership | `403`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| PATCH success | `200`, updated `ExerciseLog` | Same behavior | Pass | Does not recalculate PR metadata. |

Commands run:

```sh
cd backend && pnpm install --ignore-workspace --lockfile-dir . && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/log-set.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- `cd backend && pnpm test` initially failed in the sandbox with `listen EPERM`; rerunning the same command with approved escalation passed: 6 test files, 53 tests.
- The focused integration test initially failed in the sandbox with `connect EPERM 127.0.0.1:5432`; rerunning the same command with approved escalation passed: 1 test file, 24 tests.
- GitNexus did not resolve `/api/log/set` or its method symbols, matching the migration plan warning that these routes were missing from the GitNexus route map.

### GET `/api/log/sessions`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | Backend validates the `workout_auth` cookie. |
| Empty result | `200`, `{ data: [], pagination: { from: null, to: null, hasMore: false } }` | Same behavior | Pass | |
| User scoping | Returns only sessions where `user_id` is current user | Same behavior | Pass | |
| Ordering | Sessions ordered by `date desc` | Same behavior | Pass | |
| Limit | `limit` query becomes Prisma `take`; `hasMore` is `sessions.length === limit` | Same behavior | Pass | |
| Cursor | `from` query filters `date < new Date(from)` | Same behavior | Pass | |
| Grouped response | `grouped=true` returns date buckets with labels | Same behavior | Pass | |
| Grouped filtering | Grouped mode skips sessions without valid exercise relations | Same behavior | Pass | Ungrouped mode does not filter. |
| Response shape | Session, workout/programme names, session exercise logs, nested exercise data | Same selected shape | Pass | |

Commands run:

```sh
cd backend && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/log-sessions-volume.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- Backend tests ran with approved escalation for local HTTP listeners and passed: 7 test files, 57 tests.
- Focused integration ran with approved escalation for local PostgreSQL access and passed: 1 test file, 13 tests.
- GitNexus did not resolve `/api/log/sessions`, matching the migration plan warning that this route was missing from the GitNexus route map.

### PATCH `/api/workout-sessions/[sessionId]/finish`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Missing/foreign session | `404`, `{ "error": "Session not found" }` | Same status and body | Pass | Lookup scopes by `id` and `user_id`. |
| Empty session | Deletes session and returns `{ message: "Session discarded (zero sets logged)", discarded: true }` | Same behavior | Pass | |
| Non-empty session | Updates `end_time` and returns updated session plus `discarded: false` | Same behavior | Pass | |

Commands run:

```sh
cd backend && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/log-sessions-volume.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- Backend tests ran with approved escalation for local HTTP listeners and passed: 7 test files, 60 tests.
- Focused integration ran with approved escalation for local PostgreSQL access and passed: 1 test file, 17 tests.
- GitNexus API impact reported low risk with one direct frontend consumer, `use-finish-workout.ts`.

### GET `/api/log/volume`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Empty result | `200`, `[]` | Same behavior | Pass | |
| User scoping | Reads only sessions owned by the current user | Same behavior | Pass | |
| Volume calculation | `weight * reps`, skipping zero volume and missing logs | Same behavior | Pass | |
| Grouping | Aggregates by date, workout ID, and muscle group | Same behavior | Pass | |
| Exercise breakdown | Aggregates per-exercise volume within each group | Same behavior | Pass | |
| Sorting | Returns volume points sorted by date ascending | Same behavior | Pass | |

Commands run:

```sh
cd backend && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/log-sessions-volume.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- Backend tests ran with approved escalation for local HTTP listeners and passed: 8 test files, 62 tests.
- Focused integration ran with approved escalation for local PostgreSQL access and passed: 1 test file, 17 tests.
- GitNexus did not resolve `/api/log/volume`, matching the migration plan warning that this route was missing from the GitNexus route map.

### POST `/api/analytics/query`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Invalid payload | `400`, `{ "error": "Invalid payload", "details": ... }` | Same status and body shape | Pass | Zod formatted details preserved. |
| Valid query | `200`, `{ meta, data }` | Same status and shape | Pass | Explicit `@HttpCode(200)` added after backend test caught Nest's default `201`. |
| Zod defaults | Optional dimensions, filters, order, and limit default as in source | Same behavior | Pass | |
| User isolation | Raw SQL includes authenticated `user_id` condition | Same behavior | Pass | |
| BigInt serialization | Raw `bigint` values convert to numbers | Same behavior | Pass | |

Commands run:

```sh
cd backend && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/analytics.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- Backend tests first failed because Nest returned `201` for POST by default; `AnalyticsController.query` now explicitly returns `200`.
- Backend tests ran with approved escalation for local HTTP listeners and passed: 8 test files, 65 tests.
- Focused integration ran with approved escalation for local PostgreSQL access and passed: 1 test file, 16 tests.
- GitNexus API impact reported low risk with two direct dashboard consumers.

### GET `/api/analytics/activity-heatmap`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Success shape | `200`, `{ data: [{ date, count }] }` | Same status and shape | Pass | |
| Date format | `date` is returned as PostgreSQL `::date::text` | Same behavior | Pass | `YYYY-MM-DD` format verified in integration. |
| User isolation | Raw SQL includes authenticated `user_id` condition | Same behavior | Pass | |
| BigInt serialization | Raw count `bigint` values convert to numbers | Same behavior | Pass | |

Commands run:

```sh
cd backend && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/analytics.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- Backend tests passed: 8 test files, 67 tests.
- Focused integration passed: 1 test file, 18 tests.
- GitNexus API impact reported low risk with one direct dashboard consumer.

### GET `/api/feedback`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Empty history | `200`, `[]` | Same status and body | Pass | |
| User scoping | Returns only authenticated user's feedback | Same behavior | Pass | |
| Ordering | Newest feedback first by `created_at DESC` | Same query behavior | Pass | |
| Selected fields | Includes only `id`, `description`, `status`, `created_at`, `updated_at` | Same behavior | Pass | |

### POST `/api/feedback`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | Auth happens before body validation. |
| Create success | `201`, `{ id, status, created_at }` | Same status and body shape | Pass | |
| Trim description | Whitespace trimmed before storage | Same behavior | Pass | |
| Ignore client status | Client-provided status is ignored; default status persists | Same behavior | Pass | |
| Invalid payload | `400`, `{ "error": "Invalid payload", "details": ... }` | Same status and body shape | Pass | Zod formatted details preserved. |

Commands run:

```sh
cd backend && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/feedback.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- Backend tests first failed because `FeedbackModule` did not provide the auth guard's `ConfigService` dependency; fixed by importing `ConfigModule` and providing the guard, matching other authenticated modules.
- Backend tests passed after the fix: 9 test files, 78 tests.
- Focused integration passed: 1 test file, 13 tests.
- GitNexus API impact reported low risk with two direct settings consumers.

### GET `/api/analytics/fatigue`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Default query | Returns 30 time-series points and `hasMoreHistory` | Same behavior | Pass | |
| Custom `days` | Returns requested number of points | Same behavior | Pass | Existing integration checks `days=7`. |
| Training data | Non-cardio logs affect `acuteLoad`, `chronicLoad`, `ratio`, `isCalibrating` | Same behavior | Pass | |
| Cardio exclusion query | Filters both direct exercise and metadata-linked exercise muscle groups where not Cardio | Same query intent | Pass | |
| First-log history | `hasMoreHistory` depends on first ever log before calculation window | Same behavior | Pass | |

Commands run:

```sh
cd backend && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/analytics.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- Backend tests passed: 8 test files, 70 tests.
- Focused integration passed: 1 test file, 18 tests.
- GitNexus API impact reported low risk with one direct dashboard consumer.
- Source behavior returns `ratio` and `isCalibrating`; docs mention `acwr` and `status`, so the NestJS route preserved source/consumer behavior.

### GET `/api/analytics/session-volume`

Overall result: `Pass`

| Test case | Next.js observed behavior | NestJS observed behavior | Result | Notes |
| --- | --- | --- | --- | --- |
| Auth failure | `401`, `{ "error": "Unauthorized" }` | Same status and body | Pass | |
| Missing `workoutId` | `400`, `{ "error": "Missing workoutId parameter" }` | Same status and body | Pass | |
| Empty analytics logs | `200`, `[]` | Same status and body | Pass | |
| Session grouping | Groups multiple rows by `workout_session_id` and uses latest session date | Same behavior | Pass | |
| Volume rules | Ignores non-positive volume and sums positive session volume | Same behavior | Pass | |
| Delta/status rules | Produces `neutral`, `optimal`, `warning`, and `deload` using source thresholds | Same behavior | Pass | |
| Limit | Returns only the last `limit` chronological sessions | Same behavior | Pass | |

Commands run:

```sh
cd backend && pnpm build
cd backend && pnpm test
pnpm vitest run tests/integration/analytics.integration.test.ts --config vitest.integration.config.ts
```

Notes:
- Backend tests passed: 8 test files, 73 tests.
- Focused integration passed: 1 test file, 18 tests.
- GitNexus API impact reported low risk with one direct dashboard consumer.

## Final Verification

Overall result: `Pass`

| Gate | Evidence | Result | Notes |
| --- | --- | --- | --- |
| API inventory coverage | `docs/api-documentation.md` lists all documented API endpoints; `docs/api-migration-plan.md` marks every resource endpoint `Verified` and the old NextAuth catch-all `Removed` | Pass | |
| Contract snapshots | `docs/api-contract-snapshots.md` has `Verified` snapshots for every resource endpoint and marks backend auth ownership; no `In progress`, `Migrated`, or `Not started` snapshot statuses remain | Pass | |
| Backend route coverage | Backend controllers expose the verified resource endpoint paths and methods | Pass | Health endpoint is additional backend infrastructure. |
| Focused endpoint tests | Each feature section above records backend build/test and focused legacy integration checks | Pass | Several tests required approved local DB/listener access. |
| Full API integration suite | `pnpm test:api` passed: 9 test files, 155 tests | Pass | First sandboxed attempt failed with local PostgreSQL `EPERM`; rerun with approved local DB access passed. |
| Lint | `pnpm lint` passed with 0 errors | Pass | Two existing warnings remain in `app/features/logging/api/mutation-hooks/use-update-log-set.ts`. Generated `backend/dist/**` is ignored by root ESLint. |
| Backend build/tests | `cd backend && pnpm build`; `cd backend && pnpm test` passed | Pass | Final backend test rerun passed: 9 test files, 78 tests. |
| Frontend cutover planning | `docs/frontend-api-switch-plan.md` exists | Pass | Frontend callers were not changed. |
| GitNexus scope check | `gitnexus_detect_changes(scope=all)` reported low risk and no affected processes for indexed changed symbols | Pass | Reran after the ESLint ignore change. Current GitNexus index does not fully represent untracked backend/docs additions. |

Commands run:

```sh
pnpm test:api
pnpm lint
cd backend && pnpm build
cd backend && pnpm test
gitnexus_detect_changes(scope=all)
```

Notes:
- Old Next.js API routes were intentionally kept in place.
- Frontend fetch callers were intentionally left unchanged; the switch plan recommends a proxy phase.
- `/api/auth/[...nextauth]` is removed because NestJS now issues and validates the backend-owned `workout_auth` cookie.
