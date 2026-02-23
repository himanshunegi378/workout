# Workout App Design System

## Table of Contents
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Animations & Transitions](#animations--transitions)
- [Tailwind v4 Theme Configuration](#tailwind-v4-theme-configuration)
- [Dark Mode](#dark-mode)
- [Iconography](#iconography)

## Color Palette

The app uses a dark-first fitness aesthetic with energetic accent colors.

Every semantic layer uses a **background / foreground** pair so components always know which text color to use on their own surface. Swap the pair values to re-theme.

### Surface Tokens (background / foreground pairs)
| Background Token           | Foreground Token               | Dark Values             | Usage                           |
|----------------------------|--------------------------------|-------------------------|---------------------------------|
| `--color-background`       | `--color-foreground`           | `#0c0c0e` / `#e8e8ed`  | Page-level background & text    |
| `--color-card`             | `--color-card-foreground`      | `#151519` / `#e8e8ed`  | Card surfaces                   |
| `--color-muted`            | `--color-muted-foreground`     | `#1e1e24` / `#8e8e9a`  | Elevated surfaces, chips, inputs|
| `--color-border`           | —                              | `#2a2a32`               | Borders and dividers            |

### Accent Tokens (background / foreground pairs)
| Background Token           | Foreground Token               | Values                  | Usage                           |
|----------------------------|--------------------------------|-------------------------|---------------------------------|
| `--color-accent`           | `--color-accent-foreground`    | `#6c5ce7` / `#ffffff`  | Primary CTA, active states      |
| `--color-success`          | `--color-success-foreground`   | `#00b894` / `#ffffff`  | Completed sets, success states  |
| `--color-warning`          | `--color-warning-foreground`   | `#fdcb6e` / `#1a1a2e`  | Rest timers, attention          |
| `--color-danger`           | `--color-danger-foreground`    | `#e17055` / `#ffffff`  | Delete actions, failed reps     |
| `--color-info`             | `--color-info-foreground`      | `#74b9ff` / `#0c0c0e`  | Info badges, links              |

### Derived Utility
| Token                  | Value         | Derived From               |
|------------------------|---------------|----------------------------|
| `--color-accent-hover` | `#5a4bd6`     | Darker shade of accent     |
| `--color-ring`         | `#6c5ce740`   | Focus ring (accent @ 25%)  |

### Muscle Group Colors
These bring visual variety and help users instantly identify muscle groups:
| Muscle Group  | Color         | Token                       |
|---------------|---------------|-----------------------------|
| Chest         | `#ff6b6b`     | `--color-muscle-chest`      |
| Back          | `#4ecdc4`     | `--color-muscle-back`       |
| Legs          | `#ffd93d`     | `--color-muscle-legs`       |
| Shoulders     | `#6c5ce7`     | `--color-muscle-shoulders`  |
| Arms          | `#ff8a5c`     | `--color-muscle-arms`       |
| Core          | `#a29bfe`     | `--color-muscle-core`       |

## Typography

Use **two** font families. Load via `next/font/google` in `layout.tsx`.

| Token            | Font            | Weight   | Usage                              |
|------------------|-----------------|----------|------------------------------------|
| `--font-display` | `"Outfit"`      | 600–800  | Headings, workout names, numbers   |
| `--font-body`    | `"Plus Jakarta Sans"` | 400–600  | Body text, labels, descriptions    |

### Type Scale (mobile-first)
| Class             | Size    | Line Height | Usage                        |
|-------------------|---------|-------------|------------------------------|
| `text-xs`         | 0.75rem | 1rem        | Badge labels, timestamps     |
| `text-sm`         | 0.875rem| 1.25rem     | Secondary text, metadata     |
| `text-base`       | 1rem    | 1.5rem      | Body text, form labels       |
| `text-lg`         | 1.125rem| 1.75rem     | Card titles, section headers |
| `text-xl`         | 1.25rem | 1.75rem     | Screen subtitles             |
| `text-2xl`        | 1.5rem  | 2rem        | Screen titles                |
| `text-4xl`        | 2.25rem | 2.5rem      | Hero numbers (weight, reps)  |

## Spacing & Layout

### Mobile-First Responsive
The app is **mobile-first**. Design for a 375px viewport, then scale up.

| Breakpoint | Tailwind | Min Width | Layout                        |
|------------|----------|-----------|-------------------------------|
| Default    | —        | 0         | Single column, full-width cards|
| `sm`       | `sm:`    | 640px     | Wider cards, more padding      |
| `md`       | `md:`    | 768px     | Two-column grid for exercises  |
| `lg`       | `lg:`    | 1024px    | Sidebar + main content layout  |

### Spacing Tokens
- Page padding: `px-4 sm:px-6`
- Card padding: `p-4 sm:p-5`
- Card gap: `gap-3`
- Section gap: `gap-6`
- Border radius: `rounded-2xl` for cards, `rounded-xl` for buttons, `rounded-full` for badges/avatars

### Bottom Navigation
Mobile bottom nav bar height: `h-16` with `pb-safe` (safe area inset).

## Animations & Transitions

### Page Transitions
```
@keyframes slide-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

### Micro-Interactions
```
@keyframes press {
  0%   { transform: scale(1); }
  50%  { transform: scale(0.96); }
  100% { transform: scale(1); }
}

@keyframes check-pop {
  0%   { transform: scale(0); }
  60%  { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes pulse-ring {
  0%   { box-shadow: 0 0 0 0 var(--color-accent); opacity: 0.6; }
  100% { box-shadow: 0 0 0 12px var(--color-accent); opacity: 0; }
}
```

### Transition Defaults
- Buttons: `transition-all duration-200 ease-out`
- Cards: `transition-all duration-300 ease-out`
- Page content: `animate-slide-up` (staggered per item)

## Tailwind v4 Theme Configuration

Place inside `globals.css` after `@import "tailwindcss";`:

```css
@theme {
  /* ── Surface bg/fg pairs ── */
  --color-background: #0c0c0e;
  --color-foreground: #e8e8ed;
  --color-card: #151519;
  --color-card-foreground: #e8e8ed;
  --color-muted: #1e1e24;
  --color-muted-foreground: #8e8e9a;
  --color-border: #2a2a32;

  /* ── Accent bg/fg pairs ── */
  --color-accent: #6c5ce7;
  --color-accent-foreground: #ffffff;
  --color-accent-hover: #5a4bd6;
  --color-ring: #6c5ce740;

  --color-success: #00b894;
  --color-success-foreground: #ffffff;
  --color-warning: #fdcb6e;
  --color-warning-foreground: #1a1a2e;
  --color-danger: #e17055;
  --color-danger-foreground: #ffffff;
  --color-info: #74b9ff;
  --color-info-foreground: #0c0c0e;

  /* ── Muscle group colors (decorative, no fg needed) ── */
  --color-muscle-chest: #ff6b6b;
  --color-muscle-back: #4ecdc4;
  --color-muscle-legs: #ffd93d;
  --color-muscle-shoulders: #6c5ce7;
  --color-muscle-arms: #ff8a5c;
  --color-muscle-core: #a29bfe;

  /* ── Typography ── */
  --font-display: "Outfit", sans-serif;
  --font-body: "Plus Jakarta Sans", sans-serif;

  /* ── Animations ── */
  --animate-slide-up: slide-up 0.4s ease-out both;
  --animate-fade-in: fade-in 0.3s ease-out both;
  --animate-press: press 0.2s ease-out;
  --animate-check-pop: check-pop 0.3s ease-out both;
  --animate-pulse-ring: pulse-ring 1.2s ease-out infinite;

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes press {
    0%   { transform: scale(1); }
    50%  { transform: scale(0.96); }
    100% { transform: scale(1); }
  }
  @keyframes check-pop {
    0%   { transform: scale(0); }
    60%  { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 oklch(from var(--color-accent) l c h / 0.6); }
    100% { box-shadow: 0 0 0 12px oklch(from var(--color-accent) l c h / 0); }
  }
}
```

### Usage Pattern
Each component uses its matching bg/fg pair:
- Page body: `bg-background text-foreground`
- Cards: `bg-card text-card-foreground`
- Chips/inputs: `bg-muted text-muted-foreground`
- CTA buttons: `bg-accent text-accent-foreground`
- Danger buttons: `bg-danger text-danger-foreground`

## Dark Mode

The app defaults to dark mode. For light mode support, override the CSS variables in a `@media (prefers-color-scheme: light)` block:

```css
@media (prefers-color-scheme: light) {
  :root {
    --color-background: #f8f9fa;
    --color-foreground: #1a1a2e;
    --color-card: #ffffff;
    --color-card-foreground: #1a1a2e;
    --color-muted: #f1f3f5;
    --color-muted-foreground: #6c757d;
    --color-border: #dee2e6;
  }
}
```

Only the bg/fg values change — accent, muscle, animation tokens stay the same.

## Iconography

Use **Lucide React** icons (`lucide-react` package). Consistent stroke width of `1.5`. Size `20px` for inline, `24px` for nav, `32px` for empty states.

Key icons:
| Context             | Icon Name          |
|---------------------|--------------------|
| Workout Groups      | `Layers`           |
| Workouts            | `Dumbbell`         |
| Exercises           | `Activity`         |
| Add new             | `Plus` / `PlusCircle` |
| Logs / History      | `ClipboardList`    |
| Timer / Rest        | `Timer`            |
| Settings            | `Settings`         |
| Back navigation     | `ChevronLeft`      |
| Delete              | `Trash2`           |
| Edit                | `Pencil`           |
| Weight              | `Weight`           |
| Reps                | `Repeat`           |
| Sets                | `Hash`             |
