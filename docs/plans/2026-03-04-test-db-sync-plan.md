# Test DB Sync Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Automate test database synchronization to prevent integration test failures due to schema mismatches.

**Architecture:** A lightweight Node script using `tsx` executes `prisma db push --accept-data-loss` configured with `.env.test`, which is seamlessly integrated into `test:api` scripts in `package.json`.

**Tech Stack:** Node.js, tsx, child_process, Prisma

---

### Task 1: Create Synchronization Script

**Files:**
- Create: `scripts/sync-test-db.ts`

**Step 1: Write the implementation code**

```typescript
import { execSync } from "child_process";

console.log("🔄 Synchronizing test database schema...");

try {
    // The --accept-data-loss flag avoids prompt blocks when the test schema diverges
    execSync("npx prisma db push --accept-data-loss --skip-generate", {
        stdio: "inherit",
    });
    console.log("✅ Test database synchronized successfully.");
} catch (error) {
    console.error("❌ Failed to synchronize test database.");
    process.exit(1);
}
```

**Step 2: Run test to verify it passes**

Run: `tsx --env-file=.env.test scripts/sync-test-db.ts`
Expected: PASS with "Test database synchronized successfully."

**Step 3: Commit**

```bash
git add scripts/sync-test-db.ts
git commit -m "test: add db sync script for integration tests"
```

### Task 2: Update `package.json`

**Files:**
- Modify: `package.json`

**Step 1: Write the implementation code**

```json
    "test:api": "tsx --env-file=.env.test scripts/sync-test-db.ts && vitest run --config vitest.integration.config.ts",
    "test:api:watch": "tsx --env-file=.env.test scripts/sync-test-db.ts && vitest --config vitest.integration.config.ts",
```

**Step 2: Run test to verify it passes**

Run: `pnpm run test:api`
Expected: PASS (Vitest should run and not fail due to missing `rpe` column)

**Step 3: Commit**

```bash
git add package.json
git commit -m "test: automate test db sync in pnpm scripts"
```
