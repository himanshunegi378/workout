// lib/prisma.ts
//
// Prisma Client singleton — safe for Next.js on Vercel (serverless + edge).
//
// Why the global trick?
//   During development, Next.js hot-reloads modules, which would create a new
//   PrismaClient on every reload and exhaust database connections fast.
//   The `globalThis` guard prevents that.
//
// Why @prisma/adapter-pg?
//   Supabase uses PgBouncer for connection pooling (port 6543).
//   The driver-level PgBouncer adapter (`@prisma/adapter-pg`) is required
//   for Prisma to work correctly with a pooled connection in serverless.

import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient() {
    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
    });
    return new PrismaClient({ adapter });
}

// Extend the global type to hold our cached client
declare global {
    var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined;
}

// In production every invocation gets a fresh module (no hot-reload risk),
// so we always create a new client. In development we reuse the cached one.
const prisma = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
}

export default prisma;
