"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Button, NumberStepper, muscleColorMap, BottomDrawer } from "@/app/components/ui";
import { useExercises } from "../api/query-hooks/use-exercises";
import { useAddExerciseToWorkout } from "../api/mutation-hooks/use-add-exercise-to-workout";
import { ExerciseSelectDrawer } from "./ExerciseSelectDrawer";

interface AddExerciseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    programmeId: string;
    workoutId: string;
}

/**
 * A comprehensive drawer component for adding a new exercise to a specific workout within a programme.
 * 
 * Context:
 * This component acts as the primary interface for users to customize their workouts. 
 * It manages the state for exercise selection (via ExerciseSelectDrawer) and exercise-specific 
 * parameters like sets, reps, rest periods, and tempo.
 * 
 * Why:
 * - Centralized Configuration: By consolidating all exercise parameters into one drawer, 
 *   it simplifies the user flow for building or modifying a workout session.
 * - Input Validation: Ensures that only valid exercise configurations (e.g., non-empty sets/reps) 
 *   can be submitted to the backend.
 * - Integration: Directly connects with the `useAddExerciseToWorkout` mutation to persist changes.
 */
export function AddExerciseDrawer({ isOpen, onClose, programmeId, workoutId }: AddExerciseDrawerProps) {
    const { data: exercises = [] } = useExercises();

    const [exerciseId, setExerciseId] = useState("");
    const [isSelectDrawerOpen, setIsSelectDrawerOpen] = useState(false);

    const [sets, setSets] = useState(3);
    const [reps, setReps] = useState(10);
    const [rest, setRest] = useState(60);
    const [tempo, setTempo] = useState("2-0-1-0");

    const selectedExercise = exercises.find((ex: { id: string; name: string; muscle_group: string }) => ex.id === exerciseId);

    const { mutate: addExercise, isPending, error: mutationError } = useAddExerciseToWorkout();

    const canSubmit = exerciseId !== "" && sets > 0 && reps > 0 && rest >= 0 && tempo;

    function handleSubmit() {
        if (!canSubmit) return;

        addExercise(
            {
                programmeId,
                workoutId,
                data: {
                    exercise_id: exerciseId,
                    sets_min: sets,
                    sets_max: sets,
                    reps_min: reps,
                    reps_max: reps,
                    rest_min: rest,
                    rest_max: rest,
                    tempo: tempo.trim(),
                },
            },
            {
                onSuccess: () => {
                    setExerciseId("");
                    setSets(3);
                    setReps(10);
                    setRest(60);
                    setTempo("2-0-1-0");
                    onClose();
                },
            }
        );
    }

    return (
        <>
            <BottomDrawer isOpen={isOpen} onClose={onClose} title="Add Exercise" height="85vh">
                <div className="flex flex-1 flex-col gap-6 overflow-y-auto no-scrollbar">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Exercise</label>
                        <button
                            type="button"
                            onClick={() => setIsSelectDrawerOpen(true)}
                            className="flex w-full items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-left transition-colors hover:border-accent/30 hover:bg-muted/20 active:scale-[0.98]"
                        >
                            {selectedExercise ? (
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-1.5 h-6 rounded-full shrink-0 ${muscleColorMap[selectedExercise.muscle_group as keyof typeof muscleColorMap] || "bg-accent"
                                            }`}
                                    />
                                    <div>
                                        <span className="block text-foreground font-medium text-base leading-none">
                                            {selectedExercise.name}
                                        </span>
                                        <span className="block text-muted-foreground text-xs mt-1 capitalize leading-none">
                                            {selectedExercise.muscle_group}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-muted-foreground/50 text-base">Select an exercise...</span>
                            )}
                            <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <NumberStepper label="Sets" value={sets} onChange={setSets} min={1} max={20} />
                        <NumberStepper label="Reps" value={reps} onChange={setReps} min={1} max={100} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <NumberStepper label="Rest" value={rest} onChange={setRest} min={0} max={600} step={10} suffix="s" />
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground" htmlFor="tempo">Tempo</label>
                            <input
                                id="tempo"
                                type="text"
                                placeholder="e.g. 2-0-1-0"
                                value={tempo}
                                onChange={(e) => setTempo(e.target.value)}
                                className="h-12 w-full rounded-2xl border border-border/70 bg-background/60 px-4 text-center font-display text-lg font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-auto shrink-0 border-t border-border/50 pt-4">
                    {mutationError && (
                        <div className="mb-4 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                            {mutationError instanceof Error ? mutationError.message : "Something went wrong"}
                        </div>
                    )}
                    <Button
                        onClick={handleSubmit}
                        variant="primary"
                        disabled={!canSubmit || isPending}
                        className="w-full py-4 text-base shadow-none"
                    >
                        {isPending ? "Adding…" : <span className="flex items-center gap-2"><Plus className="w-5 h-5" /> Add to Workout</span>}
                    </Button>
                </div>
            </BottomDrawer>

            <ExerciseSelectDrawer
                isOpen={isSelectDrawerOpen}
                onClose={() => setIsSelectDrawerOpen(false)}
                exercises={exercises}
                selectedId={exerciseId}
                onSelect={(id) => setExerciseId(id)}
            />
        </>
    );
}
