import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/auth/signup/route";
import prisma from "@/lib/prisma";
import { createMockRequest } from "@/tests/helpers/request-utils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function signupRequest(body: Record<string, unknown>) {
    return createMockRequest("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/auth/signup — Integration", () => {
    it("should create a new user and return 201", async () => {
        const request = signupRequest({ username: "newuser", password: "secret123" });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data).toMatchObject({ username: "newuser" });
        expect(data.id).toBeDefined();
        // Must not return password hash
        expect(data.password_hash).toBeUndefined();
    });

    it("should lowercase the username before storing", async () => {
        const request = signupRequest({ username: "MixedCase", password: "password1" });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.username).toBe("mixedcase");
    });

    it("should persist the user in the database", async () => {
        const request = signupRequest({ username: "persisted", password: "password1" });
        await POST(request);

        const user = await prisma.user.findUnique({ where: { username: "persisted" } });
        expect(user).not.toBeNull();
        expect(user!.username).toBe("persisted");
        expect(user!.password_hash).toBeDefined();
        expect(user!.password_hash).not.toBe("password1"); // must be hashed
    });

    it("should return 400 when username is shorter than 3 characters", async () => {
        const request = signupRequest({ username: "ab", password: "password1" });
        const response = await POST(request);

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toMatch(/3 characters/i);
    });

    it("should return 400 when password is shorter than 6 characters", async () => {
        const request = signupRequest({ username: "validuser", password: "12345" });
        const response = await POST(request);

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toMatch(/6 characters/i);
    });

    it("should return 400 when username is missing", async () => {
        const request = signupRequest({ password: "password1" });
        const response = await POST(request);
        expect(response.status).toBe(400);
    });

    it("should return 400 when password is missing", async () => {
        const request = signupRequest({ username: "validuser" });
        const response = await POST(request);
        expect(response.status).toBe(400);
    });

    it("should return 409 when username is already taken", async () => {
        // Create user first
        await POST(signupRequest({ username: "taken", password: "password1" }));

        // Try again with same username
        const response = await POST(signupRequest({ username: "taken", password: "different1" }));
        expect(response.status).toBe(409);
        const data = await response.json();
        expect(data.error).toMatch(/already taken/i);
    });

    it("should be case-insensitive for duplicate check (MixedCase vs mixedcase)", async () => {
        await POST(signupRequest({ username: "DuplicateCheck", password: "password1" }));
        // Same username, different casing — both normalize to "duplicatecheck"
        const response = await POST(signupRequest({ username: "duplicatecheck", password: "other123" }));
        expect(response.status).toBe(409);
    });
});
