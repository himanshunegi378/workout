import { getUserId } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { getHeatmapActivity } from "@/app/features/analytics/server/analytics-service";

export async function GET() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await getHeatmapActivity(userId);

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Failed to fetch heatmap activity:", error);
        return NextResponse.json(
            { error: "Failed to fetch activity data" },
            { status: 500 }
        );
    }
}
