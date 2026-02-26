---
name: workout-ui
description: Build production-grade UI screens for the workout/fitness app using Tailwind CSS v4 and Next.js. Use when creating or modifying any UI component, page, or screen — including workout lists, exercise views, log screens, drawers, and auth pages. Covers the design system, 4-layer component architecture, Tailwind class patterns, Portal usage, mobile-first rules, and loading state requirements.
---

# Workout UI

Build mobile-first, dark-themed UI for the workout app using **Tailwind CSS v4** and **Next.js App Router** with **TypeScript**.

## Tech Stack

- **Framework:** Next.js 16 (App Router, RSC + Client Components)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` config in `app/globals.css`)
- **Icons:** Lucide React (`lucide-react`)
- **Fonts:** Outfit (display) + Plus Jakarta Sans (body) via `next/font/google`

See **[references/design-system.md](references/design-system.md)** for the full color palette, typography scale, spacing, animations, `@theme` block, and iconography.

## 4-Layer Component Architecture

| Layer | Location | Rules |
|---|---|---|
| **Route Page** | `app/<route>/page.tsx` | Thin shell. Renders Feature Components. No data fetching. |
| **Feature Logic** | `app/features/<domain>/components/` | `"use client"` components using React Query hooks. |
| **Feature UI** | `app/features/<domain>/components/ui/` | Presentational components — props only. |
| **Global UI** | `app/components/ui/` | Shared primitives (Button, PageHeader, BottomNav, EmptyState). |

## Key Tailwind Patterns

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

### Staggered Entry Animation
```tsx
{items.map((item, i) => (
  <div key={item.id} className="animate-slide-up"
       style={{ animationDelay: `${i * 60}ms` }}>
    <Card {...item} />
  </div>
))}
```

### Muscle Group Color Mapping
Never generate dynamic Tailwind classes. Always use the centralized map:
```tsx
import { muscleColorMap } from "@/app/components/ui";
const colorClass = muscleColorMap[muscleGroup] ?? "bg-accent";
```

### Portals for Fixed Elements
When rendering fixed `z-50` overlays (Drawers, Modals, Rest Timers) from *inside* animated containers (e.g., `animate-slide-up` card), **MUST** wrap in `<Portal>` (`@/app/components/ui/Portal`). Without it, the parent's CSS transform traps the overlay.

## Premium UI & Aesthetics (CRITICAL)

To ensure the app always looks top-notch and premium, strictly follow these visual rules:
1. **Depth over Flatness**: Use the custom `elevation-1`, `elevation-2` classes from `globals.css` rather than default `shadow-md`. Use `rounded-3xl` for main hero cards and `rounded-2xl` for nested interactive elements.
2. **Glassmorphism & Backgrounds**: For heroic components (Welcome headers, Overview cards), use relative positioning with `absolute` behind-the-scenes glowing orbs (e.g., `bg-accent/20 blur-3xl rounded-full`).
3. **Custom Inputs**: Never use default browser `<select>` or `<input>`. Use `appearance-none` and build custom wrappers with hover/focus states (`focus:ring-2 focus:ring-accent hover:bg-muted/50`).
4. **Micro-Interactions**: Upgrade static indicators with glowing rings (e.g., `ring-4 ring-success/20`). Use badges with low opacity backgrounds (`bg-opacity-20`).
5. **Staggered Motion**: Always use `animate-slide-up` on content blocks, staggering them with `style={{ animationDelay: '100ms' }}`.

## Mobile-First Rules

- Single column layout, cards full width
- All touch targets min `44px` (`p-2` + icon or `py-3 px-5`)
- Bottom nav: `h-16` fixed, page content gets `pb-20`
- Content containers: `max-w-lg mx-auto`

## Loading States (CRITICAL)

Loading states **MUST** include `<PageHeader>` with back button and placeholder title. Never show blank screen without navigation context.

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

## Client Component Discipline

Before extracting any interactive component:
1. Uses a hook (`useState`, `useEffect`, React Query)? → Add `"use client"` at line 1
2. All imports restored? Refactoring often strips Lucide/UI imports
3. Named export convention: `export function ComponentName()`

## Next.js Gotchas

- **Hydration Mismatch (next-themes):** Add `suppressHydrationWarning` to `<html>` in `app/layout.tsx`
- **Route Params are Promises:** In Next.js 15+, `const { id } = await params;` in Server Components / API Routes; `React.use(params)` in Client Components
