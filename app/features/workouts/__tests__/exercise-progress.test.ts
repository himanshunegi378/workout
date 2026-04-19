import { describe, expect, it } from "vitest";
import { calculateWorkoutProgress } from "../screens/exercise-list/progress";
import { WorkoutDetailsResponse } from "../api/query-hooks/use-workout-details";

describe("calculateWorkoutProgress", () => {
    it("counts ad-hoc exercises in live progress without duplicating multiple sets", () => {
        const workout: WorkoutDetailsResponse["workout"] = {
            id: "work-1",
            name: "Push Day",
            exercisesWithMetadata: [
                {
                    id: "ewm-1",
                    exercise_id: "exercise-1",
                    sets_min: 2,
                    sets_max: 3,
                    reps_min: 8,
                    reps_max: 10,
                    rest_min: 60,
                    rest_max: 90,
                    tempo: "2-0-2-0",
                    is_hidden: false,
                    exercise: {
                        id: "exercise-1",
                        name: "Bench Press",
                        muscle_group: "Chest",
                    },
                },
                {
                    id: "ewm-hidden",
                    exercise_id: "exercise-hidden",
                    sets_min: 1,
                    sets_max: 1,
                    reps_min: 10,
                    reps_max: 12,
                    rest_min: 45,
                    rest_max: 60,
                    tempo: "2-1-2-0",
                    is_hidden: true,
                    exercise: {
                        id: "exercise-hidden",
                        name: "Hidden Fly",
                        muscle_group: "Chest",
                    },
                },
            ],
        };

        const session: NonNullable<WorkoutDetailsResponse["session"]> = {
            id: "session-1",
            start_time: "2026-04-19T10:00:00.000Z",
            end_time: null,
            sessionExerciseLogs: [
                {
                    id: "sel-1",
                    exercise_with_metadata_id: "ewm-1",
                    exercise_id: null,
                    exerciseLog: {
                        id: "log-1",
                        exerciseId: null,
                        weight: 100,
                        reps: 8,
                        rpe: 8,
                        set_order_index: 1,
                    },
                },
                {
                    id: "sel-2",
                    exercise_with_metadata_id: "ewm-1",
                    exercise_id: null,
                    exerciseLog: {
                        id: "log-2",
                        exerciseId: null,
                        weight: 100,
                        reps: 8,
                        rpe: 8,
                        set_order_index: 0,
                    },
                },
                {
                    id: "sel-3",
                    exercise_with_metadata_id: null,
                    exercise_id: "exercise-2",
                    exerciseLog: {
                        id: "log-3",
                        exerciseId: "exercise-2",
                        weight: 20,
                        reps: 12,
                        rpe: 7,
                        set_order_index: 0,
                    },
                },
                {
                    id: "sel-4",
                    exercise_with_metadata_id: null,
                    exercise_id: "exercise-2",
                    exerciseLog: {
                        id: "log-4",
                        exerciseId: "exercise-2",
                        weight: 22.5,
                        reps: 10,
                        rpe: 8,
                        set_order_index: 1,
                    },
                },
            ],
        };

        const progress = calculateWorkoutProgress(workout, session);

        expect(progress.logsByEwm["ewm-1"]?.map((log) => log.id)).toEqual(["log-2", "log-1"]);
        expect(progress.totalExercises).toBe(2);
        expect(progress.completedExercises).toBe(2);
        expect(progress.progressPercentage).toBe(100);
    });
});
