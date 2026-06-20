# React Vite Migration Progress

## 2026-06-04

### Baseline
- Current route inventory captured from `app/**/page.tsx`.
- Confirmed there are no remaining `app/api/**/route.ts` files.
- Confirmed production frontend API callers are centralized through `lib/api-client.ts`; test mocks use `http://backend.test`.
- GitNexus impact checks for `RootLayout`, `QueryProvider`, `Sidebar`, and `BottomNav` reported `LOW` risk with no indexed direct callers or affected processes.
- Baseline checks:
  - `pnpm test:ui`: passed, 31 tests.
  - `pnpm test:api`: passed, 85 tests.
  - `pnpm test:cycles`: passed, no circular dependencies.
  - `pnpm lint`: completed with 2 pre-existing warnings in `app/features/logging/api/mutation-hooks/use-update-log-set.ts`.

### Current Step
- Creating a parallel `react-client/` Vite app with React Router while leaving the existing Next.js app untouched.

### Completed Migration Work
- Added `react-client` to `pnpm-workspace.yaml`.
- Added Vite package scaffolding: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `postcss.config.mjs`, and `eslint.config.mjs`.
- Added static PWA assets: `public/manifest.webmanifest` and copied `icon.png`.
- Mirrored active source into `react-client/src`: shared components, features, lib API helper, and global CSS.
- Added Vite shell and route table:
  - `src/main.tsx`
  - `src/App.tsx`
  - `src/app/AppShell.tsx`
  - `src/app/NotFound.tsx`
  - route wrappers under `src/pages`
- Replaced server/generated Prisma type dependency with client DTO types in `src/lib/domain-types.ts`.
- Removed copied server-only browser-incompatible files from the React client: `src/lib/prisma.ts`, `src/lib/auth-helpers.ts`, and `src/features/analytics/api/analytics-service.ts`.
- Added a Vite-local theme provider to replace `next-themes`.

### Next Verification
- Install workspace dependencies for `react-client`.
- Run `cd react-client && pnpm build` and fix TypeScript/Vite issues.
- Run `cd react-client && pnpm lint`.

### Verification Updates
- `pnpm install`: passed for both workspace projects; root postinstall regenerated Prisma client.
- `cd react-client && pnpm build`: passed after React Router and browser-client fixes.
  - Vite emitted a chunk-size warning for the initial single-bundle route table; this is acceptable for the first migration pass and can be addressed with route-level lazy loading later.
- `cd react-client && pnpm lint`: passed.
- Re-ran `cd react-client && pnpm build`: passed with the same chunk-size warning.
- `cd react-client && pnpm test:ui`: passed with no test files found. Copied Next-app tests/scripts were removed from `react-client`; original tests remain in the Next app.
- Re-ran root checks after adding the workspace:
  - `pnpm test:ui`: passed, 31 tests.
  - `pnpm test:api`: passed, 85 tests.
  - `pnpm test:cycles`: passed, no circular dependencies.
  - `pnpm lint`: passed with the same 2 pre-existing warnings in `app/features/logging/api/mutation-hooks/use-update-log-set.ts`.
- GitNexus `detect_changes(scope=all)` reported low indexed risk and no affected processes. It only reported indexed tracked symbols, so it does not fully enumerate the new untracked `react-client/` tree yet.

## Stop-Point Summary

### Done
- Created a parallel `react-client/` Vite + React 19 + React Router app.
- Kept the existing Next.js app in place; no Next route files were removed.
- Added `react-client` to the pnpm workspace.
- Mirrored the feature-folder architecture into `react-client/src/features`.
- Mirrored shared UI into `react-client/src/components`.
- Added React Router routes for:
  - `/`
  - `/login`
  - `/signup`
  - `/dashboard`
  - `/log`
  - `/exercises`
  - `/exercises/new`
  - `/programmes/new`
  - `/programmes/:programmeId`
  - `/programmes/:programmeId/workouts/new`
  - `/programmes/:programmeId/workouts/:workoutId`
  - `/settings`
  - `/settings/feedback`
- Added the Vite app shell with the migrated provider stack:
  - query persistence
  - theme provider
  - page-header providers
  - rest timer providers/overlays
  - PR celebration provider/overlay
  - bottom drawer provider
  - sidebar and bottom nav
- Replaced Next-only runtime dependencies inside the React client:
  - `next/link` -> `react-router-dom` `Link`
  - `next/navigation` navigation hooks -> React Router hooks
  - `notFound()` -> local `NotFound`
  - `next-themes` -> local class-based theme provider
  - `NEXT_PUBLIC_BACKEND_API_URL` -> `VITE_BACKEND_API_URL`
- Converted the Next manifest into `react-client/public/manifest.webmanifest`.
- Added client DTO types in `react-client/src/lib/domain-types.ts` so the browser client does not depend on generated Prisma files.
- Removed browser-incompatible copied files from the React client:
  - `react-client/src/lib/prisma.ts`
  - `react-client/src/lib/auth-helpers.ts`
  - `react-client/src/features/analytics/api/analytics-service.ts`
  - copied `__tests__`, `*.test.*`, and feedback export scripts.
- Added separate React-client lint and test configs.
- Updated root ESLint config so the Next app and React client use separate lint configs without conflict.

### Completed
- Done a real browser/manual pass for the React client against backend on `localhost:4000`. Set up `VITE_BACKEND_API_URL` environment variable cleanly.
- Verified login, logout, settings page, feedback forms, programs view, and exercise/workout detail loading.
- Added React-client-specific tests inside `react-client/src/app/__tests__/NotFound.test.tsx` and ran them using `pnpm test:ui`.
- Added route-level lazy loading in `react-client` to address the Vite bundle-size warning (split the bundle into multiple chunks < 500kB).
- Verified backend CORS origin works automatically (reflected origin for credentials).
- Ran all root test suites (`pnpm test:ui`, `pnpm test:api`, `pnpm test:cycles`, and `pnpm lint`), and all checks passed successfully.

### Next / Remaining
- Decide deployment/cutover strategy (deploying `react-client` to Vercel/similar).
- Do not delete the existing Next.js app until production parity and rollback strategy are confirmed.

### Current Git Status Notes
- Migration-related changes include `react-client/`, `progress.md`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, and `eslint.config.mjs`.
- `AGENTS.md` and `CLAUDE.md` were already modified before this implementation and were not touched as part of the migration work.

