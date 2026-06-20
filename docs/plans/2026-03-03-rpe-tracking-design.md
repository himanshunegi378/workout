# RPE Tracking Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement RPE (Rate of Perceived Exertion) logging using a horizontal pill-based selector, persisting to the database and showing in workout history.

**Architecture:** Update Prisma schema, extend the logging API/hooks, create a shared `RPESelector` component, and integrate it into both structured workout and ad-hoc logging drawers.

**Tech Stack:** Next.js, Prisma, Tailwind CSS, Lucide React, TanStack Query.

---

### Task 1: Database and API Layer

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `app/api/log/set/route.ts`
- Modify: `app/features/logging/api/mutation-hooks/use-log-set.ts`

**Step 1: Update Prisma Schema**
Add `rpe Float?` to the `ExerciseLog` model.
```prisma
model ExerciseLog {
  id              String   @id @default(cuid())
  weight          Float?
  reps            Int
  set_order_index Int
  rpe             Float?   // Add this line
  date            DateTime @default(now())
  // ...
}
```

**Step 2: Sync Database**
Run: `npx prisma db push`

**Step 3: Update API Route**
Update `app/api/log/set/route.ts` to extract `rpe` from the request body and include it in the `prisma.exerciseLog.upsert` or `create` call.

**Step 4: Update Mutation Hook**
Update `useLogSet` in `app/features/logging/api/mutation-hooks/use-log-set.ts` to accept `rpe` in the input and include it in the optimistic update cache logic.

---

### Task 2: Shared UI - RPESelector

**Files:**
- Create: `app/components/ui/RPESelector.tsx`

**Step 1: Implement Component**
Create a component that renders a horizontal scrollable list of pills (5 to 10).
Use `framer-motion` for subtle scale animations if available, or standard Tailwind transitions.
Selection color: `bg-accent` or a dedicated effort color (e.g., `violet-500`).

---

### Task 3: Drawer Integration

**Files:**
- Modify: `app/features/workouts/components/ui/LogSetDrawer.tsx`
- Modify: `app/features/logging/components/ui/StandaloneLogDrawer.tsx`

**Step 1: Update LogSetDrawer**
Add `rpe` state and integrate `RPESelector` between the Weight/Reps grid and the Save button.

**Step 2: Update StandaloneLogDrawer**
Similarly, update the `LogForm` in `StandaloneLogDrawer.tsx` to handle RPE.

---

### Task 4: Display RPE in History

**Files:**
- Modify: `app/features/logging/components/LogContent.tsx`
- Modify: `app/features/workouts/components/ui/ExerciseCard.tsx`

**Step 1: Update ExerciseCard**
Show the RPE badge (e.g., `RPE 8.5`) in the set list display.

**Step 2: Update LogContent**
Show the RPE in the general training log view.
