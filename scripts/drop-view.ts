import "dotenv/config";
import { Client } from "pg";

async function main() {
    const client = new Client({
        connectionString: process.env.DIRECT_URL,
    });

    await client.connect();
    console.log("Dropping exercise_analytics_view...");
    await client.query(`DROP VIEW IF EXISTS exercise_analytics_view CASCADE;`);
    console.log("View dropped.");
    await client.end();
}

main().catch(console.error);
