import "dotenv/config";
import { buildAnalyticsQuery } from "../app/features/analytics/server/analytics-service";
import type { AnalyticsQueryPayload } from "../app/features/analytics/server/analytics-validation";

async function runTestAvgWeight() {
    const userId = "cmlykppdq000017tqixix1fnk"; // known valid user id from previous db response

    const payload: AnalyticsQueryPayload = {
        metrics: [
            { field: "weight", aggregation: "avg", alias: "avg_weight" }
        ],
        dimensions: ["week_start"],
        filters: [
            { field: "exercise_name", operator: "in", value: ["Bench Press", "Incline Dumbbell Press"] }
        ],
        order_by: [
            { field: "week_start", direction: "asc" }
        ],
        limit: 10
    };

    console.log("Testing buildAnalyticsQuery (Weekly Avg Weight)...");
    try {
        const data = await buildAnalyticsQuery(payload, userId);
        console.log("Success! Data:");
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Query Failed:", error);
    }
}

runTestAvgWeight();
