# API Migration Plan

## Purpose
Move the documented Next.js API routes into a NestJS backend under `backend/` while preserving the real workout-tracking behaviors users already rely on: signing up, managing exercise libraries, building programmes, logging sets, finishing sessions, reviewing history, reading analytics, and submitting feedback.

This migration must happen feature by feature. A feature is not considered complete until its endpoint contracts are migrated and verified.

## Migration Status Legend
- `Not started`: no backend implementation exists.
- `In progress`: backend code exists but has not passed verification.
- `Migrated`: backend code is complete for the endpoint.
- `Verified`: endpoint behavior has been checked against the Next.js implementation.
- `Removed`: endpoint was retired after backend ownership replaced it.
- `Needs confirmation`: behavior is unclear or requires a product/deployment decision.

## API Inventory And Targets
| Priority | Domain | Endpoint | Method | Current source | Target NestJS module/controller/service | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | Auth | `/api/auth/[...nextauth]` | `GET`, `POST` | `app/api/auth/[...nextauth]/route.ts` | Removed after backend-owned login/logout/me replaced NextAuth | Removed |
| 1 | Auth | `/api/auth/signup` | `POST` | `app/api/auth/signup/route.ts` | `auth/AuthController.signup` + `AuthService.signup` | Verified |
| 1 | Auth | `/api/auth/login` | `POST` | None | `auth/AuthController.login` + `AuthService.login` | Verified |
| 1 | Auth | `/api/auth/logout` | `POST` | None | `auth/AuthController.logout` + `AuthService.logout` | Verified |
| 1 | Auth | `/api/auth/me` | `GET` | None | `auth/AuthController.me` + `AuthService.me` | Verified |
| 2 | Exercises | `/api/exercises` | `GET` | `app/api/exercises/route.ts` | `exercises/ExercisesController.list` + `ExercisesService.listForUser` | Verified |
| 2 | Exercises | `/api/exercises` | `POST` | `app/api/exercises/route.ts` | `exercises/ExercisesController.create` + `ExercisesService.createCustomExercise` | Verified |
| 2 | Exercises | `/api/exercises/[exerciseId]/last-log` | `GET` | `app/api/exercises/[exerciseId]/last-log/route.ts` | `logging/ExerciseHistoryController.lastLog` + `ExerciseHistoryService.getLastLog` | Verified |
| 2 | Exercises | `/api/exercises/logs` | `GET` | `app/api/exercises/logs/route.ts` | `logging/ExerciseHistoryController.logs` + `ExerciseHistoryService.listLogs` | Verified |
| 3 | Programmes | `/api/programmes` | `GET` | `app/api/programmes/route.ts` | `programmes/ProgrammesController.list` + `ProgrammesService.list` | Verified |
| 3 | Programmes | `/api/programmes` | `POST` | `app/api/programmes/route.ts` | `programmes/ProgrammesController.create` + `ProgrammesService.create` | Verified |
| 3 | Programmes | `/api/programmes/[programmeId]` | `GET` | `app/api/programmes/[programmeId]/route.ts` | `programmes/ProgrammesController.detail` + `ProgrammesService.getDetail` | Verified |
| 3 | Programmes | `/api/programmes/[programmeId]` | `PATCH` | `app/api/programmes/[programmeId]/route.ts` | `programmes/ProgrammesController.updateActive` + `ProgrammesService.updateActive` | Verified |
| 4 | Workouts | `/api/programmes/[programmeId]/workouts` | `POST` | `app/api/programmes/[programmeId]/workouts/route.ts` | `workouts/WorkoutsController.createForProgramme` + `WorkoutsService.createForProgramme` | Verified |
| 4 | Workouts | `/api/programmes/[programmeId]/workouts/[workoutId]/details` | `GET` | `app/api/programmes/[programmeId]/workouts/[workoutId]/details/route.ts` | `workouts/WorkoutsController.detail` + `WorkoutsService.getWorkoutDetails` | Verified |
| 4 | Workouts | `/api/programmes/[programmeId]/workouts/[workoutId]/exercises` | `POST` | `app/api/programmes/[programmeId]/workouts/[workoutId]/exercises/route.ts` | `workouts/WorkoutExercisesController.addExercise` + `WorkoutExercisesService.addExercise` | Verified |
| 4 | Workouts | `/api/programmes/[programmeId]/workouts/[workoutId]/exercises/[metadataId]` | `PATCH` | `app/api/programmes/[programmeId]/workouts/[workoutId]/exercises/[metadataId]/route.ts` | `workouts/WorkoutExercisesController.updateMetadata` + `WorkoutExercisesService.updateMetadata` | Verified |
| 4 | Workouts | `/api/workouts` | `GET` | `app/api/workouts/route.ts` | `workouts/WorkoutsListController.list` + `WorkoutsService.listForUser` | Verified |
| 5 | Logging | `/api/log/set` | `POST` | `app/api/log/set/route.ts` | `logging/LogSetController.create` + `LogSetService.create` | Verified |
| 5 | Logging | `/api/log/set` | `DELETE` | `app/api/log/set/route.ts` | `logging/LogSetController.delete` + `LogSetService.delete` | Verified |
| 5 | Logging | `/api/log/set` | `PATCH` | `app/api/log/set/route.ts` | `logging/LogSetController.update` + `LogSetService.update` | Verified |
| 5 | Logging | `/api/log/sessions` | `GET` | `app/api/log/sessions/route.ts` | `logging/SessionsController.list` + `SessionsService.list` | Verified |
| 5 | Logging | `/api/workout-sessions/[sessionId]/finish` | `PATCH` | `app/api/workout-sessions/[sessionId]/finish/route.ts` | `logging/SessionFinishController.finish` + `SessionsService.finish` | Verified |
| 6 | Analytics | `/api/analytics/query` | `POST` | `app/api/analytics/query/route.ts` | `analytics/AnalyticsController.query` + `AnalyticsService.query` | Verified |
| 6 | Analytics | `/api/analytics/activity-heatmap` | `GET` | `app/api/analytics/activity-heatmap/route.ts` | `analytics/AnalyticsController.activityHeatmap` + `AnalyticsService.activityHeatmap` | Verified |
| 6 | Analytics | `/api/analytics/fatigue` | `GET` | `app/api/analytics/fatigue/route.ts` | `analytics/AnalyticsController.fatigue` + `AnalyticsService.fatigue` | Verified |
| 6 | Analytics | `/api/analytics/session-volume` | `GET` | `app/api/analytics/session-volume/route.ts` | `analytics/AnalyticsController.sessionVolume` + `AnalyticsService.sessionVolume` | Verified |
| 6 | Analytics | `/api/log/volume` | `GET` | `app/api/log/volume/route.ts` | `analytics/AnalyticsController.legacyVolume` + `AnalyticsService.legacyVolume` | Verified |
| 7 | Feedback | `/api/feedback` | `GET` | `app/api/feedback/route.ts` | `feedback/FeedbackController.list` + `FeedbackService.list` | Verified |
| 7 | Feedback | `/api/feedback` | `POST` | `app/api/feedback/route.ts` | `feedback/FeedbackController.submit` + `FeedbackService.submit` | Verified |

## Shared Dependencies
- Prisma 7 PostgreSQL client and the existing schema models.
- `bcryptjs` for password hashing with cost `12`.
- Backend-owned signed JWT cookie compatibility for authenticated user recovery.
- Zod schemas currently used by analytics and feedback APIs.
- Date handling behavior from the existing route implementations, including local-day session matching.
- PR detection utility used by set logging.
- Analytics SQL safety helpers and BigInt serialization behavior.

## Auth Strategy
- Public endpoints: signup, login, and logout.
- Authenticated endpoints: recover the same user ID from the backend `workout_auth` cookie.
- Backend-owned path: NestJS issues and validates the signed auth cookie; Next.js only checks for the cookie at the page proxy layer.
- Return `401` with `{"error":"Unauthorized"}` for unauthenticated application API calls.
- Decision: NestJS owns credentials login, logout, current-user lookup, and resource API authorization.

## Validation Strategy
- Preserve existing manual validation messages where the API already returns exact `{"error": "..."}` strings.
- Reuse or port Zod validation for analytics and feedback to preserve `{"error":"Invalid payload","details":...}`.
- Use NestJS DTOs for request mapping, but avoid class-validator transformations that change current string input behavior for fields like `weight`, `reps`, `rpe`, and query params.
- Keep idempotency checks for client-generated IDs in exercises, programmes, workouts, exercise metadata, and logged sets.

## Error Handling Strategy
- Add a common exception filter that emits the existing `{ "error": string }` shape by default.
- Preserve route-specific status codes and messages from `docs/api-documentation.md`.
- Preserve Zod details for validation failures where currently exposed.
- Avoid leaking internal errors; match existing generic `500` messages.

## Environment Variables Needed By Backend
- `DATABASE_URL`
- `DIRECT_URL` if Prisma migrations or direct connections require it.
- `AUTH_SECRET` for backend JWT cookie signing and validation.
- `AUTH_COOKIE_DOMAIN` only when frontend and backend must share cookies across sibling production subdomains.
- `CORS_ORIGIN` for the Next.js frontend origin.
- `NODE_ENV`
- Needs confirmation for deployment: public/internal backend URL for frontend/proxy configuration.

## Database And Client Dependencies
- Use a backend-local Prisma provider that imports the generated client safely without editing `app/generated/prisma/`.
- Keep transaction boundaries for programme activation, exercise metadata soft-delete replacement, set deletion cleanup, and session finish behavior.
- Preserve soft delete semantics for `ExerciseWithMetadata.is_hidden`.
- Preserve user scoping on all owned records and global exercise library visibility.
- Preserve raw SQL access for analytics views with parameterized values.

## External Services Used
- No file upload behavior is documented.
- No third-party external API is documented.
- Database and auth/session cookies are the only external integration points currently visible.

## Risks And Unknowns
- Auth ownership is backend-owned. Any auth change must preserve mobile login, signup auto-login, protected pages, and resource API cookies.
- Some documentation examples mention `210/200/201`; the route source must be checked for actual status codes before migration.
- GitNexus route map did not list `/api/log/set`, `/api/log/sessions`, or `/api/log/volume`; route source and tests must be treated as authoritative for those.
- The API documentation references some historical `app/features/programs` paths while the repo uses `app/features/programmes`; frontend caller inventory must be verified before cutover.
- Analytics dynamic SQL must be ported carefully to avoid SQL injection or BigInt serialization regressions.
- Workout logging owns natural workout history. Any change that makes logging less human, such as corrupting historical templates or duplicating offline sets, is a domain failure.

## Feature Migration Order
1. Planning and memory: create `.ai/active/*`, this migration plan, and later `docs/api-migration-verification.md`.
2. Contract snapshots: create/update `docs/api-contract-snapshots.md` from source before implementing each endpoint.
3. Backend scaffold: NestJS bootstrap, config, CORS, Prisma provider, common auth guard, common error filter, health endpoint.
4. Auth: migrate signup, login, logout, and current-user lookup; remove the old NextAuth catch-all.
5. Exercises read/create: migrate `/api/exercises`; verify library scope and custom exercise idempotency.
6. Programmes: migrate list/create/detail/activation; verify active programme transaction and activity logs.
7. Workouts/templates: migrate workout creation, details, exercise linking, metadata update, and `/api/workouts`; verify soft-delete template replacement.
8. Logging: migrate set create/update/delete, sessions list, finish session, exercise last-log/history; verify session creation, cleanup, PR detection, and history ownership.
9. Analytics: migrate query, heatmap, fatigue, session volume, and legacy volume; verify SQL output and BigInt serialization.
10. Feedback: migrate feedback list/submit; verify Zod payload errors and authenticated history.
11. Frontend switch plan: create `docs/frontend-api-switch-plan.md` after backend endpoints exist enough to make routing decisions.
12. Final verification: create/update `docs/api-migration-verification.md`, run relevant tests, run GitNexus change detection before commit.

## Per-Feature Verification Gates
- Auth: signup success, duplicate username conflict, short username/password validation, password hash creation.
- Exercises: unauthenticated `401`, global plus custom list, custom create `201`, duplicate owned ID `200`, foreign/global collision `403`.
- Programmes: programme list shape, create validation, active programme transaction, detail hides deleted exercise metadata.
- Workouts/templates: order index calculation, workout ownership, detail previous-log grouping, exercise linking idempotency, metadata soft-delete replacement after sessions exist.
- Logging: offline ID idempotency, local-day session auto-creation, PR detection, set update/delete ownership, empty session purge, grouped session pagination.
- Analytics: Zod invalid payloads, raw SQL user isolation, heatmap date format, fatigue calibration, session-volume status thresholds, legacy volume grouping.
- Feedback: Zod invalid payloads, list only current user, submit returns `id`, `status`, and `created_at`.
