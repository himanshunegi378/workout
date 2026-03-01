"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Save } from "lucide-react";
import { Button, NumberStepper, muscleColorMap, BottomDrawer } from "@/app/components/ui";
import { useExercises } from "@/app/features/exercises/api/query-hooks/use-exercises";
import { useEditExerciseMetadata } from "@/app/features/exercises/api/mutation-hooks/use-edit-exercise-metadata";
import { ExerciseSelectDrawer } from "@/app/features/exercises/components/ExerciseSelectDrawer";

interface EditExerciseMetadataDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    programmeId: string;
    workoutId: string;
    metadataId: string;
    exerciseName: string;
    initialData: {
        exerciseId: string;
        setsMin: number;
        setsMax: number;
        repsMin: number;
        repsMax: number;
        restMin: number;
        restMax: number;
        tempo: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate?: (newEwm: any) => void;
}

export function EditExerciseMetadataDrawer({
    isOpen,
    onClose,
    programmeId,
    workoutId,
    metadataId,
    exerciseName,
    initialData,
    onUpdate,
}: EditExerciseMetadataDrawerProps) {
    const [exerciseId, setExerciseId] = useState(initialData.exerciseId);
    const [isSelectDrawerOpen, setIsSelectDrawerOpen] = useState(false);
    const [sets, setSets] = useState(initialData.setsMin);
    const [reps, setReps] = useState(initialData.repsMin);
    const [rest, setRest] = useState(initialData.restMin);
    const [tempo, setTempo] = useState(initialData.tempo);

    const { data: exercises = [] } = useExercises();
    const selectedExercise = exercises.find((ex: { id: string; name: string; muscle_group: string }) => ex.id === exerciseId);
    const { mutate: editMetadata, isPending } = useEditExerciseMetadata({
        programmeId,
        workoutId,
        metadataId,
    });

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setExerciseId(initialData.exerciseId);
            setSets(initialData.setsMin);
            setReps(initialData.repsMin);
            setRest(initialData.restMin);
            setTempo(initialData.tempo);
        }
    }, [isOpen, initialData]);

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
            <BottomDrawer isOpen={isOpen} onClose={onClose} title={`Edit ${exerciseName}`}>
                <div className="space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar pb-2">
                    {/* Exercise Selector */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Exercise</label>
                        <button
                            type="button"
                            onClick={() => setIsSelectDrawerOpen(true)}
                            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-left flex items-center justify-between transition-all hover:bg-muted/80 active:scale-[0.98] elevation-2"
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

                    <div className="grid grid-cols-2 gap-4">
                        <NumberStepper label="Sets" value={sets} onChange={setSets} min={1} max={20} />
                        <NumberStepper label="Reps" value={reps} onChange={setReps} min={1} max={100} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <NumberStepper label="Rest" value={rest} onChange={setRest} min={0} max={600} step={10} suffix="s" />
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground" htmlFor="edit-tempo">Tempo</label>
                            <input
                                id="edit-tempo"
                                type="text"
                                placeholder="e.g. 2-0-1-0"
                                value={tempo}
                                onChange={(e) => setTempo(e.target.value)}
                                className="w-full bg-muted border border-border rounded-xl px-4 h-12 text-center font-display font-semibold text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent elevation-2"
                            />
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleSave}
                    variant="primary"
                    className="w-full py-4 text-base mt-4 shadow-accent/20 shadow-lg"
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
