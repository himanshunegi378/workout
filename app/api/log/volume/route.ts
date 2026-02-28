import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";

export async function GET() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessions = await prisma.workoutSession.findMany({
            where: { user_id: userId },
            select: {
                date: true,
                workout: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                exerciseLogs: {
                    select: {
                        weight: true,
                        reps: true,
                        exercise: {
                            select: {
                                name: true,
                                muscle_group: true,
                            },
                        },
                        exerciseWithMetadata: {
                            select: {
                                exercise: {
                                    select: {
                                        name: true,
                                        muscle_group: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: "asc",
            },
        });

        const dataPointsMap = new Map<string, {
            date: string;
            workoutId: string;
            workoutName: string;
            muscleGroup: string;
            volume: number;
            exercises: Map<string, number>;
        }>();

        for (const session of sessions) {
            const workoutId = session.workout?.id || "adhoc";
            const workoutName = session.workout?.name || "Ad-hoc Session";
            const dateStr = session.date.toISOString().split("T")[0];

            for (const log of session.exerciseLogs) {
                const weight = log.weight ?? 0;
                const volume = weight * log.reps;
                if (volume === 0) continue;

                const muscleGroup = log.exercise?.muscle_group || log.exerciseWithMetadata?.exercise.muscle_group;
                if (!muscleGroup) continue;

                const exerciseName = log.exercise?.name || log.exerciseWithMetadata?.exercise.name || "Unknown Exercise";
                const key = `${dateStr}-${workoutId}-${muscleGroup}`;

                if (!dataPointsMap.has(key)) {
                    dataPointsMap.set(key, {
                        date: dateStr,
                        workoutId,
                        workoutName,
                        muscleGroup,
                        volume: 0,
                        exercises: new Map<string, number>(),
                    });
                }

                const point = dataPointsMap.get(key)!;
                point.volume += volume;

                const currentExVol = point.exercises.get(exerciseName) ?? 0;
                point.exercises.set(exerciseName, currentExVol + volume);
            }
        }

        const result = Array.from(dataPointsMap.values())
            .map(point => ({
                ...point,
                exercises: Array.from(point.exercises.entries()).map(([name, volume]) => ({ name, volume })),
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch session volume:", error);
        return NextResponse.json(
            { error: "Failed to fetch session volume" },
            { status: 500 }
        );
    }
}
