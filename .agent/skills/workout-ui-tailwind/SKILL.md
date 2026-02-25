---
name: workout-ui-tailwind
description: Build production-grade UI screens for the workout/fitness tracking app using Tailwind CSS v4 and Next.js. Use when creating or modifying any UI component, page, or screen for the workout application — including workout group lists, workout lists, exercise views with metadata, add-exercise forms, exercise log screens, and auth pages (login/signup). Covers the full design system (colors, typography, spacing, animations), 4-layer component architecture, Server Actions + React Query data fetching pattern, mobile-first responsive layout, Prisma select best practices, and UX rules (e.g. loading states must always show PageHeader).
---

# Workout UI with Tailwind CSS

Build mobile-first, dark-themed UI for the workout health application using **Tailwind CSS v4** and **Next.js App Router** with **TypeScript**.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React Server Components + Client Components)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` config in `app/globals.css`)
- **Database ORM:** Prisma v7 (PostgreSQL via Supabase). **Import types from `@/app/generated/prisma/client`** — NOT from `@prisma/client` (v7 generates locally).
- **Auth:** NextAuth.js v5 (beta) with Credentials provider + JWT sessions. Config at `auth.ts`.
- **Icons:** Lucide React (`lucide-react`)
- **Fonts:** Outfit (display) + Plus Jakarta Sans (body) via `next/font/google`
- **Script runner:** `tsx` (devDependency) — run scripts with `pnpm exec tsx --env-file=.env scripts/foo.ts`

## Design Direction

Dark-first fitness aesthetic. Deep near-black backgrounds (`#0c0c0e`), vivid pink accent (`#ec4899`), per-muscle-group color coding. Rounded cards (`rounded-2xl`), glassmorphic nav bar (`backdrop-blur-xl`), smooth slide-up entry animations.

Color theming uses **background / foreground** token pairs (e.g. `--color-card` / `--color-card-foreground`). See **[references/design-system.md](references/design-system.md)** for the full palette, typography scale, spacing rules, animations, and `@theme` block.

## Project Structure (Feature-First)

The application follows a **Domain-Driven Feature Folder** pattern. Most business logic and state management resides in `app/features/`.

```
app/
├── components/             ← Global shared primitives
│   └── ui/                 ← Button, PageHeader, BottomNav, etc.
│
├── features/               ← Domain-specific logic
│   └── [domain]/           ← e.g. programs, workouts, exercises, logging
│       ├── api/            ← TanStack Query API Layer
│       │   ├── query-keys.ts    ← Centralized cache keys
│       │   ├── queries.ts       ← fetch functions (client/server-safe)
│       │   ├── mutations.ts     ← POST/PATCH/DELETE functions
│       │   ├── query-hooks/     ← Custom wrapper hooks (useQuery)
│       │   └── mutation-hooks/  ← Custom wrapper hooks (useMutation)
│       ├── components/          ← Domain business logic (Server/Client)
│       └── components/ui/       ← Domain-specific dumb UI
│
├── (home)/                 ← Routes are mostly thin shells
├── groups/ [groupId]/ ...
├── exercises/
└── log/
```

## 4-Layer Component Architecture (REVISED)

| Layer | Location | Rules |
|---|---|---|
| **Route Page** | `app/<route>/page.tsx` | Thin shell. Renders Feature Components. |
| **Feature Logic** | `app/features/<domain>/components/` | `"use client"` components using React Query hooks for data fetching. |
| **Feature UI** | `app/features/<domain>/components/ui/` | Presentational components specific to this domain. |
| **Global UI** | `app/components/ui/` | Shared primitives used everywhere (Button, Header). |

## Data Fetching & State (TanStack Query + Server Actions)

ALL data fetching MUST use `"use server"` actions called via React Query hooks. **Do NOT use direct Prisma calls in components.**

### Architecture
1. **Server Actions** (`api/queries.ts`): `"use server"` functions that call Prisma with `select` (not `include`).
2. **Query Hooks** (`api/query-hooks/`): Thin `useQuery` wrappers calling server actions.
3. **Query Keys** (`api/query-keys.ts`): Centralized cache keys for invalidation.
4. **Mutations** (`api/mutations.ts` + `mutation-hooks/`): `useMutation` wrappers that invalidate related queries.

```tsx
// api/queries.ts — Server Action
"use server";
import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
export async function getItems() {
  const userId = await requireUserId();
  return prisma.item.findMany({
    where: { user_id: userId },
    select: { id: true, name: true }, // Always use select, not include
  });
}

// api/query-hooks/use-items.ts — React Query Hook
"use client";
import { useQuery } from "@tanstack/react-query";
import { itemKeys } from "../query-keys";
import { getItems } from "../queries";
export function useItems() {
  return useQuery({ queryKey: itemKeys.lists(), queryFn: () => getItems() });
}

// components/ItemsContent.tsx — Client Component
"use client";
export function ItemsContent() {
  const { data, isLoading, isError } = useItems();
  if (isLoading) return <LoadingWithHeader />;
  // ... render data
}
```

## Auth

- **`requireUserId()`** — server components/actions. Returns `string` user ID or redirects to `/login`.
- **`getUserId()`** — API routes. Returns `string | null` (no redirect).
- Both live in `lib/auth-helpers.ts`.
- **Every** Prisma query that returns user-owned data MUST include `where: { user_id: userId }`.
- Route protection via `proxy.ts` (Next.js 16 proxy — replaces middleware.ts).

## Key Tailwind Patterns

### Muscle Group Color Mapping
Never generate dynamic Tailwind classes. Always use the centralized map:
```tsx
import { muscleColorMap } from "@/app/components/ui";
const colorClass = muscleColorMap[muscleGroup] ?? "bg-accent";
```

### Staggered Entry Animation
```tsx
{items.map((item, i) => (
  <div key={item.id} className="animate-slide-up"
       style={{ animationDelay: `${i * 60}ms` }}>
    <Card {...item} />
  </div>
))}
```

### Card
```
bg-card text-card-foreground rounded-2xl p-4 border border-border
hover:border-accent/40 transition-all duration-300 active:animate-press
```

### Portals for Fixed Elements
When rendering fixed `z-50` overlays (like Modals, Drawers, or Rest Timers) that are invoked from *inside* animated containers (e.g., inside an `animate-slide-up` card), you MUST wrap the overlay content in a `<Portal>` component (`@/app/components/ui/Portal`). 
Without a Portal, the parent's CSS animation or transform creates a new stacking context, trapping the fixed element inside the card instead of letting it render relative to the viewport.

### Input
```
bg-muted border border-border rounded-xl px-4 py-3
text-foreground placeholder:text-muted-foreground/50
focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent
transition-all duration-200
```

## Implementation Patterns

### Contextual "Lazy" Data Creation
When saving user logs (e.g., tracking a completed set), avoid forcing the user to explicitly "Start Workout". Instead, use lazy creation on the backend:
1. When `POST /api/log/set` is hit, check for an existing `WorkoutSession` for today's date and that specific `workoutGroupId`.
2. If none exists, create the session instantly inline before creating the `ExerciseLog`.
3. This creates a seamless UI where logging the first set silently starts the workout on the backend.

### Hydrating Persistent UI State
If a frontend component (like a visual Set Tracker) needs to maintain state across page reloads:
1. Use a Server Component (`ExerciseListContent.tsx`) to fetch the active daily `WorkoutSession` and all its `exerciseLogs`.
2. Group the logs by their related entity ID natively on the server.
3. Pass the array of completed indices down to the Client Component (`ExerciseCard.tsx`) as an `initialCompletedSets` prop. 
4. The Client Component uses this to seed its `useState` hook, allowing optimistic updates when the user clicks, while guaranteeing persistence on hard refresh.

## Prisma Gotchas

- **Prefer `select` over `include`:** Always use `select` to fetch only the fields the UI needs. Avoid `include` which fetches entire related models and bloats server action payloads. This also improves performance and data privacy.
- **Enum types:** Always import and use Prisma enum types — never pass plain strings. Example:
  ```ts
  import { MuscleGroup } from "@/app/generated/prisma/client";
  muscle_group: MuscleGroup.Chest   // ✅
  muscle_group: "Chest"             // ❌ TypeScript error on build
  ```
- **Complex Nested OR Queries:** When looking for logs that could be tied to an underlying `Exercise` OR a specific `ExerciseWithMetadata`, use Prisma's nested relational queries inside the OR block:
  ```ts
  where: {
      OR: [
          { exercise_id: exerciseId },
          { exerciseWithMetadata: { exercise_id: exerciseId } }
      ]
  }
  ```
- **Stale dev server cache:** After `prisma generate`, restart `pnpm dev`. The `globalThis.prismaGlobal` singleton caches the old client and won't pick up new models until restart.
- **Prisma client path:** Import from `@/app/generated/prisma/client`, not `@prisma/client`.

## Next.js App Router Gotchas

- **Route Params are Promises:** In Next.js 15+, dynamic route parameters (like `params` and `searchParams`) must be awaited or unwrapped.
  - *Server Components / API Routes:* Use `await params` (e.g. `const { groupId } = await params;`).
  - *Client Components:* Use `React.use()` to unwrap the promise (e.g. `const { groupId } = use(params);`).

- **Client Component Discipline (CRITICAL):**
  - When extracting a form or interactive element (using `useState`, `useEffect`, `useRouter`, or any TanStack Query hook) into a feature component, you **MUST** add `"use client"` at the very first line of the file.
  - If a file has one of these hooks but is imported into a Server Component without this directive, the build will fail.
  - **Checklist before extraction:**
    1. Does the component use a hook? -> Add `"use client"`.
    2. Are all imports (Lucide, UI primitives) restored? -> Refactoring often accidentally strips standard imports.
    3. Is the export named or default? -> Feature components typically use **named exports** (e.g., `export function AddWorkoutForm()`).

## Mobile-First Rules

- Default single column layout, cards stretch full width
- All touch targets minimum `44px` (`p-2` + icon or `py-3 px-5`)
- Bottom nav: `h-16` fixed, page content gets `pb-20` to clear it
- Use `max-w-lg mx-auto` on content containers
- **Loading states MUST include `PageHeader`:** When a page is loading data via React Query, the loading state must ALWAYS render the `<PageHeader>` with the back button and a placeholder title (e.g., "Loading..."). Never show a blank screen without navigation context — the user must always be able to navigate back.
  ```tsx
  if (isLoading) {
    return (
      <>
        <PageHeader title="Loading..." backHref="/" />
        <div className="min-h-screen flex flex-col pt-24 items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </>
    );
  }
  ```
