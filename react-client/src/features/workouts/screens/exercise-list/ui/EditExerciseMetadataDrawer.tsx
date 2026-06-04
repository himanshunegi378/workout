"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Save } from "lucide-react";
import { Button, NumberStepper, muscleColorMap, BottomDrawer } from "@/components/ui";
import { useExercises } from "@/features/exercises/api/query-hooks/use-exercises";
import { useEditExerciseMetadata } from "@/features/exercises/api/mutation-hooks/use-edit-exercise-metadata";
import { ExerciseSelectDrawer } from "@/features/exercises/ui/ExerciseSelectDrawer";
import { ExerciseWithMetadata } from "../../../types";

interface EditExerciseMetadataDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    programmeId: string;
    workoutId: string;
    /** The domain object representing the exercise and its current protocol. */
    ewm: ExerciseWithMetadata;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate?: (newEwm: any) => void;
}

/**
 * A specialized drawer for modifying the parameters (sets, reps, rest, tempo) 
 * of an exercise already present in a workout.
 */
export function EditExerciseMetadataDrawer({
    isOpen,
    onClose,
    programmeId,
    workoutId,
    ewm,
    onUpdate,
}: EditExerciseMetadataDrawerProps) {
    const [exerciseId, setExerciseId] = useState(ewm.exercise_id);
    const [isSelectDrawerOpen, setIsSelectDrawerOpen] = useState(false);
    const [sets, setSets] = useState(ewm.sets_min ?? 0);
    const [reps, setReps] = useState(ewm.reps_min ?? 0);
    const [rest, setRest] = useState(ewm.rest_min ?? 0);
    const [tempo, setTempo] = useState(ewm.tempo ?? "");

    const { data: exercises = [] } = useExercises();
    const selectedExercise = exercises.find((ex: { id: string; name: string; muscle_group: string }) => ex.id === exerciseId);
    const { mutate: editMetadata, isPending } = useEditExerciseMetadata({
        programmeId,
        workoutId,
        metadataId: ewm.id,
    });

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setExerciseId(ewm.exercise_id);
            setSets(ewm.sets_min ?? 0);
            setReps(ewm.reps_min ?? 0);
            setRest(ewm.rest_min ?? 0);
            setTempo(ewm.tempo ?? "");
        }
    }, [isOpen, ewm]);

    const handleSave = () => {
        editMetadata(
            {
                exercise_id: exerciseId,
                sets_min: sets,
                sets_max: sets,
                reps_min: reps,
                reps_max: reps,
                rest_min: rest,
                rest_max: rest,
                tempo,
            },
            {
                onSuccess: (newEwm) => {
                    onUpdate?.(newEwm);
                    onClose();
                },
            }
        );
    };

    return (
        <>
            <BottomDrawer isOpen={isOpen} onClose={onClose} title={`Edit ${ewm.exercise.name}`}>
                <div className="max-h-[70vh] space-y-6 overflow-y-auto pb-2 no-scrollbar">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Exercise</label>
                        <button
                            type="button"
                            onClick={() => setIsSelectDrawerOpen(true)}
                            className="flex w-full items-center justify-between rounded-2xl bg-background/50 px-4 py-3 text-left transition-colors hover:bg-muted/20 active:scale-[0.98]"
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
                            <label className="text-sm font-medium text-foreground" htmlFor="edit-tempo">Tempo</label>
                            <input
                                id="edit-tempo"
                                type="text"
                                placeholder="e.g. 2-0-1-0"
                                value={tempo}
                                onChange={(e) => setTempo(e.target.value)}
                                className="h-12 w-full rounded-2xl bg-background/50 px-4 text-center font-display text-lg font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
                            />
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleSave}
                    variant="primary"
                    className="mt-4 w-full py-4 text-base shadow-none"
                    disabled={isPending}
                >
                    {isPending ? "Saving..." : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>}
                </Button>
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
