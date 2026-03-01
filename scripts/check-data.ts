import { PrismaClient } from "../app/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkData() {
    try {
        const totalLogs = await (prisma as any).exerciseLog.count();
        console.log(`Total ExerciseLogs: ${totalLogs}`);

        const totalJunctions = await (prisma as any).sessionExerciseLog.count();
        console.log(`Total SessionExerciseLogs: ${totalJunctions}`);

        // Check if logs are linked
        const logsWithJunction = await (prisma as any).exerciseLog.count({
            where: { sessionExerciseLog: { isNot: null } }
        });
        console.log(`Logs with Junction: ${logsWithJunction}`);

        // Try to query raw to see if old columns exist
        try {
            const oldColumns = await prisma.$queryRawUnsafe(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'exercise_logs' 
                AND column_name IN ('workout_session_id', 'exercise_with_metadata_id', 'exercise_id');
            `);
            console.log("Old columns still in DB:", oldColumns);
        } catch (e) {
            console.log("Could not check old columns:", e);
        }

        const sampleJunctions = await (prisma as any).sessionExerciseLog.findMany({
            take: 3,
            include: {
                exerciseLog: true,
                workoutSession: {
                    select: { id: true, date: true }
                }
            }
        });
        console.log("Sample Junctions:", JSON.stringify(sampleJunctions, null, 2));

    } catch (error) {
        console.error("Check failed:", error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

checkData();
