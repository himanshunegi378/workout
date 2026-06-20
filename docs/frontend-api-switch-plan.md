# Frontend API Switch Plan

## Purpose
Move the frontend from Next.js API route handlers to the verified NestJS backend without changing user workflows in one uncontrolled pass.

The real-world behavior to protect is simple: a workout can be logged on mobile with the same session, exercise, programme, analytics, and feedback results before and after routing changes.

## Current Backend Coverage
- Verified NestJS resource endpoints: signup; exercises; programme list/create/detail/activation; workout templates and details; workout exercise linking and metadata updates; set logging create/update/delete; sessions list; finish session; exercise history; legacy volume; analytics query, heatmap, fatigue, session volume; feedback history and submit.
- Backend-owned auth endpoints: `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, and `/api/auth/me`.
- Current frontend resource callers use `lib/api-client.ts`, which resolves backend URLs from `NEXT_PUBLIC_BACKEND_API_URL` and sends credentials with each request.

## Applied Switch Strategy
1. Issue auth sessions from the NestJS backend.
2. Route production frontend resource API calls through `lib/api-client.ts`.
3. Resolve backend URLs from `NEXT_PUBLIC_BACKEND_API_URL`.
4. Include credentials on backend requests so the `workout_auth` cookie is sent.
5. Remove the old NextAuth catch-all route from Next.js.
6. Preserve route paths, methods, headers, bodies, query params, response parsing, React Query keys, and mutation behavior.
7. Keep old Next.js route handlers temporarily for API integration tests and rollback only; production frontend code no longer calls them.

## Current Switch State
- Direct backend calls have been applied through `lib/api-client.ts`.
- `next.config.ts` no longer rewrites migrated resource API routes.
- Login, signup auto-login, logout, and current-user reads use the NestJS backend auth API.

## API Usage Classification
| Category | Current usage | Action |
| --- | --- | --- |
| Frontend resource API calls | Signup, exercises, programmes, workouts, logging, analytics, and feedback hooks/mutations under `app/features/**/api/**` plus `app/signup/page.tsx` | Moved to `apiFetch`/`apiUrl`, backed by `NEXT_PUBLIC_BACKEND_API_URL` |
| Backend auth API calls | `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` | Owned by NestJS and authenticated by `workout_auth` |
| Temporary compatibility/API test routes | `app/api/**/route.ts` and `tests/api/**`, `tests/integration/**` imports | Kept for contract tests and rollback; not used by production frontend flows |
| Test/mock references | MSW exercise handlers and exercise fetch tests | Updated to mock `http://backend.test/api/exercises`, matching the shared client test origin |
| Static asset or unrelated path | None found in production `app/` API searches | No action |

## Environment Variables
- `NEXT_PUBLIC_BACKEND_API_URL`: browser-visible NestJS backend origin, for example `http://localhost:4000`.
- `CORS_ORIGIN`: frontend origin allowed by the backend if direct browser calls are introduced.
- `AUTH_SECRET`: signs and verifies the backend `workout_auth` JWT cookie.

## Direct Backend Route Groups
| Phase | Routes | Verification |
| --- | --- | --- |
| 1 | `/api/auth/signup` | Signup success, duplicate username, validation errors |
| 2 | `/api/exercises`, `/api/exercises/*` | Exercise library, custom create, history lookups |
| 3 | `/api/programmes`, `/api/programmes/*`, `/api/workouts` | Programme creation, activation, workout template screens |
| 4 | `/api/log/set`, `/api/log/sessions`, `/api/workout-sessions/*/finish` | Log set offline IDs, session list, finish workout |
| 5 | `/api/log/volume`, `/api/analytics/*` | Dashboard charts and analytics tests |
| 6 | `/api/feedback` | Feedback submit and history |

## Routes To Keep In Next.js
- Any future route that directly depends on Next.js runtime APIs until it has its own migration snapshot and verification entry.

## Central API Client
- `lib/api-client.ts` owns backend URL resolution, query string building, credentialed fetches, and `{ error }` parsing helpers.
- Browser code must use `apiFetch` or `apiUrl` instead of hardcoding backend origins.
- Tests use `http://backend.test` as the backend origin so MSW verifies direct-backend request URLs without needing a live server.

## Per-Phase Verification
- Run backend tests: `cd backend && pnpm test`.
- Run the focused existing integration test for the switched domain.
- For logging and workout routes, manually complete a workout session on mobile viewport.
- For analytics, load dashboard charts and verify no console/API errors.
- For feedback, submit a trimmed message and refresh history.

## Cutover Guardrails
- Do not add new production `fetch("/api/...")` call sites for migrated resource endpoints.
- Do not reintroduce `/api/auth/[...nextauth]` or `next-auth` client helpers.
- Do not remove Next.js route files until the proxy phase has run successfully in the target deployment.
- Keep `docs/api-migration-verification.md` updated after each switched domain.
- Run `gitnexus_detect_changes()` before committing the switch.
