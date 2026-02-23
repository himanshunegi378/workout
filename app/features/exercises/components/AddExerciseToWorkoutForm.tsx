"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui";
import { useAddExerciseToWorkout } from "../api/mutation-hooks/use-add-exercise-to-workout";

interface Exercise {
    id: string;
    name: string;
    muscle_group: string;
}

interface Props {
    groupId: string;
    workoutId: string;
    exercises: Exercise[];
}

export function AddExerciseToWorkoutForm({ groupId, workoutId, exercises }: Props) {
    const router = useRouter();

    const [exerciseId, setExerciseId] = useState("");
    const [setsMin, setSetsMin] = useState("3");
    const [setsMax, setSetsMax] = useState("4");
    const [repsMin, setRepsMin] = useState("8");
    const [repsMax, setRepsMax] = useState("12");
    const [restMin, setRestMin] = useState("60");
    const [restMax, setRestMax] = useState("90");
    const [tempo, setTempo] = useState("2-0-1-0");

    const { mutate: addExercise, isPending, error: mutationError } = useAddExerciseToWorkout();

    const canSubmit = exerciseId !== "" && setsMin && repsMin && restMin && tempo;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;

        addExercise(
            {
                groupId,
                workoutId,
                data: {
                    exercise_id: exerciseId,
                    sets_min: parseInt(setsMin),
                    sets_max: parseInt(setsMax) || parseInt(setsMin),
                    reps_min: parseInt(repsMin),
                    reps_max: parseInt(repsMax) || parseInt(repsMin),
                    rest_min: parseInt(restMin),
                    rest_max: parseInt(restMax) || parseInt(restMin),
                    tempo: tempo.trim(),
                },
            },
            {
                onSuccess: () => {
                    router.push(`/groups/${groupId}/workouts/${workoutId}`);
                    router.refresh();
                },
            }
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            {/* Exercise Selection */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="exercise">
                    Exercise
                </label>
                <select
                    id="exercise"
                    value={exerciseId}
                    onChange={(e) => setExerciseId(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl
                             px-4 py-3 text-foreground
                             focus:outline-none focus:ring-2 focus:ring-ring
                             focus:border-accent transition-all duration-200
                             font-body text-base appearance-none"
                >
                    <option value="" disabled>Select an exercise...</option>
                    {exercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                            {ex.name} ({ex.muscle_group})
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Sets */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Sets (Min - Max)</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="1"
                            value={setsMin}
                            onChange={(e) => setSetsMin(e.target.value)}
                            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-ring focus:border-accent"
                        />
                        <span className="text-muted-foreground">-</span>
                        <input
                            type="number"
                            min="1"
                            value={setsMax}
                            onChange={(e) => setSetsMax(e.target.value)}
                            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-ring focus:border-accent"
                        />
                    </div>
                </div>

                {/* Reps */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Reps (Min - Max)</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="1"
                            value={repsMin}
                            onChange={(e) => setRepsMin(e.target.value)}
                            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-ring focus:border-accent"
                        />
                        <span className="text-muted-foreground">-</span>
                        <input
                            type="number"
                            min="1"
                            value={repsMax}
                            onChange={(e) => setRepsMax(e.target.value)}
                            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-ring focus:border-accent"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Rest Time */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Rest (Seconds)</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            step="10"
                            value={restMin}
                            onChange={(e) => setRestMin(e.target.value)}
                            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-ring focus:border-accent"
                        />
                        <span className="text-muted-foreground">-</span>
                        <input
                            type="number"
                            min="0"
                            step="10"
                            value={restMax}
                            onChange={(e) => setRestMax(e.target.value)}
                            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-ring focus:border-accent"
                        />
                    </div>
                </div>

                {/* Tempo */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground" htmlFor="tempo">Tempo</label>
                    <input
                        id="tempo"
                        type="text"
                        placeholder="e.g. 2-0-1-0"
                        value={tempo}
                        onChange={(e) => setTempo(e.target.value)}
                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring focus:border-accent"
                    />
                </div>
            </div>

            {mutationError && (
                <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-danger text-sm animate-slide-up">
                    {mutationError instanceof Error ? mutationError.message : "Something went wrong"}
                </div>
            )}

            <Button type="submit" variant="primary" disabled={!canSubmit || isPending} className="w-full">
                {isPending ? "Adding…" : "Add to Workout"}
            </Button>
        </form>
    );
}
