import { PrismaClient } from "../app/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
    try {
        const userId = "cmlykppdq000017tqixix1fnk"; // Using user_id from check-data output
        console.log(`Testing with user_id: ${userId}`);

        const sessions = await prisma.workoutSession.findMany({
            where: { user_id: userId },
            orderBy: { date: "desc" },
            take: 10,
            select: {
                id: true,
                date: true,
                sessionExerciseLogs: {
                    select: {
                        id: true,
                        exercise_with_metadata_id: true,
                        exerciseLog: {
                            select: {
                                id: true,
                                weight: true,
                                reps: true,
                                set_order_index: true,
                                exercise: {
                                    select: {
                                        id: true,
                                        name: true,
                                        muscle_group: true,
                                    },
                                },
                            },
                        },
                        exerciseWithMetadata: {
                            select: {
                                exercise: {
                                    select: {
                                        id: true,
                                        name: true,
                                        muscle_group: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        console.log(`Found ${sessions.length} sessions.`);
        if (sessions.length > 0) {
            const s = sessions[0];
            const hasLogs = s.sessionExerciseLogs.some((sel) =>
                sel.exerciseWithMetadata?.exercise || sel.exerciseLog?.exercise
            );
            console.log(`Session 0 has logs? ${hasLogs}`);
            if (!hasLogs) {
                console.log("Sample SessionExerciseLog:", JSON.stringify(s.sessionExerciseLogs[0], null, 2));
            }
        }
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

test();
