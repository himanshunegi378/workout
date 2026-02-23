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

## Project Structure

```
app/
├── components/             ← Global shared
│   ├── ui/                 ← Shadcn-style primitives (import via "@/app/components/ui")
│   │   ├── Button.tsx      ← 4 variants: primary, secondary, ghost, danger
│   │   ├── PageHeader.tsx  ← Sticky glassmorphic header with back nav + action slot
│   │   ├── BottomNav.tsx   ← Fixed bottom tab bar (Programs / Log / Exercises)
│   │   ├── CardSkeleton.tsx← Pulse-animated loading placeholder
│   │   ├── EmptyState.tsx  ← Generic empty state with icon + action slot
│   │   ├── FAB.tsx         ← Floating action button link
│   │   ├── MetadataChip.tsx← Compact sets/reps/rest/tempo display
│   │   ├── MuscleGroupSelector.tsx ← Color-coded selectable chip grid (client)
│   │   ├── muscle-colors.ts← muscle→Tailwind bg class map
│   │   └── index.ts        ← Barrel: export all above
│   ├── SignOutButton.tsx    ← Business logic (uses next-auth/react)
│   └── index.ts            ← Re-exports ui/* + SignOutButton
│
├── (home)/                 ← Route group, serves /
│   ├── page.tsx
│   └── components/
│       ├── ui/GroupCard.tsx
│       ├── ui/GroupsEmptyState.tsx
│       └── WorkoutGroupList.tsx    ← async server component, fetches data
│
├── groups/
│   ├── new/page.tsx        ← Add new program form (client)
│   └── [groupId]/
│       ├── page.tsx
│       ├── components/
│       │   ├── ui/WorkoutCard.tsx
│       │   ├── ui/LoadingHeader.tsx
│       │   └── WorkoutListContent.tsx
│       └── workouts/
│           ├── new/page.tsx ← Add new workout form (client)
│           └── [workoutId]/
│               ├── page.tsx
│               ├── components/
│               │   ├── ui/ExerciseCard.tsx
│               │   ├── ui/LoadingState.tsx
│               │   └── ExerciseListContent.tsx
│               └── exercises/new/
│                   ├── page.tsx ← Auth shell (server)
│                   └── components/AddExerciseClient.tsx
│
├── exercises/
│   ├── page.tsx            ← Exercise list with search + filter
│   ├── components/
│   │   ├── ui/ExerciseListCard.tsx
│   │   ├── ui/MuscleGroupFilter.tsx  ← client, horizontal pill bar
│   │   ├── ExerciseListClient.tsx    ← client, manages filter+search state
│   │   └── ExercisesContent.tsx      ← server, fetches exercises
│   └── new/
│       └── page.tsx        ← Add new exercise form (client component)
│
├── log/
│   ├── page.tsx
│   └── components/
│       ├── ui/SessionCard.tsx
│       ├── ui/ExerciseLogGroup.tsx
│       └── LogContent.tsx
│
├── login/page.tsx          ← Auth: sign in (client component)
├── signup/page.tsx         ← Auth: sign up with auto-login (client component)
├── globals.css             ← @theme design tokens
├── layout.tsx              ← Root layout: fonts + <SessionProvider>
└── api/
    ├── auth/[...nextauth]/route.ts ← NextAuth handler
    ├── auth/signup/route.ts        ← POST: create user
    ├── exercises/route.ts          ← POST: create exercise (global)
    └── groups/
        ├── route.ts                ← POST: create program
        └── [groupId]/workouts/
            ├── route.ts            ← POST: create workout in program
            └── [workoutId]/exercises/route.ts ← POST: link exercise to workout
```

## 3-Layer Component Architecture (ALWAYS follow this)

Every route has three layers:

| Layer | Location | Rules |
|---|---|---|
| **page.tsx** | `app/<route>/page.tsx` | Slim shell only — layout div, `<Suspense>`, layout components. No data fetching, no business logic. ~15–25 lines. |
| **Business logic** | `app/<route>/components/*.tsx` | `async` server components for data fetching + auth. Call `requireUserId()`. Compose dumb UI from `components/ui/`. |
| **Dumb UI** | `app/<route>/components/ui/*.tsx` | Pure presentational — only props → JSX. No imports from `lib/`, `prisma`, or `auth`. |

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

## Mobile-First Rules

- Default single column layout, cards stretch full width
- All touch targets minimum `44px` (`p-2` + icon or `py-3 px-5`)
- Bottom nav: `h-16` fixed, page content gets `pb-20` to clear it
- Use `max-w-lg mx-auto` on content containers
- Always wrap async content in `<Suspense fallback={<CardSkeletonList />}>` — never show blank screens
