# API Integration Test Tracker

Run all: `pnpm test:api`
(Or watch mode: `pnpm test:api:watch`)

## Routes

| Status | File | Route | Methods |
|---|---|---|---|
| ✅ | `backend/test/exercises.e2e.spec.ts` | `/api/exercises` | GET, POST |
| ✅ | `backend/test/exercise-history.e2e.spec.ts` | `/api/exercises/[id]/last-log` | GET |
| ✅ | `backend/test/exercise-history.e2e.spec.ts` | `/api/exercises/logs?exerciseId=...` | GET |
| ✅ | `backend/test/auth-signup.e2e.spec.ts` | `/api/auth/signup` | POST |
| ✅ | `backend/test/sessions.e2e.spec.ts` | `/api/log/sessions` | GET |
| ✅ | `backend/test/sessions.e2e.spec.ts` | `/api/workout-sessions/[sessionId]/finish` | PATCH |
| ✅ | `backend/test/log-set.e2e.spec.ts` | `/api/log/set` | POST |
| ✅ | `backend/test/log-set.e2e.spec.ts` | `/api/log/set` | DELETE |
| ✅ | `backend/test/log-set.e2e.spec.ts` | `/api/log/set` | PATCH |
| ✅ | `backend/test/analytics.e2e.spec.ts` | `/api/log/volume` | GET |
| ✅ | `backend/test/programmes.e2e.spec.ts` | `/api/programmes` | GET, POST |
| ✅ | `backend/test/programmes.e2e.spec.ts` | `/api/programmes/[id]` | GET |
| ✅ | `backend/test/workouts.e2e.spec.ts` | `/api/programmes/[id]/workouts` | POST |
| ✅ | `backend/test/workouts.e2e.spec.ts` | `/api/programmes/[id]/workouts/[id]/details` | GET |
| ✅ | `backend/test/workouts.e2e.spec.ts` | `/api/programmes/[id]/workouts/[id]/exercises` | POST |
| ✅ | `backend/test/workouts.e2e.spec.ts` | `/api/programmes/[id]/workouts/[id]/exercises/[metadataId]` | PATCH |
| ✅ | `backend/test/workouts.e2e.spec.ts` | `/api/workouts` | GET |
| ✅ | `backend/test/analytics.e2e.spec.ts` | `/api/analytics/query` | POST |
| ✅ | `backend/test/analytics.e2e.spec.ts` | `/api/analytics/activity-heatmap` | GET |
| ✅ | `backend/test/analytics.e2e.spec.ts` | `/api/analytics/fatigue` | GET |
| ✅ | `backend/test/analytics.e2e.spec.ts` | `/api/analytics/session-volume` | GET |
| ✅ | `backend/test/feedback.e2e.spec.ts` | `/api/feedback` | GET, POST |

## Result: 80/80 E2E Tests ✅ (9 backend files)
