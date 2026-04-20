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
- UI/libs: `lucide-react`, `recharts`, `framer-motion`
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
- `lib/`: shared utilities (server/client) such as `prisma.ts`, `utils.ts` (cn), `auth-helpers.ts`, `pr-utils.ts`
- `prisma/schema.prisma`: source of truth for the data model
- `tests/`: API, integration, and UI tests

## Feature Rules
- Cross-feature imports must go through a feature's public `index.ts`.
- **Deep imports into feature subfolders (e.g. `feature/api/...`) are strictly forbidden.**
- `internal.ts` exports are for the root layout only, not sibling features.
- Prefer feature-local hooks over `app/hooks/`.
- Current features: programs, workouts, logging, exercises, analytics, rest-timer, personal-records, page-header, dashboard, settings.
- **Ownership**: All set logging and exercise history logic belongs to the `logging` feature. The `workouts` feature coordinates the training session but uses `logging` for data persistence.

## Routing And Data
Page routes should stay thin: unwrap params and render a screen from `app/features/...`. 
> [!NOTE]
> See KI **Client Data Flow & State Management** for details on unwrap patterns, TanStack Query persistence, and offline-first logic.

## API Pattern
All API routes in `app/api/` must follow the standardized auth, validation, and transaction workflow.
> [!NOTE]
> See KI **API Implementation Standards** for the mandatory 8-step checklist and example pattern.

## Providers And UI
The root layout uses a specific provider sequence to manage theme, auth, and state.
> [!NOTE]
> See KI **UI Component Library & Layout Shell** for the provider hierarchy and primitive component catalog.

## Data Model Notes
 Nuances regarding soft-deletes (`is_hidden`), active programme toggles, and PR detection logic are critical for data integrity.
> [!NOTE]
> See KI **Core Data Schema & Behaviors** for logical behaviors not obvious from the Prisma schema.

## DB And Auth
NextAuth v5 and Prisma lifecycle guards are managed via centralized helpers and global singletons.
> [!NOTE]
> See KI **Auth Integration & DB Connection Lifecycle** for connection guards (HMR) and session token mappings.

## Styling And Testing
- Dark mode is default; light mode overrides use `.light` with `next-themes`.
- Fonts are Outfit for display and Plus Jakarta Sans for body.
- Accent color is `#be185d`; elevation and animation tokens live in `app/globals.css`.
- Use `framer-motion` for all UI animations, layout transitions, and interactive states. Prefer `AnimatePresence` for exit animations.
- `pnpm test:api` runs sequential integration tests against a real test DB using `.env.test`.
- `tests/setup.ts` mocks auth/navigation and truncates tables between integration tests.
- `pnpm test:ui` uses jsdom and Testing Library.
- `pnpm test:cycles` checks circular imports in `app/`.

## Review Standards
All code reviews must evaluate changes against the [Code Review Pattern](docs/patterns/code-review.md)

## Search and Research
- When searching with `grep`, always exclude `.next/`, `.git/`, and `node_modules/` to avoid massive amounts of generated or binary content.
- Use `grep -r "pattern" . --exclude-dir={.next,.git,node_modules}` or target specific source directories like `app/` and `lib/`.

## Commenting Expectations
- Add a short jsdoc description above every new function and component.
- Add comments where the why, constraint, or edge case is not obvious.
- Keep comments high-signal and avoid narrating code line by line.
