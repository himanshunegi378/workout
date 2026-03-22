import "dotenv/config";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { FeedbackStatus } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

/**
 * Formats a UTC date for the markdown report.
 */
export function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
    }).format(date);
}

type FeedbackExportEntry = {
    id: string;
    description: string;
    status: FeedbackStatus;
    created_at: Date;
    user: {
        username: string;
    };
};

/**
 * Human-readable explanations for each feedback workflow status.
 */
export const FEEDBACK_STATUS_MEANINGS: Record<FeedbackStatus, string> = {
    Submitted: "Newly submitted and waiting for triage.",
    UnderReview: "Reviewed and currently being evaluated.",
    Planned: "Accepted and planned for a future update.",
    Completed: "Implemented and shipped.",
    Rejected: "Reviewed but not planned for implementation.",
};

/**
 * Builds the `feedback.md` contents from feedback rows.
 */
export function buildFeedbackMarkdown(feedbackEntries: FeedbackExportEntry[], generatedAt = new Date()) {
    const lines: string[] = [
        "# Feedback",
        "",
        `Generated at: ${formatDate(generatedAt)} UTC`,
        `Total entries: ${feedbackEntries.length}`,
        "",
        "## Status Guide",
        "",
        ...Object.entries(FEEDBACK_STATUS_MEANINGS).map(([status, meaning]) => `- ${status}: ${meaning}`),
        "",
        "## Entries",
        "",
    ];

    if (feedbackEntries.length === 0) {
        lines.push("No feedback entries found.");
    } else {
        for (const [index, entry] of feedbackEntries.entries()) {
            lines.push(`### ${index + 1}. ${entry.user.username}`);
            lines.push(`- Submitted: ${formatDate(entry.created_at)} UTC`);
            lines.push(`- Status: ${entry.status}`);
            lines.push(`- Feedback ID: ${entry.id}`);
            lines.push("");
            lines.push(entry.description);
            lines.push("");
        }
    }

    return `${lines.join("\n").trimEnd()}\n`;
}

/**
 * Queries feedback from the database and rewrites `feedback.md`.
 */
export async function exportFeedback() {
    const feedbackEntries = await prisma.feedback.findMany({
        orderBy: { created_at: "desc" },
        include: {
            user: {
                select: {
                    username: true,
                },
            },
        },
    });

    const outputPath = path.join(process.cwd(), "feedback.md");
    await writeFile(outputPath, buildFeedbackMarkdown(feedbackEntries), "utf8");

    console.log(`Updated ${outputPath} with ${feedbackEntries.length} feedback entr${feedbackEntries.length === 1 ? "y" : "ies"}.`);
}

/**
 * CLI entry point for generating the feedback report.
 */
async function main() {
    try {
        await exportFeedback();
    } catch (error) {
        console.error("Failed to export feedback:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    void main();
}
