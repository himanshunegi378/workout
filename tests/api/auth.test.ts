import { expect, it, describe, vi } from "vitest";
import { POST as signup } from "@/app/api/auth/signup/route";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createMockRequest } from "@/tests/helpers/request-utils";

vi.mock("bcryptjs", () => ({
    default: {
        hash: vi.fn().mockResolvedValue("hashed-password"),
    },
}));

describe("Auth API", () => {
    describe("POST /api/auth/signup", () => {
        const validBody = { username: "newuser", password: "password123" };

        it("should create a new user", async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
            vi.mocked(prisma.user.create).mockResolvedValue({ id: "u1", username: "newuser" } as any);

            const request = createMockRequest("http://localhost:3000/api/auth/signup", {
                method: "POST",
                body: JSON.stringify(validBody),
            });

            const response = await signup(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.username).toBe("newuser");
            expect(prisma.user.create).toHaveBeenCalled();
        });

        it("should return 409 if user already exists", async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u1" } as any);

            const request = createMockRequest("http://localhost:3000/api/auth/signup", {
                method: "POST",
                body: JSON.stringify(validBody),
            });

            const response = await signup(request);
            expect(response.status).toBe(409);
        });

        it("should return 400 for short username", async () => {
            const request = createMockRequest("http://localhost:3000/api/auth/signup", {
                method: "POST",
                body: JSON.stringify({ username: "ab", password: "password123" }),
            });

            const response = await signup(request);
            expect(response.status).toBe(400);
        });

        it("should return 400 for short password", async () => {
            const request = createMockRequest("http://localhost:3000/api/auth/signup", {
                method: "POST",
                body: JSON.stringify({ username: "newuser", password: "123" }),
            });

            const response = await signup(request);
            expect(response.status).toBe(400);
        });
    });
});
