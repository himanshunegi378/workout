# Remove Service Worker Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Completely remove the Service Worker (Serwist) and related PWA registration logic from the application.

**Architecture:** Revert `next.config.ts` to a standard configuration, remove the registration component from the root layout, and delete service worker source files and dependencies.

**Tech Stack:** Next.js, Serwist (to be removed)

---

### Task 1: Clean up next.config.ts

**Files:**
- Modify: `next.config.ts`

**Step 1: Remove Serwist imports and wrapper**

Remove Serwist initialization and wrap the config only with `nextConfig`.

**Step 2: Remove SW specific headers**

Remove the `/sw.js` header block.

**Step 3: Verification**

Run `pnpm dev`.

### Task 2: Remove PWA Registration from Layout

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Remove Import and Usage**

Remove `PWARegistration`.

### Task 3: Delete Redundant Files

**Files:**
- Delete: `app/sw.ts`
- Delete: `app/components/PWARegistration.tsx`

### Task 4: Remove Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Uninstall Serwist packages**

Run: `pnpm remove @serwist/next @serwist/precaching @serwist/routing @serwist/strategies @serwist/sw @serwist/window serwist`

### Task 5: Final Cleanup

**Files:**
- Modify: `feature-list.md`
