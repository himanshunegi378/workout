import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

const MIN_DESCRIPTION_LENGTH = 5;
const MAX_DESCRIPTION_LENGTH = 1000;

const FeedbackPayloadSchema = z.object({
    description: z.string()
        .trim()
        .min(MIN_DESCRIPTION_LENGTH, `Feedback must be at least ${MIN_DESCRIPTION_LENGTH} characters`)
        .max(MAX_DESCRIPTION_LENGTH, `Feedback must be ${MAX_DESCRIPTION_LENGTH} characters or less`),
});

/**
 * Returns previously submitted feedback records for the authenticated user.
 */
export async function GET() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const feedbackEntries = await prisma.feedback.findMany({
            where: { user_id: userId },
            orderBy: { created_at: "desc" },
            select: {
                id: true,
                description: true,
                status: true,
                created_at: true,
                updated_at: true,
            },
        });

        return NextResponse.json(feedbackEntries);
    } catch (error) {
        console.error("Failed to fetch feedback:", error);
        return NextResponse.json(
            { error: "Failed to fetch feedback" },
            { status: 500 }
        );
    }
}

/**
 * Creates a new feedback record for the authenticated user.
 */
export async function POST(request: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const result = FeedbackPayloadSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid payload", details: result.error.format() },
                { status: 400 }
            );
        }

        const { description } = result.data;

        const feedback = await prisma.feedback.create({
            data: {
                description,
                user_id: userId,
            },
            select: {
                id: true,
                status: true,
                created_at: true,
            },
        });

        return NextResponse.json(feedback, { status: 201 });
    } catch (error) {
        console.error("Failed to create feedback:", error);
        return NextResponse.json(
            { error: "Failed to submit feedback" },
            { status: 500 }
        );
    }
}
