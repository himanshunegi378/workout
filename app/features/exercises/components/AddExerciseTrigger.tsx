"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AddExerciseDrawer } from "./AddExerciseDrawer";

interface AddExerciseTriggerProps {
    programmeId: string;
    workoutId: string;
    variant: "icon" | "button";
}

/**
 * A UI trigger component that opens the AddExerciseDrawer to add an exercise to a workout.
 * 
 * Context:
 * This component is designed to be used in multiple parts of the application (e.g., workout 
 * builders or session views) and supports two variants: a simple icon for minimal UI spaces 
 * or a more prominent button.
 * 
 * Why:
 * - Consistency: By encapsulating both the trigger button/icon and the drawer itself, 
 *   it ensures that any part of the UI needing to add an exercise will have the same 
 *   behavior and configuration.
 * - UX Flexibility: The `variant` prop allows it to adapt to different layouts without 
 *   requiring multiple components or complex conditional logic at the call site.
 */
export function AddExerciseTrigger({ programmeId, workoutId, variant }: AddExerciseTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {variant === "icon" ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group rounded-full bg-muted/20 p-2 text-accent transition-colors hover:bg-muted/40"
                >
                    <Plus className="w-5 h-5 transition-transform group-active:scale-95" />
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-background/70 px-5 py-3 font-display text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted/30 active:scale-[0.98]"
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
