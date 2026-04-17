# AGENTS.md

> Orientation guide for AI coding agents. Read this first before exploring the codebase.

## Project Overview

**Workout Tracker** — a full-stack **Next.js 16** PWA for logging workouts, managing training programmes, tracking personal records, and viewing analytics. Single-user focus, mobile-first design, deployed on Vercel with a Supabase PostgreSQL backend.

## Tech Stack

| Layer         | Technology                                              |
| ------------- | ------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, React 19, React Compiler)      |
| Language      | TypeScript 5 (strict mode)                              |
| Styling       | Tailwind CSS 4 (custom design tokens in `globals.css`)  |
| Database      | PostgreSQL via Supabase                                 |
| ORM           | Prisma 7 (`@prisma/adapter-pg` for PgBouncer pooling)  |
| Auth          | NextAuth v5 (credentials provider, JWT sessions)        |
| Data fetching | TanStack Query 5 (persisted to IndexedDB via idb-keyval)|
| Icons         | lucide-react                                            |
| Charts        | recharts                                                |
| Testing       | Vitest 4, Testing Library, MSW                          |
| Linting       | ESLint 9, `import/no-cycle`, React Compiler plugin      |
| Package Mgr   | pnpm 10                                                 |

## Commands

```bash
pnpm dev                # Start dev server
pnpm build              # Production build
pnpm lint               # ESLint
pnpm test:api           # Integration tests (sequential, real DB)
pnpm test:api:watch     # Integration tests in watch mode
pnpm test:ui            # UI component tests (jsdom)
pnpm test:ui:watch      # UI tests in watch mode
pnpm test:cycles        # Detect circular imports via madge
pnpm seed               # Seed user data (reads .env)
```

## Directory Structure

```
workout/
├── app/                        # Next.js App Router root
│   ├── (home)/page.tsx         # Landing / home route
│   ├── api/                    # API route handlers (see "API Routes" below)
│   ├── components/             # Shared UI components
│   │   ├── providers/          # QueryProvider (TanStack Query + IndexedDB persistence)
│   │   └── ui/                 # Primitives: Button, PageShell, List, FAB, BottomDrawer, etc.
│   ├── features/               # Feature modules (see "Feature Module Structure" below)
│   ├── hooks/                  # App-level hooks (currently empty, prefer feature-local hooks)
│   ├── generated/prisma/       # Prisma generated client (do NOT edit)
│   ├── globals.css             # Design tokens, animations, elevation system
│   ├── layout.tsx              # Root layout with provider tree
│   ├── dashboard/              # Dashboard page route
│   ├── exercises/              # Exercise list + create routes
│   ├── log/                    # Workout logging route
│   ├── login/ & signup/        # Auth routes
│   ├── programmes/             # Programme and workout CRUD routes
│   └── settings/               # Settings + feedback routes
├── lib/                        # Shared server utilities
│   ├── prisma.ts               # Prisma client singleton (globalThis guard for HMR)
│   ├── auth-helpers.ts         # requireUserId() / getUserId() — session extraction
│   └── pr-utils.ts             # Personal record detection logic
├── prisma/
│   ├── schema.prisma           # Database schema (source of truth for data model)
│   └── migrations/             # Prisma migration history
├── prisma.config.ts            # Prisma CLI config (DIRECT_URL for migrations)
├── auth.ts                     # NextAuth configuration (credentials, JWT, callbacks)
├── scripts/                    # One-off scripts (seeding, analytics view creation, etc.)
├── tests/
│   ├── setup.ts                # Shared test setup (mocks auth/navigation, DB cleanup)
│   ├── api/                    # API route unit tests
│   ├── integration/            # Integration tests (real DB, sequential)
│   └── ui/                     # UI component tests
├── docs/                       # Planning docs, UI testing guide
└── src/                        # Legacy source dir (currently empty subdirs, not in use)
```

## Feature Module Structure

Each feature lives under `app/features/<name>/` and follows this internal layout:

```
app/features/<name>/
├── api/
│   ├── query-keys.ts           # TanStack Query key factory
│   ├── mutations.ts            # Plain fetch-based mutation functions
│   ├── query-hooks/            # useQuery wrapper hooks (e.g., use-programmes.ts)
│   └── mutation-hooks/         # useMutation wrapper hooks (e.g., use-create-workout.ts)
├── screens/                    # Screen-level components rendered by page routes
│   ├── <screen-name>/          # One folder per screen
│   │   ├── index.ts            # Barrel export
│   │   └── *.tsx               # Screen + its local sub-components
├── context/                    # React context providers (if the feature needs shared state)
├── ui/                         # Feature-specific presentational components
├── types.ts                    # Feature-local TypeScript types
├── __tests__/                  # Feature-level tests
├── index.ts                    # Public barrel export (the feature's external API)
└── internal.ts                 # Internal barrel (exports only for root layout, not for sibling features)
```

### Current Features

| Feature           | Path                          | Purpose                                     |
| ----------------- | ----------------------------- | ------------------------------------------- |
| programs          | `features/programs/`          | Programme & workout CRUD, workout list       |
| workouts          | `features/workouts/`          | Workout creation, session management         |
| logging           | `features/logging/`           | Set logging during active sessions           |
| exercises         | `features/exercises/`         | Exercise library CRUD                        |
| analytics         | `features/analytics/`         | Charts, heatmaps, volume tracking            |
| rest-timer        | `features/rest-timer/`        | Countdown timer with overlay/bubble/header   |
| personal-records  | `features/personal-records/`  | PR detection and celebration overlay          |
| page-header       | `features/page-header/`       | Dynamic page header with injectable actions  |
| dashboard         | `features/dashboard/`         | Home dashboard (recent sessions, stats)      |
| settings          | `features/settings/`          | App settings, feedback submission            |

## Key Architectural Patterns

### Page Routes are Thin Wrappers

Page files (`app/<route>/page.tsx`) are minimal — they extract params and delegate to a screen component from `features/`:

```tsx
// app/programmes/[programmeId]/page.tsx
"use client";
import { WorkoutListContent } from "@/app/features/programs/screens";

export default function WorkoutListPage({ params }: PageProps) {
    const { programmeId } = use(params);
    return <WorkoutListContent programmeId={programmeId} />;
}
```

### API Route Pattern

All API routes live in `app/api/` and follow this structure:

1. Authenticate via `getUserId()` from `@/lib/auth-helpers` (returns `null` → 401) or `auth()` from `@/auth` directly.
2. Validate input manually (no validation library — just inline checks).
3. Use `prisma` from `@/lib/prisma` for DB operations.
4. Return `NextResponse.json(...)` with appropriate status codes.
5. Wrap in try/catch, log errors with `console.error("[ROUTE_NAME_ERROR]:", error)`.
6. Use `prisma.$transaction()` for multi-step mutations.
7. Some POST routes accept a client-generated `id` for idempotency.

### Data Fetching Pattern (Client)

```
query-keys.ts  →  query-hooks/use-*.ts  →  Screen component
mutations.ts   →  mutation-hooks/use-*.ts  →  Screen component
```

- **Query keys**: Factory objects (e.g., `workoutKeys.list(programmeId)`).
- **Query hooks**: Thin `useQuery` wrappers. Fetch from `/api/...` endpoints. Type the response inline.
- **Mutation functions**: Plain `async` functions that call `fetch()`. Client-generated IDs via `crypto.randomUUID()`.
- **Mutation hooks**: `useMutation` wrappers that call mutation functions and invalidate related query keys on success.

### Query Persistence

TanStack Query cache is persisted to **IndexedDB** (via `idb-keyval`) with a 1-week TTL. The `QueryProvider` uses `PersistQueryClientProvider` and resumes paused mutations on rehydration. Mutations use `networkMode: 'offlineFirst'`.

### Provider Tree (Root Layout)

```
ThemeProvider → SessionProvider → QueryProvider → PageHeaderStatusProvider
  → PageHeaderActionsProvider → RestTimerProvider → PRCelebrationProvider
    → BottomDrawerProvider → {children}
```

### Barrel Export Convention

- `index.ts` — Public API of a feature. Sibling features import from here.
- `internal.ts` — Exports that are only consumed by the root layout (e.g., context providers). Not for cross-feature imports.

### Public UI Components (`app/components/ui/`)

Import from `@/app/components/ui`:

`PageShell`, `Button`, `FAB`, `BottomNav`, `Sidebar`, `List`, `NumberStepper`, `BottomDrawer`, `CardSkeleton`, `EmptyState`, `MetadataChip`, `MuscleGroupSelector`, `RPESelector`, `Portal`

### PageShell

All pages use `<PageShell>` for consistent layout. Accepts `header`, `size` (`md`/`lg`/`xl`), `spacing`, and `contentClassName`.

### PageHeader

The `<PageHeader>` component supports dynamically injected actions via `PageHeaderActionsProvider`. The rest-timer feature uses `<RestTimerHeaderActionBridge>` to inject a timer pill into the header.

## Data Model (Key Entities)

Defined in `prisma/schema.prisma`. Generated client output is at `app/generated/prisma/`.

```
User
  └── Programme (has_many, is_active flag for current programme)
        └── ProgrammeActivityLog (tracks active periods)
        └── Workout (ordered by order_index)
              └── ExerciseWithMetadata (prescribed sets/reps/tempo/rest, ordered, soft-deleted via is_hidden)
              └── WorkoutSession (logged training sessions)
                    └── SessionExerciseLog (junction: exercise in a session)
                          └── ExerciseLog (individual set: weight, reps, RPE, pr_type)

Exercise (reusable definitions, owned by User, has MuscleGroup enum)

exercise_analytics_view (DB view joining logs with programme/workout/exercise metadata)
```

### Important data model details

- `ExerciseWithMetadata.is_hidden` — soft-delete flag. Always filter with `where: { is_hidden: false }` when displaying active exercises.
- `Programme.is_active` — only one programme per user should be active. Toggle logic uses a `$transaction` to deactivate the old one.
- `ProgrammeActivityLog` — tracks when a programme was active (start_time/end_time). Closed when programme is deactivated.
- `ExerciseLog.pr_type` — nullable string set by PR detection logic during set logging.
- `WorkoutSession.workout_id` — nullable to support ad-hoc sessions.

## Database Connection

- **Runtime**: `DATABASE_URL` → PgBouncer pooled connection (port 6543) via `@prisma/adapter-pg`.
- **Migrations/CLI**: `DIRECT_URL` → direct PostgreSQL (port 5432), configured in `prisma.config.ts`.
- **Prisma client singleton** in `lib/prisma.ts` uses `globalThis` guard to prevent connection exhaustion during HMR.

## Auth

- NextAuth v5 beta with credentials provider (username/password, bcrypt hashing).
- JWT sessions (30-day expiry). User ID stored in `token.id` and surfaced via `session.user.id`.
- `lib/auth-helpers.ts` provides:
  - `requireUserId()` — for Server Components/Actions. Redirects to `/login` if unauthenticated.
  - `getUserId()` — for API routes. Returns `null` if unauthenticated (caller returns 401).

## Styling & Design System

- **Tailwind CSS 4** with custom theme tokens defined in `app/globals.css` under `@theme {}`.
- Dark mode by default, light mode overrides under `.light` class. Toggled via `next-themes`.
- **Fonts**: Outfit (display/headings), Plus Jakarta Sans (body).
- **Color palette**: Accent `#be185d` (pink/rose), semantic colors for success/warning/danger/info, muscle-group-specific colors.
- **Elevation system**: CSS classes `elevation-1` through `elevation-8` with dark/light variants (inset highlight + contact shadow + ambient shadow).
- **Animations**: `slide-up`, `fade-in`, `press`, `check-pop`, `pulse-ring`, `pr-burst`, `pr-slide-in`.

## Testing

### Integration Tests (`pnpm test:api`)

- Config: `vitest.integration.config.ts`
- Run sequentially (`fileParallelism: false`) — DB is truncated between tests.
- Setup in `tests/setup.ts`: mocks `@/auth` and `next/navigation`, truncates all tables via raw SQL before each test.
- Tests hit real API route handlers against a test database (`.env.test`).

### UI Tests (`pnpm test:ui`)

- Config: `vitest.ui.config.ts` (jsdom environment)
- Use Testing Library + vitest.
- Mock `next/navigation` and external services.
- Feature tests co-located in `features/<name>/__tests__/`.

### Circular Import Detection

- `pnpm test:cycles` runs `madge --circular` on the `app/` directory.
- ESLint rule `import/no-cycle` is set to `"error"`.

## Path Alias

`@/` maps to the project root. Configured in `tsconfig.json`:

```json
{ "paths": { "@/*": ["./*"] } }
```

## Environment Variables

- `DATABASE_URL` — PgBouncer pooled connection string.
- `DIRECT_URL` — Direct PostgreSQL connection (for Prisma CLI).
- `AUTH_SECRET` — NextAuth secret.
- `.env.test` — Test-specific overrides.

## Gotchas & Things to Know

1. **Prisma client is generated to `app/generated/prisma/`** — import from `@/app/generated/prisma/client`, not from `@prisma/client` directly.
2. **React Compiler is enabled** (`reactCompiler: true` in `next.config.ts`). Do not add manual `useMemo`/`useCallback` unless the compiler cannot optimize the case.
3. **`src/` directory is vestigial** — all active code is in `app/` and `lib/`. Do not add new code to `src/`.
4. **Next.js 16 params are Promises** — page props use `params: Promise<{...}>` and must be unwrapped with `use(params)` or `await params`.
5. **Offline-first mutations** — `networkMode: 'offlineFirst'` is set globally. Mutations queue when offline and resume on reconnect.
6. **Feature isolation** — cross-feature imports go through barrel `index.ts`. Never import from another feature's internal files directly.
7. **`is_hidden` filtering** — always filter `ExerciseWithMetadata` by `is_hidden: false` in queries to hide soft-deleted exercise assignments.
