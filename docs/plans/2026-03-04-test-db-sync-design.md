# Automated Test Database Synchronization

## Overview
This design addresses the issue where integration tests fail because the local test database is not synchronized with the Prisma schema (e.g., missing fields like `rpe`). The solution implements an automated pre-test synchronization step.

## Strategy: Automated Pre-test Script

1. **Synchronization Script (`scripts/sync-test-db.ts`)**
   - Create a Node.js script that leverages `dotenv` and `prisma`.
   - The script will connect to the database specified in `.env.test`.
   - It will programmatically run the equivalent of `prisma db push --accept-data-loss`.
   - We will create `scripts/sync-test-db.ts` to load `.env.test` using `dotenv` and spawn `npx prisma db push --accept-data-loss --skip-generate`.

2. **Package.json Integration**
   - Add a script: `"db:push:test": "tsx scripts/sync-test-db.ts"`.
   - Update `"test:api"` script to run the sync script before the tests: `"test:api": "pnpm db:push:test && vitest run --config vitest.integration.config.ts"`.
   - Update `"test:api:watch"` similarly to `"pnpm db:push:test && vitest --config vitest.integration.config.ts"`.

## Benefits
- Ensures consistent test environments across local development and CI.
- Fails fast if the database connection or schema is invalid.
- Eliminates manual DB sync steps before running integration tests.
