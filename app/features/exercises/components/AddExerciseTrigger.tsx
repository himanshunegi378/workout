"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AddExerciseDrawer } from "./AddExerciseDrawer";

interface AddExerciseTriggerProps {
    programmeId: string;
    workoutId: string;
    variant: "icon" | "button";
}

export function AddExerciseTrigger({ programmeId, workoutId, variant }: AddExerciseTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {variant === "icon" ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-xl hover:bg-muted transition-colors text-accent group"
                >
                    <Plus className="w-5 h-5 group-active:scale-95 transition-transform" />
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3
                             rounded-xl font-display text-sm font-semibold
                             transition-all duration-200 active:animate-press
                             bg-accent hover:bg-accent-hover text-accent-foreground shadow-lg shadow-accent/20"
                >
                    <Plus className="w-4 h-4" /> Add Exercise
                </button>
            )}

            <AddExerciseDrawer
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                programmeId={programmeId}
                workoutId={workoutId}
            />
        </>
    );
}
