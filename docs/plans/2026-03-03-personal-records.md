# Personal Records (PRs) Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Auto-detect when a user logs a new all-time personal record (max weight, max reps, or estimated 1RM) and celebrate it with a beautiful non-blocking animation.

**Architecture:**
- PR detection runs **server-side** inside `POST /api/log/set` — query historical max values for the exercise, compare against the new set, and return a `pr` field in the response.
- A pure utility module (`lib/pr-utils.ts`) holds the Epley 1RM formula and comparison logic, making it fully testable.
- A `PRCelebrationContext` (React context) holds app-wide PR state; a `PRCelebrationOverlay` component renders the animation; both are wired into the root layout.
- Celebration is triggered from `ExerciseCard.handleSaveSet` and `StandaloneLogDrawer.handleSubmit` via their `onSuccess` callbacks.

**Tech Stack:** Next.js App Router, Prisma, React, Tailwind CSS (via project CSS vars), Vitest (unit tests)

---

## Task 1: Pure Utility Module — 1RM Formula & PR Types

**Files:**
- Create: `lib/pr-utils.ts`
- Create: `lib/pr-utils.test.ts`

### Step 1: Write the failing tests

```typescript
// lib/pr-utils.test.ts
import { describe, it, expect } from "vitest";
import { epley1RM, detectPR, type PRType } from "./pr-utils";

describe("epley1RM", () => {
  it("returns weight for 1 rep", () => {
    expect(epley1RM(100, 1)).toBe(100);
  });

  it("estimates 1RM correctly for multiple reps", () => {
    // 100kg x 5 reps -> 100 * (1 + 5/30) ~= 116.67
    expect(epley1RM(100, 5)).toBeCloseTo(116.67, 1);
  });

  it("returns 0 when weight is null or 0", () => {
    expect(epley1RM(null, 10)).toBe(0);
    expect(epley1RM(0, 10)).toBe(0);
  });
});

describe("detectPR", () => {
  it("returns null when no historical bests exist", () => {
    expect(detectPR({ weight: 100, reps: 5, bestWeight: null, bestReps: null })).toBeNull();
  });

  it("detects max weight PR", () => {
    expect(detectPR({ weight: 110, reps: 5, bestWeight: 100, bestReps: 5 })).toBe("weight");
  });

  it("detects max reps PR (same weight)", () => {
    expect(detectPR({ weight: 100, reps: 8, bestWeight: 100, bestReps: 5 })).toBe("reps");
  });

  it("detects estimated 1RM PR", () => {
    // Current: 80kg x 15 -> ~120 1RM. Best: 100kg x 3 -> ~110 1RM
    expect(detectPR({ weight: 80, reps: 15, bestWeight: 100, bestReps: 3 })).toBe("estimated_1rm");
  });

  it("returns null when not a PR", () => {
    expect(detectPR({ weight: 90, reps: 5, bestWeight: 100, bestReps: 8 })).toBeNull();
  });
});
```

### Step 2: Run tests to verify they fail

```bash
pnpm vitest run lib/pr-utils.test.ts
```
Expected: FAIL with "Cannot find module './pr-utils'"

### Step 3: Write the implementation

```typescript
// lib/pr-utils.ts

export type PRType = "weight" | "reps" | "estimated_1rm";

/**
 * Epley formula for estimating 1-Rep Max.
 * Returns 0 if weight is null, 0, or reps is 0.
 */
export function epley1RM(weight: number | null, reps: number): number {
  if (!weight || weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

interface PRCheckInput {
  weight: number | null;
  reps: number;
  bestWeight: number | null; // historical all-time max weight for this exercise
  bestReps: number | null;   // historical all-time max reps for this exercise (any weight)
}

/**
 * Returns the type of PR set, or null if it is not a PR.
 * Priority: weight > reps > estimated_1rm
 */
export function detectPR(input: PRCheckInput): PRType | null {
  const { weight, reps, bestWeight, bestReps } = input;

  // No history -> not a PR (first set ever is not celebrated to avoid false positives)
  if (bestWeight === null && bestReps === null) return null;

  // 1. Max weight PR
  if (weight !== null && weight > 0 && (bestWeight === null || weight > bestWeight)) {
    return "weight";
  }

  // 2. Max reps PR (at any weight)
  if (bestReps === null || reps > bestReps) {
    return "reps";
  }

  // 3. Estimated 1RM PR
  const currentEst = epley1RM(weight, reps);
  const bestEst = epley1RM(bestWeight, bestReps ?? 1);
  if (currentEst > 0 && currentEst > bestEst) {
    return "estimated_1rm";
  }

  return null;
}
```

### Step 4: Run tests to verify they pass

```bash
pnpm vitest run lib/pr-utils.test.ts
```
Expected: PASS (5/5)

### Step 5: Commit

```bash
git add lib/pr-utils.ts lib/pr-utils.test.ts
git commit -m "feat(pr): add pure utility for 1RM estimation and PR detection"
```

---

## Task 2: Extend POST /api/log/set to Return PR Info

**Files:**
- Modify: `app/api/log/set/route.ts`

### Step 1: Modify the POST handler

Add the import at the top of `app/api/log/set/route.ts`:

```typescript
import { detectPR } from "@/lib/pr-utils";
```

After the `$transaction` block that creates `exerciseLog`, replace the final `return NextResponse.json(exerciseLog, { status: 201 });` with:

```typescript
// --- PR Detection ---
// Query historical best weight and best reps for this exercise, excluding the log just created
let prType = null;
if (exerciseId) {
  const historicalBest = await prisma.exerciseLog.aggregate({
    _max: { weight: true, reps: true },
    where: {
      user_id: userId,
      id: { not: exerciseLog.id },
      OR: [
        { exerciseId: exerciseId },
        {
          sessionExerciseLog: {
            exerciseWithMetadata: {
              exercise_id: exerciseId,
            },
          },
        },
      ],
    },
  });

  prType = detectPR({
    weight: exerciseLog.weight,
    reps: exerciseLog.reps,
    bestWeight: historicalBest._max.weight ?? null,
    bestReps: historicalBest._max.reps ?? null,
  });
}

return NextResponse.json({ ...exerciseLog, pr: prType }, { status: 201 });
```

### Step 2: Commit

```bash
git add app/api/log/set/route.ts
git commit -m "feat(pr): detect and return PR type in POST /api/log/set response"
```

---

## Task 3: PRCelebrationContext — App-Wide State

**Files:**
- Create: `app/features/personal-records/PRCelebrationContext.tsx`

### Step 1: Write the context

```typescript
// app/features/personal-records/PRCelebrationContext.tsx
"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import type { PRType } from "@/lib/pr-utils";

interface PRCelebrationState {
  isVisible: boolean;
  prType: PRType | null;
  exerciseName: string;
}

interface PRCelebrationContextValue {
  celebration: PRCelebrationState;
  celebrate: (prType: PRType, exerciseName: string) => void;
  dismiss: () => void;
}

const PRCelebrationContext = createContext<PRCelebrationContextValue | null>(null);

const INITIAL: PRCelebrationState = { isVisible: false, prType: null, exerciseName: "" };

export function PRCelebrationProvider({ children }: { children: React.ReactNode }) {
  const [celebration, setCelebration] = useState<PRCelebrationState>(INITIAL);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const celebrate = useCallback((prType: PRType, exerciseName: string) => {
    // Clear any existing auto-dismiss timer
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    setCelebration({ isVisible: true, prType, exerciseName });
    // Auto-dismiss after 4 seconds
    dismissTimerRef.current = setTimeout(() => setCelebration(INITIAL), 4000);
  }, []);

  const dismiss = useCallback(() => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    setCelebration(INITIAL);
  }, []);

  return (
    <PRCelebrationContext.Provider value={{ celebration, celebrate, dismiss }}>
      {children}
    </PRCelebrationContext.Provider>
  );
}

export function usePRCelebration(): PRCelebrationContextValue {
  const ctx = useContext(PRCelebrationContext);
  if (!ctx) throw new Error("usePRCelebration must be inside <PRCelebrationProvider>");
  return ctx;
}
```

### Step 2: Commit

```bash
git add app/features/personal-records/PRCelebrationContext.tsx
git commit -m "feat(pr): add PRCelebrationContext for app-wide PR celebration state"
```

---

## Task 4: PRCelebrationOverlay Component + CSS Animations

**Files:**
- Create: `app/features/personal-records/PRCelebrationOverlay.tsx`
- Modify: `app/globals.css` — add `pr-burst` and `pr-slide-in` keyframes inside the `@theme` block

### Step 1: Add keyframe animations to `app/globals.css`

Inside the `@theme { ... }` block, after the existing `--animate-pulse-ring` line and its `@keyframes pulse-ring { ... }` block, add:

```css
  --animate-pr-burst: pr-burst 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  --animate-pr-slide-in: pr-slide-in 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;

  @keyframes pr-burst {
    0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
    60%  { transform: scale(1.2) rotate(5deg);  opacity: 1; }
    100% { transform: scale(1)  rotate(0deg);  opacity: 1; }
  }

  @keyframes pr-slide-in {
    from { transform: translateY(40px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
```

### Step 2: Create the overlay component

```typescript
// app/features/personal-records/PRCelebrationOverlay.tsx
"use client";

import { useEffect } from "react";
import { usePRCelebration } from "./PRCelebrationContext";
import { Portal } from "@/app/components/ui/Portal";
import type { PRType } from "@/lib/pr-utils";

const PR_CONFIG: Record<PRType, { emoji: string; label: string; sub: string; color: string }> = {
  weight: {
    emoji: "🏆",
    label: "New Weight PR!",
    sub: "You just lifted more than ever before!",
    color: "#fbbf24",
  },
  reps: {
    emoji: "🔥",
    label: "New Reps PR!",
    sub: "More reps than you have ever done!",
    color: "#f97316",
  },
  estimated_1rm: {
    emoji: "⚡",
    label: "New Strength PR!",
    sub: "Your estimated 1-Rep Max just went up!",
    color: "#a78bfa",
  },
};

const CONFETTI_COLORS = ["#ec4899", "#a78bfa", "#38bdf8", "#34d399", "#fbbf24"];

export function PRCelebrationOverlay() {
  const { celebration, dismiss } = usePRCelebration();

  // Dismiss on Escape key
  useEffect(() => {
    if (!celebration.isVisible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [celebration.isVisible, dismiss]);

  if (!celebration.isVisible || !celebration.prType) return null;

  const config = PR_CONFIG[celebration.prType];

  return (
    <Portal>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Celebration card — bottom-anchored, above the nav */}
      <div
        role="status"
        aria-live="polite"
        aria-label={`Personal record: ${config.label} for ${celebration.exerciseName}`}
        className="fixed inset-x-0 bottom-24 z-[9999] flex justify-center px-5 pointer-events-none"
      >
        <div
          className="pointer-events-auto relative w-full max-w-sm bg-card border border-border rounded-3xl p-7 elevation-5 text-center overflow-hidden"
          style={{ animation: "pr-slide-in 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) both" }}
        >
          {/* Accent glow backdrop */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none opacity-20"
            style={{ background: `radial-gradient(circle at 50% 0%, ${config.color}, transparent 70%)` }}
          />

          {/* Confetti dots */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none" aria-hidden="true">
            {CONFETTI_COLORS.map((color, i) => (
              <span
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{
                  background: color,
                  left: `${12 + i * 18}%`,
                  top: "8%",
                  animation: `pr-burst 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) both ${0.12 + i * 0.07}s`,
                  opacity: 0.9,
                }}
              />
            ))}
          </div>

          {/* Emoji */}
          <div
            className="relative text-6xl mb-4 select-none"
            style={{ animation: "pr-burst 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) both 0.1s" }}
          >
            {config.emoji}
          </div>

          {/* PR badge pill */}
          <div
            className="relative inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border"
            style={{
              background: `${config.color}18`,
              borderColor: `${config.color}40`,
              color: config.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: config.color }}
            />
            Personal Record
          </div>

          <h2 className="relative font-display text-2xl font-bold text-foreground mb-1">
            {config.label}
          </h2>
          <p className="relative text-sm text-muted-foreground mb-1">
            {config.sub}
          </p>
          <p className="relative text-xs font-semibold text-accent/80 truncate mb-5">
            {celebration.exerciseName}
          </p>

          <button
            onClick={dismiss}
            className="relative text-xs text-muted-foreground hover:text-foreground transition-colors px-4 py-1.5 rounded-full border border-border hover:border-accent/30 hover:bg-accent/5"
          >
            Dismiss
          </button>
        </div>
      </div>
    </Portal>
  );
}
```

### Step 3: Commit

```bash
git add app/features/personal-records/PRCelebrationOverlay.tsx app/globals.css
git commit -m "feat(pr): add PRCelebrationOverlay component with burst/slide animations"
```

---

## Task 5: Wire Context + Overlay into Root Layout

**Files:**
- Modify: `app/layout.tsx`

### Step 1: Read current layout

Run: `cat app/layout.tsx` to see the current wrapping structure.

### Step 2: Add the provider and overlay

Add these two imports:

```typescript
import { PRCelebrationProvider } from "@/app/features/personal-records/PRCelebrationContext";
import { PRCelebrationOverlay } from "@/app/features/personal-records/PRCelebrationOverlay";
```

Wrap the existing body content with `<PRCelebrationProvider>` and add `<PRCelebrationOverlay />` inside it (it renders via Portal so position in JSX tree doesn't matter for rendering position):

The body content should look like:
```tsx
<body>
  {/* existing providers/children */}
  <PRCelebrationProvider>
    {children}
    <PRCelebrationOverlay />
  </PRCelebrationProvider>
</body>
```

Adjust nesting to fit with existing `QueryProvider` and other providers — `PRCelebrationProvider` must be inside any existing client boundary wrapper.

### Step 3: Commit

```bash
git add app/layout.tsx
git commit -m "feat(pr): register PRCelebrationProvider and overlay in root layout"
```

---

## Task 6: Trigger Celebration from ExerciseCard (Structured Workout)

**Files:**
- Modify: `app/features/workouts/components/ui/ExerciseCard.tsx`

### Step 1: Import the hook

At the top of the file, add:

```typescript
import { usePRCelebration } from "@/app/features/personal-records/PRCelebrationContext";
```

Inside the `ExerciseCard` component function body, add:

```typescript
const { celebrate } = usePRCelebration();
```

### Step 2: Update logSetMutation onSuccess

Find the `logSetMutation` call's `onSuccess` callback (currently around line 165). Update the type annotation and add the celebration call:

```typescript
onSuccess: (newLog: ExerciseLog & { pr: string | null }) => {
    setLogs((prev) => [...prev, newLog]);
    setIsDrawerOpen(false);
    startTimer(restMin, { closeOnFinish: true });
    // Celebrate PR if detected
    if (newLog.pr) {
        celebrate(newLog.pr as import("@/lib/pr-utils").PRType, name);
    }
},
```

### Step 3: Commit

```bash
git add app/features/workouts/components/ui/ExerciseCard.tsx
git commit -m "feat(pr): trigger PR celebration from ExerciseCard on new set log"
```

---

## Task 7: Trigger Celebration from StandaloneLogDrawer (Quick Log)

**Files:**
- Modify: `app/features/logging/components/ui/StandaloneLogDrawer.tsx`

### Step 1: Import the hook

```typescript
import { usePRCelebration } from "@/app/features/personal-records/PRCelebrationContext";
```

Inside the component:

```typescript
const { celebrate } = usePRCelebration();
```

### Step 2: Update logSet onSuccess

Find the `logSet(...)` call's `onSuccess`. Update to:

```typescript
onSuccess: (newLog: { pr: string | null }) => {
    setWeight("");
    setReps("");
    onClose();
    if (newLog.pr) {
        celebrate(newLog.pr as import("@/lib/pr-utils").PRType, exerciseName);
    }
},
```

### Step 3: Commit

```bash
git add app/features/logging/components/ui/StandaloneLogDrawer.tsx
git commit -m "feat(pr): trigger PR celebration from StandaloneLogDrawer"
```

---

## Task 8: Update feature-list.md

**Files:**
- Modify: `feature-list.md` line 16

Change:
```
14. Personal Records (PRs): Auto-detect and celebrate when a user hits a new PR for weight, reps, or estimated 1RM.
```
To:
```
14. Personal Records (PRs): Auto-detect and celebrate when a user hits a new PR for weight, reps, or estimated 1RM. [done]
```

```bash
git add feature-list.md
git commit -m "chore: mark Personal Records feature as done in feature-list.md"
```

---

## Task 9: Update learning.md

**Files:**
- Modify: `learning.md`

Append this entry at the bottom of `learning.md`:

```markdown
## [2026-03-03 16:41]

### Context
Implementing Personal Records (PR) detection and celebration feature for the workout app.

### Learning
1. **Server-side PR detection pattern:** Query `prisma.exerciseLog.aggregate({ _max: { weight, reps } })` excluding the current log ID to get historical bests, then compare with `detectPR()`. Return the `pr` field alongside the created log in the API response. This avoids a separate client-side fetch.
2. **detectPR priority order:** weight > reps > estimated_1rm. Weight beats reps because a heavier lift is more commonly understood as a strength PR. Estimated 1RM is a fallback for cases like "same weight, fewer reps but previously stronger."
3. **Epley formula edge case:** When reps === 1, return weight directly. The formula `weight * (1 + 1/30)` would overestimate by ~3.3%, which is wrong for 1-rep sets.
4. **Context-based celebration avoids prop-drilling:** PRCelebrationContext + PRCelebrationOverlay in root layout means *any* component that logs a set can trigger a celebration without needing to thread callback props through ExerciseCard -> LogSetDrawer -> submit.
5. **Auto-dismiss with ref-tracked timer:** Use `useRef<ReturnType<typeof setTimeout>>` to store the dismiss timer ID so consecutive PRs clear the previous timer and re-arm — prevents stale celebrations.
6. **No new DB model needed:** PR is purely computed from existing exercise_logs at POST time. No additional schema migration required.

### Action Taken
Implemented `lib/pr-utils.ts`, extended API route, added PRCelebrationContext + Overlay, wired into layout, triggered from ExerciseCard and StandaloneLogDrawer.

### Result
PRs are auto-detected server-side and celebrated with an animated overlay. Feature covers all 3 PR types.
```

```bash
git add learning.md
git commit -m "docs: record PR detection and celebration learnings"
```

---

## Task Summary Table

| # | Task | Key Files | Status |
|---|------|-----------|--------|
| 1 | Pure utility (TDD) — 1RM + PR detection | `lib/pr-utils.ts`, `lib/pr-utils.test.ts` | ⬜ |
| 2 | Extend POST /api/log/set response | `app/api/log/set/route.ts` | ⬜ |
| 3 | PRCelebrationContext | `app/features/personal-records/PRCelebrationContext.tsx` | ⬜ |
| 4 | PRCelebrationOverlay + CSS animations | `app/features/personal-records/PRCelebrationOverlay.tsx`, `app/globals.css` | ⬜ |
| 5 | Wire into root layout | `app/layout.tsx` | ⬜ |
| 6 | Trigger from ExerciseCard | `app/features/workouts/components/ui/ExerciseCard.tsx` | ⬜ |
| 7 | Trigger from StandaloneLogDrawer | `app/features/logging/components/ui/StandaloneLogDrawer.tsx` | ⬜ |
| 8 | Mark feature done | `feature-list.md` | ⬜ |
| 9 | Update learning log | `learning.md` | ⬜ |
