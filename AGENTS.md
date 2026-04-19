# AGENTS.md
> Read this before exploring the codebase.

## Project
Workout Tracker is a single-user, mobile-first full-stack Next.js 16 PWA for workout logging, programmes, PRs, and analytics. It is deployed on Vercel with a Supabase PostgreSQL backend.

## Stack
- Framework: Next.js 16 App Router, React 19, React Compiler
- Language: TypeScript 5 strict mode
- Styling: Tailwind CSS 4 with tokens in `app/globals.css`
- Data: PostgreSQL via Supabase, Prisma 7, `@prisma/adapter-pg`
- Auth: NextAuth v5 credentials + JWT sessions
- Client data: TanStack Query 5 persisted to IndexedDB via `idb-keyval`
- UI/libs: `lucide-react`, `recharts`
- Testing: Vitest 4, Testing Library, MSW
- Linting/package manager: ESLint 9, `import/no-cycle`, pnpm 10

## Commands
```bash
pnpm dev
pnpm build
pnpm lint
pnpm test:api
pnpm test:api:watch
pnpm test:ui
pnpm test:ui:watch
pnpm test:cycles
pnpm seed
```

## Structure
- Active code is in `app/` and `lib/`. Do not add new code to `src/`.
- `app/api/`: API route handlers
- `app/components/ui/`: shared UI primitives; import from `@/app/components/ui`
- `app/features/<name>/`: feature modules with `api/`, `screens/`, `context/`, `ui/`, `types.ts`, `__tests__/`, `index.ts`, `internal.ts`
- `app/generated/prisma/`: generated Prisma client, do not edit
- `lib/`: shared server utilities such as `prisma.ts`, `auth-helpers.ts`, `pr-utils.ts`
- `prisma/schema.prisma`: source of truth for the data model
- `tests/`: API, integration, and UI tests

## Feature Rules
- Cross-feature imports must go through a feature's public `index.ts`.
- `internal.ts` exports are for the root layout only, not sibling features.
- Prefer feature-local hooks over `app/hooks/`.
- Current features: programs, workouts, logging, exercises, analytics, rest-timer, personal-records, page-header, dashboard, settings.

## Routing And Data
- Page routes should stay thin: unwrap params and render a screen from `app/features/...`.
- Next.js 16 page `params` are Promises; unwrap with `use(params)` or `await`.
- Client data flow: `query-keys.ts -> query-hooks/use-*.ts -> screen`, and `mutations.ts -> mutation-hooks/use-*.ts -> screen`.
- Query hooks are thin `useQuery` wrappers around `/api/...` endpoints.
- Mutation functions are plain `fetch()` calls; some use client-generated IDs via `crypto.randomUUID()`.
- TanStack Query persistence is offline-first and stored in IndexedDB for one week.

## API Pattern
1. Authenticate with `getUserId()` from `@/lib/auth-helpers` or `auth()` from `@/auth`.
2. Validate inputs inline; there is no validation library.
3. Use `prisma` from `@/lib/prisma`.
4. Return `NextResponse.json(...)` with correct status codes.
5. Wrap handlers in `try/catch` and log `console.error("[ROUTE_NAME_ERROR]:", error)`.
6. Use `prisma.$transaction()` for multi-step mutations.
7. Some POST routes accept a client-generated `id` for idempotency.

## Providers And UI
- Root provider order: `ThemeProvider -> SessionProvider -> QueryProvider -> PageHeaderStatusProvider -> PageHeaderActionsProvider -> RestTimerProvider -> PRCelebrationProvider -> BottomDrawerProvider`.
- All pages use `<PageShell>` for layout.
- `<PageHeader>` supports injected actions through `PageHeaderActionsProvider`.
- Common shared UI includes `PageShell`, `Button`, `FAB`, `BottomNav`, `Sidebar`, `List`, `NumberStepper`, `BottomDrawer`, `CardSkeleton`, `EmptyState`, `MetadataChip`, `MuscleGroupSelector`, `RPESelector`, `Portal`.

## Data Model Notes
- Main entities: `User -> Programme -> Workout -> ExerciseWithMetadata / WorkoutSession -> SessionExerciseLog -> ExerciseLog`, plus reusable `Exercise`.
- `ExerciseWithMetadata.is_hidden` is a soft-delete flag; always query active assignments with `where: { is_hidden: false }`.
- Only one `Programme.is_active` should exist per user; toggles use a transaction.
- `ProgrammeActivityLog` tracks programme active periods.
- `ExerciseLog.pr_type` stores detected PR types.
- `WorkoutSession.workout_id` can be null for ad-hoc sessions.
- `exercise_analytics_view` joins logs with programme, workout, and exercise metadata.

## DB And Auth
- Runtime DB uses `DATABASE_URL` through PgBouncer; migrations use `DIRECT_URL` through direct PostgreSQL in `prisma.config.ts`.
- Import Prisma from `@/app/generated/prisma/client`, not `@prisma/client`.
- `lib/prisma.ts` uses a `globalThis` guard to avoid HMR connection exhaustion.
- NextAuth stores the user ID in `token.id` and exposes it as `session.user.id`.
- `requireUserId()` redirects unauthenticated users; `getUserId()` returns `null` for API routes.

## Styling And Testing
- Dark mode is default; light mode overrides use `.light` with `next-themes`.
- Fonts are Outfit for display and Plus Jakarta Sans for body.
- Accent color is `#be185d`; elevation and animation tokens live in `app/globals.css`.
- `pnpm test:api` runs sequential integration tests against a real test DB using `.env.test`.
- `tests/setup.ts` mocks auth/navigation and truncates tables between integration tests.
- `pnpm test:ui` uses jsdom and Testing Library.
- `pnpm test:cycles` checks circular imports in `app/`.

## Commenting Expectations
- Add a short jsdoc description above every new function and component.
- Add comments where the why, constraint, or edge case is not obvious.
- Keep comments high-signal and avoid narrating code line by line.
