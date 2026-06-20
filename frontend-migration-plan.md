# Phase-Wise React Vite Migration In `react-client`

## Summary
- Add a new `react-client/` app using **Vite + React 19 + React Router**, leaving the current Next.js app untouched during migration.
- Move route code in phases while preserving the existing feature architecture: `features/<name>`, shared UI primitives, provider structure, TanStack Query cache, rest timer, PR celebration, and backend API client behavior.
- The domain goal is continuity: a user logging a workout on mobile should not feel that the app changed underneath them. Programme setup, set logging, history, analytics, auth, and feedback must keep the same workflows.

## Phase 0: Baseline And Safety
- Capture current route inventory and user flows:
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
- Confirm all production API calls go through `lib/api-client.ts` or equivalent backend helpers.
- Run current checks before migration:
  - `pnpm lint`
  - `pnpm test:ui`
  - `pnpm test:api`
  - `pnpm test:cycles`

## Phase 1: Create `react-client`
- Create `react-client/` as a sibling frontend package inside the repo.
- Add:
  - `react-client/index.html`
  - `react-client/package.json`
  - `react-client/vite.config.ts`
  - `react-client/tsconfig.json`
  - `react-client/src/main.tsx`
  - `react-client/src/App.tsx`
- Install core dependencies:
  - `@vitejs/plugin-react`
  - `vite`
  - `typescript`
  - `react`
  - `react-dom`
  - `react-router`
  - `react-router-dom`
- Mirror required app dependencies used by migrated components:
  - TanStack Query packages
  - `idb-keyval`
  - `framer-motion`
  - `lucide-react`
  - `recharts`
  - `date-fns`
  - `clsx`
  - `tailwind-merge`
  - `zod`
- Configure path alias in Vite and TS:
  - `@/*` points to `react-client/src/*`
- Add scripts:
  - `dev`
  - `build`
  - `preview`
  - `test:ui`
  - `lint`

## Phase 2: Shared Foundation
- Recreate the app shell in `react-client/src/app-shell/` or `react-client/src/app/AppShell.tsx`.
- Move or copy foundational shared pieces first:
  - global CSS tokens from `app/globals.css`
  - shared UI primitives from `app/components/ui`
  - `QueryProvider`
  - page-header providers
  - bottom drawer provider
  - rest timer provider and overlays
  - PR celebration provider and overlay
- Replace Next-only primitives:
  - `next/link` -> `react-router-dom` `Link`
  - `useRouter().push()` -> `useNavigate()`
  - `usePathname()` -> `useLocation().pathname`
  - `notFound()` -> local `NotFound` component or route fallback
  - `next-themes` may be kept only if it works cleanly outside Next; otherwise replace with a small class-based theme provider.
- Replace `next/font/google` with CSS font loading in `index.html` or `globals.css`.
- Convert `app/manifest.ts` into `react-client/public/manifest.webmanifest`.
- Keep dark mode, `.light` overrides, Outfit, Plus Jakarta Sans, and accent `#be185d`.

## Phase 3: API And Auth Compatibility
- Add `react-client/src/lib/api-client.ts`, preserving current behavior:
  - backend base URL from `VITE_BACKEND_API_URL`
  - credentialed requests
  - query string support
  - existing error parsing shape
- Keep backend route paths unchanged.
- Port auth helpers needed by the client:
  - login
  - signup
  - logout
  - current user lookup
- Ensure backend CORS allows the Vite dev origin, for example `http://localhost:5173`.
- Do not change NestJS endpoint contracts in this migration.

## Phase 4: Public And Shell Routes
- Add React Router route table in `App.tsx`.
- Migrate low-risk shell/public routes first:
  - `/login`
  - `/signup`
  - `/settings`
  - `/settings/feedback`
- Keep existing screen-level components and form behavior as close as possible.
- Verify:
  - login redirects correctly
  - signup redirects correctly
  - logout returns to login
  - settings theme toggle works
  - feedback submit/history works

## Phase 5: Read-Heavy App Routes
- Migrate read-heavy routes next:
  - `/`
  - `/dashboard`
  - `/exercises`
  - `/log`
- Preserve feature folder architecture under `react-client/src/features/<name>/`.
- Cross-feature imports must continue to go through feature `index.ts` files.
- Keep TanStack Query keys unchanged where possible to preserve cache semantics.
- Verify:
  - programme list loads
  - dashboard charts load
  - exercise library loads
  - workout history loads
  - no direct hardcoded backend URLs outside the API client

## Phase 6: Programme And Workout Builder Routes
- Migrate creation/detail routes:
  - `/programmes/new`
  - `/programmes/:programmeId`
  - `/programmes/:programmeId/workouts/new`
- Preserve domain rules:
  - active programme toggles remain intact
  - soft-hidden exercise metadata stays hidden
  - workout template ordering stays stable
  - workouts coordinates sessions but logging owns set persistence/history
- Verify:
  - create programme
  - activate programme
  - create workout
  - add exercises to workout
  - edit exercise metadata

## Phase 7: Active Workout Logging Route
- Migrate the highest-risk route last:
  - `/programmes/:programmeId/workouts/:workoutId`
- Preserve the natural workout flow:
  - open workout
  - see planned exercises
  - log sets quickly on mobile
  - preserve offline/client-generated IDs
  - update/delete sets without duplicates
  - finish session
  - PR celebration still appears
  - rest timer still behaves globally
- Run focused manual mobile checks before considering this route complete.

## Phase 8: Parity Cleanup
- Once all routes work in `react-client`, compare against the Next app:
  - visual shell
  - navigation
  - auth/session behavior
  - PWA install behavior
  - API calls
  - `cd react-client && pnpm test:ui`

## Phase 9: Optional Cutover
- Only after parity is proven, choose the deployment direction:
  - deploy `react-client` as the primary frontend
  - keep Next app temporarily as rollback
  - later remove Next-specific files and dependencies in a separate cleanup phase
- Do not remove the existing Next app during the route migration phases.

## Assumptions
- The new app will live at `react-client/`.
- The current `app/features/<name>/` architecture should be mirrored in `react-client/src/features/<name>/`.
- Backend remains NestJS and API contracts remain unchanged.
- React Router will use browser history with the same user-facing paths.
- Route migration should be incremental, with Next and Vite coexisting until parity is proven.
