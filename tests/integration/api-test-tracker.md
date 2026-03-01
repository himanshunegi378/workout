# API Integration Test Tracker

Run all: `pnpm test:api`
(Or watch mode: `pnpm test:api:watch`)

## Routes

| Status | File | Route | Methods |
|---|---|---|---|
| ✅ | `exercises.integration.test.ts` | `/api/exercises` | GET, POST |
| ✅ | `exercises-subroutes.integration.test.ts` | `/api/exercises/[id]/last-log` | GET |
| ✅ | `exercises-subroutes.integration.test.ts` | `/api/exercises/[id]/logs` | GET |
| ✅ | `auth-signup.integration.test.ts` | `/api/auth/signup` | POST |
| ✅ | `log-sessions-volume.integration.test.ts` | `/api/log/sessions` | GET |
| ✅ | `log-set.integration.test.ts` | `/api/log/set` | POST |
| ✅ | `log-set.integration.test.ts` | `/api/log/set` | DELETE |
| ✅ | `log-set.integration.test.ts` | `/api/log/set` | PATCH |
| ✅ | `log-sessions-volume.integration.test.ts` | `/api/log/volume` | GET |
| ✅ | `programmes.integration.test.ts` | `/api/programmes` | GET, POST |
| ✅ | `programmes.integration.test.ts` | `/api/programmes/[id]` | GET |
| ✅ | `programmes.integration.test.ts` | `/api/programmes/[id]/workouts` | POST |
| ✅ | `workout-exercises.integration.test.ts` | `/api/programmes/[id]/workouts/[id]/details` | GET |
| ✅ | `workout-exercises.integration.test.ts` | `/api/programmes/[id]/workouts/[id]/exercises` | POST |
| ✅ | `workout-exercises.integration.test.ts` | `/api/programmes/[id]/workouts/[id]/exercises/[metadataId]` | PATCH |
| ✅ | `workout-exercises.integration.test.ts` | `/api/workouts` | GET |
| ✅ | `analytics.integration.test.ts` | `/api/analytics/query` | POST |
| ✅ | `analytics.integration.test.ts` | `/api/analytics/fatigue` | GET |
| ✅ | `analytics.integration.test.ts` | `/api/analytics/session-volume` | GET |

## Result: 118/118 ✅ (8 files, 6.76s)
