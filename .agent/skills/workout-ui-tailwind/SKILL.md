---
name: workout-ui-tailwind
description: Build production-grade UI screens for the workout/fitness tracking app using Tailwind CSS v4 and Next.js. Use when creating or modifying any UI component, page, or screen for the workout application — including workout group lists, workout lists, exercise views with metadata, add-exercise forms, exercise log screens, and auth pages (login/signup). Covers the full design system (colors, typography, spacing, animations), 3-layer component architecture, auth-aware data fetching, mobile-first responsive layout, and Prisma data model to UI mapping.
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

Dark-first fitness aesthetic. Deep near-black backgrounds (`#0c0c0e`), vivid purple accent (`#6c5ce7`), per-muscle-group color coding. Rounded cards (`rounded-2xl`), glassmorphic nav bar (`backdrop-blur-xl`), smooth slide-up entry animations.

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
| **Route Page** | `app/<route>/page.tsx` | Thin shell. `<Suspense>` + Feature Components. |
| **Feature Logic** | `app/features/<domain>/components/` | Data fetching (via Prisma or useQuery). Auth checks. Logic orchestration. |
| **Feature UI** | `app/features/<domain>/components/ui/` | Presentational components specific to this domain. |
| **Global UI** | `app/components/ui/` | Shared primitives used everywhere (Button, Header). |

## Data Fetching & State (TanStack Query)

EVERY client-side interaction (mutations, secondary fetches) MUST use the TanStack Query architecture in the feature's `api/` folder.

1. **Query Keys**: Centralize keys in `query-keys.ts` to ensure consistent cache invalidation.
2. **Standard Invalidation**: Mutations MUST invalidate related queries via `onSuccess`.
3. **"Use Client" Discipline**: Any component containing a React Query hook (e.g. `usePrograms`, `useLogSet`) or local state MUST have `"use client"` at the top. Failure to do so is a common cause of build errors.

```tsx
// Example Mutation Hook (app/features/logging/api/mutation-hooks/use-log-set.ts)
export function useLogSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logSet,
    onSuccess: (_, variables) => {
      // Invalidate both local workout view AND global history
      queryClient.invalidateQueries({ queryKey: workoutKeys.detail(variables.workoutId) });
      queryClient.invalidateQueries({ queryKey: logKeys.lists() });
    },
  });
}
```

```tsx
// page.tsx — thin shell
export default function MyPage() {
  return (
    <div className="min-h-screen pb-20">
      <PageHeader title="My Page" />
      <main className="max-w-lg mx-auto px-4 py-4">
        <Suspense fallback={<CardSkeletonList count={4} />}>
          <MyContent />              {/* business logic */}
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
}

// components/MyContent.tsx — business logic
export async function MyContent() {
  const userId = await requireUserId();   // redirects to /login if not authed
  const data = await prisma.foo.findMany({ where: { user_id: userId } });
  return data.map(item => <MyCard key={item.id} {...item} />);
}

// components/ui/MyCard.tsx — dumb
export function MyCard({ name, ... }: Props) { return <div>...</div>; }
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
- Always wrap async content in `<Suspense fallback={<CardSkeletonList />}>` — never show blank screens
