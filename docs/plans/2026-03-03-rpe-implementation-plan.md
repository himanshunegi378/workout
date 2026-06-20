# RPE Tracking Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement RPE logging using a horizontal pill selector, persisting to DB and showing in history.

**Architecture:** Extend ExerciseLog model, update API/hooks, and create a shared RPESelector component for logging drawers.

**Tech Stack:** Next.js, Prisma, Tailwind, TanStack Query.

---

### Task 1: Schema and API

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `app/api/log/set/route.ts`
- Modify: `app/features/logging/api/mutation-hooks/use-log-set.ts`

**Step 1: Update Prisma Model**
Add `rpe Float?` to `ExerciseLog`.

**Step 2: Sync DB**
Run: `npx prisma db push`

**Step 3: Update API Handler**
Extract `rpe` (float) from request body and include in DB creation/update.

**Step 4: Update Hook**
Include `rpe` in `useLogSet` mutation and optimistic update.

---

### Task 2: RPESelector Component

**Files:**
- Create: `app/components/ui/RPESelector.tsx`

**Step 1: Implementation**
```tsx
export function RPESelector({ value, onChange }: { value: number | null, onChange: (v: number) => void }) {
  const options = [5, 6, 7, 8, 9, 10];
  // Render horizontal pill flex row with Tailwind
}
```

---

### Task 3: Integration and Display

**Files:**
- Modify: `app/features/workouts/components/ui/LogSetDrawer.tsx`
- Modify: `app/features/logging/components/ui/StandaloneLogDrawer.tsx`
- Modify: `app/features/workouts/components/ui/ExerciseCard.tsx`

**Step 1: Add to Drawers**
Wire up state and component in both logging flows.

**Step 2: Update View**
Render `@ {rpe}` badge in set list items.
```tsx
{log.rpe && <span className="text-xs text-muted-foreground ml-1">@ {log.rpe}</span>}
```
