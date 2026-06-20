- **Plan First Principle**: Always create a clear, structured implementation plan BEFORE executing complex tasks, refactors, or multi-step fixes. Do not go "rambo" on the codebase.
- **Domain over Code Principle**: Never sacrifice domain intent for technical elegance. Before proposing any logic change, you must first describe the real-world scenario it supports. If the change makes a natural human process (like tracking a workout) feel robotic or counter-intuitive, it is a technical failure.
- Workout Tracker is a single-user, mobile-first Next.js 16 App Router PWA for workout logging, programmes, PRs, and analytics on Vercel + Supabase PostgreSQL.
- Stack: React 19, TypeScript strict, Tailwind CSS 4 tokens in `app/globals.css`, Prisma 7, NextAuth v5 JWT sessions, TanStack Query persisted to IndexedDB, Vitest, Testing Library, MSW, pnpm 10.
- Active code belongs in `app/` and `lib/`; never add new code to `src/`, and never edit `app/generated/prisma/`.
- Feature code lives in `app/features/<name>/`; cross-feature imports must go through the feature `index.ts`, and deep imports into feature subfolders are forbidden.
- `internal.ts` exports are only for the root layout, not sibling features; prefer feature-local hooks over `app/hooks/`.
- Ownership rule: all set logging and exercise history logic belongs to `logging`; `workouts` coordinates sessions but uses `logging` for persistence.
- Keep page routes thin: unwrap params and render feature screens; API routes must follow the standard auth, validation, and transaction workflow.
- Respect data integrity rules around soft deletes (`is_hidden`), active programme toggles, PR detection, centralized NextAuth helpers, and Prisma lifecycle guards.
- UI defaults: dark mode, `.light` overrides, Outfit display font, Plus Jakarta Sans body font, accent `#be185d`, shared primitives from `@/app/components/ui`, and `framer-motion` for UI animations.
- Use `pnpm lint`, `pnpm test:api`, `pnpm test:ui`, and `pnpm test:cycles` as relevant; 
- When review code, always follow `docs/patterns/code-review.md`
- New functions/components need short JSDoc plus high-signal comments only.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **workout** (2254 symbols, 3430 relationships, 54 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/workout/context` | Codebase overview, check index freshness |
| `gitnexus://repo/workout/clusters` | All functional areas |
| `gitnexus://repo/workout/processes` | All execution flows |
| `gitnexus://repo/workout/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
