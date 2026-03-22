import { beforeEach, describe, expect, it, vi } from "vitest";

const writeFileMock = vi.fn();
const findManyMock = vi.fn();

vi.mock("node:fs/promises", () => ({
    writeFile: writeFileMock,
}));

vi.mock("@/lib/prisma", () => ({
    default: {
        feedback: {
            findMany: findManyMock,
        },
        $disconnect: vi.fn(),
    },
}));

describe("export-feedback script", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("builds markdown for an empty feedback list", async () => {
        const { buildFeedbackMarkdown } = await import("./export-feedback");

        const markdown = buildFeedbackMarkdown([], new Date("2026-03-22T16:00:00.000Z"));

        expect(markdown).toContain("# Feedback");
        expect(markdown).toContain("Total entries: 0");
        expect(markdown).toContain("## Status Guide");
        expect(markdown).toContain("- Submitted: Newly submitted and waiting for triage.");
        expect(markdown).toContain("No feedback entries found.");
    });

    it("builds markdown with feedback entries and usernames", async () => {
        const { buildFeedbackMarkdown } = await import("./export-feedback");

        const markdown = buildFeedbackMarkdown(
            [
                {
                    id: "fb_1",
                    description: "Please add exercise notes.",
                    status: "UnderReview",
                    created_at: new Date("2026-03-21T10:15:00.000Z"),
                    user: { username: "alice" },
                },
                {
                    id: "fb_2",
                    description: "A dark mode timer would help.",
                    status: "Planned",
                    created_at: new Date("2026-03-20T08:45:00.000Z"),
                    user: { username: "bob" },
                },
            ],
            new Date("2026-03-22T16:00:00.000Z")
        );

        expect(markdown).toContain("Total entries: 2");
        expect(markdown).toContain("### 1. alice");
        expect(markdown).toContain("### 2. bob");
        expect(markdown).toContain("Please add exercise notes.");
        expect(markdown).toContain("Feedback ID: fb_1");
        expect(markdown).toContain("- Status: UnderReview");
    });

    it("queries feedback and writes the markdown file", async () => {
        findManyMock.mockResolvedValue([
            {
                id: "fb_123",
                description: "Exporting logs would be helpful.",
                status: "Submitted",
                created_at: new Date("2026-03-21T10:15:00.000Z"),
                user: { username: "himanshu" },
            },
        ]);

        const { exportFeedback } = await import("./export-feedback");

        await exportFeedback();

        expect(findManyMock).toHaveBeenCalledWith({
            orderBy: { created_at: "desc" },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        expect(writeFileMock).toHaveBeenCalledTimes(1);
        expect(writeFileMock.mock.calls[0]?.[0]).toMatch(/feedback\.md$/);
        expect(writeFileMock.mock.calls[0]?.[1]).toContain("Exporting logs would be helpful.");
        expect(writeFileMock.mock.calls[0]?.[1]).toContain("- Status: Submitted");
        expect(writeFileMock.mock.calls[0]?.[2]).toBe("utf8");
    });
});
