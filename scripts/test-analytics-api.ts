import "dotenv/config";
import { buildAnalyticsQuery } from "../app/features/analytics/server/analytics-service";
import type { AnalyticsQueryPayload } from "../app/features/analytics/server/analytics-validation";

async function runTest() {
    const userId = "cmlykppdq000017tqixix1fnk"; // known valid user id from previous db response

    const payload: AnalyticsQueryPayload = {
        metrics: [
            { field: "volume", aggregation: "sum", alias: "total_volume" }
        ],
        dimensions: ["exercise_name"],
        filters: [
            { field: "is_ad_hoc_exercise", operator: "=", value: false }
        ],
        order_by: [
            { field: "total_volume", direction: "desc" }
        ],
        limit: 10
    };

    console.log("Testing buildAnalyticsQuery...");
    try {
        const data = await buildAnalyticsQuery(payload, userId);
        console.log("Success! Data:");
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Query Failed:", error);
    }
}

runTest();
