import { getUserId } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { buildAnalyticsQuery } from "@/app/features/analytics/server/analytics-service";
import { AnalyticsQueryPayloadSchema } from "@/app/features/analytics/server/analytics-validation";

export async function POST(request: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const result = AnalyticsQueryPayloadSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid payload", details: result.error.format() },
                { status: 400 }
            );
        }

        const payload = result.data;

        // Build and execute the custom analytics query
        const data = await buildAnalyticsQuery(payload, userId);

        return NextResponse.json({
            meta: {
                dimensions: payload.dimensions,
                metrics: payload.metrics.map((m) => m.alias),
            },
            data,
        });
    } catch (error) {
        console.error("Failed to query analytics view:", error);
        return NextResponse.json(
            { error: "Failed to query analytics" },
            { status: 500 }
        );
    }
}
