// prisma.config.ts
//
// Prisma v7 configuration — used by the Prisma CLI (migrate, db push, etc.)
//
// Two connection modes:
//   - CLI / Migrate  → DIRECT_URL (port 5432, bypasses PgBouncer directly)
//   - Runtime client → DATABASE_URL via @prisma/adapter-pg (port 6543, pooled)
//
// The runtime PrismaPg adapter is configured separately in lib/prisma.ts.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },

  // The Prisma CLI (migrate, db push, introspect, studio) uses DIRECT_URL —
  // a direct PostgreSQL connection (port 5432) that bypasses PgBouncer,
  // which is required for DDL statements to work correctly.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
