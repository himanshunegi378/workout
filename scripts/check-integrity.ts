import "dotenv/config";
import { Client } from "pg";

async function main() {
    const client = new Client({
        connectionString: process.env.DIRECT_URL,
    });

    await client.connect();

    const selCount = await client.query("SELECT count(*) FROM session_exercise_logs;");
    const elCount = await client.query("SELECT count(*) FROM exercise_logs;");

    console.log("SessionExerciseLog count:", selCount.rows[0].count);
    console.log("ExerciseLog count:", elCount.rows[0].count);

    // Check columns in exercise_logs
    const columns = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'exercise_logs';
  `);
    console.log("ExerciseLog columns:", columns.rows.map(r => r.column_name).join(", "));

    await client.end();
}

main().catch(console.error);
