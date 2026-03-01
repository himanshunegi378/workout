import { MuscleGroup } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

export const TEST_USER_DATA = {
    username: "integration_test_user",
    password_hash: "$2b$10$fakehashforintegrationtests000000000000000000",
};

export const OTHER_USER_DATA = {
    username: "other_test_user",
    password_hash: "$2b$10$fakehashforintegrationtests000000000000000001",
};

/**
 * Seed a basic user into the test database.
 */
export async function seedUser(data = TEST_USER_DATA) {
    return prisma.user.create({ data });
}

/** 
 * Seed a full chain: User → Programme → Workout → Exercise → EWM → Session → Logs.
 * Useful for testing data that requires the full analytics view or heavy associations.
 */
export async function seedSession(userId: string, date: Date, exerciseName = "Squat", weight = 80, reps = 10) {
    const exercise = await prisma.exercise.create({
        data: { name: exerciseName, muscle_group: MuscleGroup.Legs, user_id: userId },
    });
    const programme = await prisma.programme.create({
        data: { name: "Test Prog", user_id: userId },
    });
    const workout = await prisma.workout.create({
        data: { name: "Test Workout", order_index: 0, programme_id: programme.id },
    });
    const ewm = await prisma.exerciseWithMetadata.create({
        data: {
            exercise_id: exercise.id,
            workout_id: workout.id,
            reps_min: 8, reps_max: 12,
            sets_min: 3, sets_max: 4,
            rest_min: 60, rest_max: 90,
            tempo: "3-1-2-0", order_index: 0,
        },
    });
    const session = await prisma.workoutSession.create({
        data: { user_id: userId, workout_id: workout.id, date },
    });
    const log = await prisma.exerciseLog.create({
        data: { reps, weight, set_order_index: 0, user_id: userId },
    });
    await prisma.sessionExerciseLog.create({
        data: {
            workout_session_id: session.id,
            exercise_with_metadata_id: ewm.id,
            user_id: userId,
            exercise_log_id: log.id,
        },
    });
    return { session, exercise, workout, programme, ewm, log };
}
