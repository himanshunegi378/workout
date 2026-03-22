import { beforeEach, describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/feedback/route";
import { FeedbackStatus } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import { authenticateAs, unauthenticate } from "@/tests/helpers/auth-utils";
import { jsonReq } from "@/tests/helpers/request-utils";
import { OTHER_USER_DATA, seedUser, TEST_USER_DATA } from "@/tests/helpers/seed-utils";

describe("Feedback API — Integration", () => {
    let userId: string;

    beforeEach(async () => {
        const user = await seedUser(TEST_USER_DATA);
        userId = user.id;
        authenticateAs(userId);
    });

    describe("POST /api/feedback", () => {
        it("should create a feedback entry and return 201", async () => {
            const request = jsonReq("http://localhost:3000/api/feedback", "POST", {
                description: "It would be helpful to export workout history.",
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.id).toBeDefined();
            expect(data.created_at).toBeDefined();
            expect(data.status).toBe(FeedbackStatus.Submitted);
        });

        it("should persist the feedback entry in the database for the authenticated user", async () => {
            const request = jsonReq("http://localhost:3000/api/feedback", "POST", {
                description: "Please add exercise notes to the workout flow.",
            });

            const response = await POST(request);
            const data = await response.json();

            const dbRecord = await prisma.feedback.findUnique({
                where: { id: data.id },
            });

            expect(response.status).toBe(201);
            expect(dbRecord).not.toBeNull();
            expect(dbRecord?.description).toBe("Please add exercise notes to the workout flow.");
            expect(dbRecord?.user_id).toBe(userId);
            expect(dbRecord?.status).toBe(FeedbackStatus.Submitted);
        });

        it("should trim whitespace before storing the description", async () => {
            const request = jsonReq("http://localhost:3000/api/feedback", "POST", {
                description: "   Add a rest timer shortcut on the log screen.   ",
            });

            const response = await POST(request);
            const data = await response.json();

            const dbRecord = await prisma.feedback.findUnique({
                where: { id: data.id },
            });

            expect(response.status).toBe(201);
            expect(dbRecord?.description).toBe("Add a rest timer shortcut on the log screen.");
            expect(dbRecord?.status).toBe(FeedbackStatus.Submitted);
        });

        it("should ignore any client-provided status and persist the default status", async () => {
            const request = jsonReq("http://localhost:3000/api/feedback", "POST", {
                description: "Please add keyboard shortcuts.",
                status: "Completed",
            });

            const response = await POST(request);
            const data = await response.json();

            const dbRecord = await prisma.feedback.findUnique({
                where: { id: data.id },
            });

            expect(response.status).toBe(201);
            expect(data.status).toBe(FeedbackStatus.Submitted);
            expect(dbRecord?.status).toBe(FeedbackStatus.Submitted);
        });

        it("should return 400 when description is missing", async () => {
            const request = jsonReq("http://localhost:3000/api/feedback", "POST", {});

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe("Invalid payload");
            expect(data.details.description?._errors).toContain("Invalid input: expected string, received undefined");
        });

        it("should return 400 when description is shorter than the minimum length", async () => {
            const request = jsonReq("http://localhost:3000/api/feedback", "POST", {
                description: "hey",
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe("Invalid payload");
            expect(data.details.description?._errors).toContain("Feedback must be at least 5 characters");
        });

        it("should return 400 when description exceeds the maximum length", async () => {
            const request = jsonReq("http://localhost:3000/api/feedback", "POST", {
                description: "a".repeat(1001),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe("Invalid payload");
            expect(data.details.description?._errors).toContain("Feedback must be 1000 characters or less");
        });

        it("should return 401 when not authenticated", async () => {
            unauthenticate();

            const request = jsonReq("http://localhost:3000/api/feedback", "POST", {
                description: "Please add a weekly summary email.",
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.error).toBe("Unauthorized");
        });
    });

    describe("GET /api/feedback", () => {
        it("should return an empty array when no feedback exists", async () => {
            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual([]);
        });

        it("should return the authenticated user's feedback ordered by newest first", async () => {
            await prisma.feedback.create({
                data: {
                    description: "Older feedback entry",
                    status: FeedbackStatus.UnderReview,
                    user_id: userId,
                    created_at: new Date("2026-03-20T10:00:00.000Z"),
                },
            });

            await prisma.feedback.create({
                data: {
                    description: "Newest feedback entry",
                    status: FeedbackStatus.Planned,
                    user_id: userId,
                    created_at: new Date("2026-03-21T10:00:00.000Z"),
                },
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(2);
            expect(data[0]).toMatchObject({
                description: "Newest feedback entry",
                status: FeedbackStatus.Planned,
            });
            expect(data[1]).toMatchObject({
                description: "Older feedback entry",
                status: FeedbackStatus.UnderReview,
            });
        });

        it("should not return feedback belonging to another user", async () => {
            const otherUser = await seedUser(OTHER_USER_DATA);

            await prisma.feedback.createMany({
                data: [
                    {
                        description: "My feedback",
                        status: FeedbackStatus.Submitted,
                        user_id: userId,
                    },
                    {
                        description: "Other user's feedback",
                        status: FeedbackStatus.Completed,
                        user_id: otherUser.id,
                    },
                ],
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveLength(1);
            expect(data[0].description).toBe("My feedback");
        });

        it("should include only the expected fields", async () => {
            await prisma.feedback.create({
                data: {
                    description: "Field coverage feedback",
                    status: FeedbackStatus.Submitted,
                    user_id: userId,
                },
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(Object.keys(data[0]).sort()).toEqual(
                ["created_at", "description", "id", "status", "updated_at"].sort()
            );
        });

        it("should return 401 when not authenticated", async () => {
            unauthenticate();

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.error).toBe("Unauthorized");
        });
    });
});
