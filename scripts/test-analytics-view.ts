import "dotenv/config";
import prisma from "../lib/prisma";

async function main() {
    console.log("Testing exercise_analytics_view...");

    // Try to query the view
    const logs = await prisma.exercise_analytics_view.findMany({
        take: 5,
    });

    console.log("Successfully fetched from view:");
    console.log(JSON.stringify(logs, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // If it's standard Prisma, we disconnect. If it's a global client, it might not need it, but it's safe to call.
        if (prisma && '$disconnect' in prisma && typeof prisma.$disconnect === 'function') {
            await prisma.$disconnect();
        }
    });
