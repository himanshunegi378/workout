"use client";

import { useState, useEffect } from "react";
import { X, Hash, Repeat, Timer, Activity, Save } from "lucide-react";
import { Button, Portal } from "@/app/components/ui";
import { useExercises } from "@/app/features/exercises/api/query-hooks/use-exercises";
import { useEditExerciseMetadata } from "@/app/features/exercises/api/mutation-hooks/use-edit-exercise-metadata";

interface EditExerciseMetadataDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
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
    onUpdate?: (newEwm: any) => void;
}

export function EditExerciseMetadataDrawer({
    isOpen,
    onClose,
    groupId,
    workoutId,
    metadataId,
    exerciseName,
    initialData,
    onUpdate,
}: EditExerciseMetadataDrawerProps) {
    const [exerciseId, setExerciseId] = useState(initialData.exerciseId);
    const [setsMin, setSetsMin] = useState(initialData.setsMin.toString());
    const [setsMax, setSetsMax] = useState(initialData.setsMax.toString());
    const [repsMin, setRepsMin] = useState(initialData.repsMin.toString());
    const [repsMax, setRepsMax] = useState(initialData.repsMax.toString());
    const [restMin, setRestMin] = useState(initialData.restMin.toString());
    const [restMax, setRestMax] = useState(initialData.restMax.toString());
    const [tempo, setTempo] = useState(initialData.tempo);

    const { data: exercises = [] } = useExercises();
    const { mutate: editMetadata, isPending } = useEditExerciseMetadata({
        groupId,
        workoutId,
        metadataId,
    });

    useEffect(() => {
        if (isOpen) {
            setExerciseId(initialData.exerciseId);
            setSetsMin(initialData.setsMin.toString());
            setSetsMax(initialData.setsMax.toString());
            setRepsMin(initialData.repsMin.toString());
            setRepsMax(initialData.repsMax.toString());
            setRestMin(initialData.restMin.toString());
            setRestMax(initialData.restMax.toString());
            setTempo(initialData.tempo);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSave = () => {
        editMetadata(
            {
                exercise_id: exerciseId,
                sets_min: parseInt(setsMin),
                sets_max: parseInt(setsMax),
                reps_min: parseInt(repsMin),
                reps_max: parseInt(repsMax),
                rest_min: parseInt(restMin),
                rest_max: parseInt(restMax),
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
        <Portal>
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300"
                onClick={onClose}
            />
            <div className="fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out">
                <div className="bg-card border-t border-border rounded-t-[32px] px-6 pb-10 pt-4 max-w-lg mx-auto shadow-2xl">
                    {/* Handle */}
                    <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-xl font-bold">Edit {exerciseName}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar pb-6">
                        {/* Exercise Selector */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Exercise
                            </label>
                            <select
                                value={exerciseId}
                                onChange={(e) => setExerciseId(e.target.value)}
                                className="w-full bg-muted border border-border rounded-2xl px-4 py-3 text-foreground focus:ring-2 focus:ring-accent outline-none"
                            >
                                {exercises.map((ex: any) => (
                                    <option key={ex.id} value={ex.id}>
                                        {ex.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sets & Reps */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <Hash className="w-3 h-3" /> Sets (Min-Max)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={setsMin}
                                        onChange={(e) => setSetsMin(e.target.value)}
                                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-center focus:ring-2 focus:ring-accent outline-none"
                                    />
                                    <span className="text-muted-foreground">-</span>
                                    <input
                                        type="number"
                                        value={setsMax}
                                        onChange={(e) => setSetsMax(e.target.value)}
                                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-center focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <Repeat className="w-3 h-3" /> Reps (Min-Max)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={repsMin}
                                        onChange={(e) => setRepsMin(e.target.value)}
                                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-center focus:ring-2 focus:ring-accent outline-none"
                                    />
                                    <span className="text-muted-foreground">-</span>
                                    <input
                                        type="number"
                                        value={repsMax}
                                        onChange={(e) => setRepsMax(e.target.value)}
                                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-center focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rest & Tempo */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <Timer className="w-3 h-3" /> Rest (s)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={restMin}
                                        onChange={(e) => setRestMin(e.target.value)}
                                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-center focus:ring-2 focus:ring-accent outline-none"
                                    />
                                    <span className="text-muted-foreground">-</span>
                                    <input
                                        type="number"
                                        value={restMax}
                                        onChange={(e) => setRestMax(e.target.value)}
                                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-center focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <Activity className="w-3 h-3" /> Tempo
                                </label>
                                <input
                                    type="text"
                                    value={tempo}
                                    onChange={(e) => setTempo(e.target.value)}
                                    placeholder="e.g. 3-0-1-0"
                                    className="w-full bg-muted border border-border rounded-2xl px-4 py-3 text-center focus:ring-2 focus:ring-accent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleSave}
                        variant="primary"
                        className="w-full mt-4"
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>}
                    </Button>
                </div>
            </div>
        </Portal>
    );
}
