import { WorkoutDetailsResponse } from "../../api/query-hooks/use-workout-details";

type WorkoutDetails = WorkoutDetailsResponse["workout"];
type WorkoutSession = WorkoutDetailsResponse["session"];
type ExerciseLog = NonNullable<
    NonNullable<WorkoutSession>["sessionExerciseLogs"][number]["exerciseLog"]
>;

/**
 * Groups logged sets by prescribed exercise metadata so the live workout screen
 * can reuse one normalized structure for per-card progress and session totals.
 */
export function groupLogsByExerciseWithMetadata(session: WorkoutSession) {
    const logsByEwm: Record<string, ExerciseLog[]> = {};

    if (!session) {
        return logsByEwm;
    }

    session.sessionExerciseLogs.forEach((sessionLog) => {
        if (!sessionLog.exercise_with_metadata_id || !sessionLog.exerciseLog) {
            return;
        }

        const key = sessionLog.exercise_with_metadata_id;
        if (!logsByEwm[key]) {
            logsByEwm[key] = [];
        }

        logsByEwm[key].push(sessionLog.exerciseLog);
    });

    Object.values(logsByEwm).forEach((logs) => {
        logs.sort((a, b) => a.set_order_index - b.set_order_index);
    });

    return logsByEwm;
}

/**
 * Calculates live workout progress from both prescribed and ad-hoc exercises.
 * Ad-hoc work is counted once per exercise so multiple logged sets do not inflate
 * the "X of Y exercises done" HUD.
 */
export function calculateWorkoutProgress(workout: WorkoutDetails, session: WorkoutSession) {
    const visibleExercises = workout.exercisesWithMetadata.filter((exercise) => !exercise.is_hidden);
    const logsByEwm = groupLogsByExerciseWithMetadata(session);
    const completedAdHocExercises = new Set<string>();

    session?.sessionExerciseLogs.forEach((sessionLog) => {
        const adHocExerciseId =
            !sessionLog.exercise_with_metadata_id ? sessionLog.exerciseLog?.exerciseId : null;

        if (adHocExerciseId) {
            completedAdHocExercises.add(adHocExerciseId);
        }
    });

    const prescribedCompletedExercises = visibleExercises.filter((exercise) => {
        return (logsByEwm[exercise.id]?.length || 0) >= (exercise.sets_min || 1);
    }).length;

    const totalExercises = visibleExercises.length + completedAdHocExercises.size;
    const completedExercises = prescribedCompletedExercises + completedAdHocExercises.size;
    const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

    return {
        logsByEwm,
        totalExercises,
        completedExercises,
        progressPercentage,
    };
}
