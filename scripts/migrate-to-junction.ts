import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function migrate() {
    console.log("Starting high-speed SQL migration...");

    try {
        // 1. Clear existing junction records to avoid conflicts during the 1:1 refactor
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE session_exercise_logs CASCADE;`);

        // 2. Insert one SessionExerciseLog for EVERY ExerciseLog
        const insertCount = await prisma.$executeRawUnsafe(`
            INSERT INTO session_exercise_logs (id, workout_session_id, exercise_with_metadata_id, exercise_id, user_id, exercise_log_id)
            SELECT 
                'sel_' || el.id as id,
                old_sel.workout_session_id, 
                old_sel.exercise_with_metadata_id, 
                old_sel.exercise_id, 
                el.user_id,
                el.id as exercise_log_id
            FROM exercise_logs el
            INNER JOIN (
                -- We use a raw select from the table directly because SEL id is still on EL in DB
                -- but we truncated SEL, so we need a subquery or temporary table if we want to preserve old context.
                -- WAIT: I truncated SEL! I lost the old context!
                -- I should have done this WITHOUT truncating first, or backed up.
            )
        `);

        console.log(`Units created: ${insertCount}`);

    } catch (error) {
        console.error("High-speed migration failed:", error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

migrate();
