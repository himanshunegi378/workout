import { vi, beforeAll, beforeEach, afterAll } from "vitest";
import prisma from "@/lib/prisma";

// Auth and Navigation mocks remain as they are external to the DB logic
vi.mock("@/auth", () => ({
    auth: vi.fn(),
    handlers: {
        GET: vi.fn(),
        POST: vi.fn(),
    },
    signIn: vi.fn(),
    signOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
    useRouter: vi.fn(),
    usePathname: vi.fn(),
}));

// Database cleanup logic
async function cleanDatabase() {
    const tablenames = await prisma.$queryRaw<
        Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tablenames
        .map(({ tablename }) => tablename)
        .filter((name) => name !== "_prisma_migrations")
        .map((name) => `"public"."${name}"`)
        .join(", ");

    try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
        console.error("Error cleaning database:", error);
    }
}

beforeAll(async () => {
    // Optional: Ensure migrations are applied
    // This could also be done via a script before running tests
});

beforeEach(async () => {
    await cleanDatabase();
});

afterAll(async () => {
    await prisma.$disconnect();
});
