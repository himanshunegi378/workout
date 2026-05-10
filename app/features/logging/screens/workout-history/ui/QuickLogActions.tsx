"use client";

import { useState } from "react";
import { useExercises } from "@/app/features/exercises/api/query-hooks/use-exercises";
import { ExerciseSelectDrawer } from "@/app/features/exercises/ui/ExerciseSelectDrawer";
import { ExerciseQuickLogDrawer } from "./ExerciseQuickLogDrawer";
import { QuickLogFAB } from "./QuickLogFAB";

import { Exercise } from "@/app/features/workouts/types";

/**
 * A coordinator component that manages the "Quick Log" flow.
 * It provides a Floating Action Button (FAB) that opens an exercise selection drawer,
 * followed by a combined quick-log and history drawer for the selected exercise.
 * 
 * @returns {JSX.Element} The rendered FAB and associated drawers.
 */
export function QuickLogActions() {
    const { data: exercises } = useExercises();
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    /**
     * Handles the selection of an exercise from the selection drawer.
     * Sets the selected exercise state and opens the combined exercise drawer.
     * 
     * @param {string} exerciseId - The ID of the selected exercise.
     */
    const handleExerciseSelect = (exerciseId: string) => {
        const ex = exercises?.find((e: { id: string }) => e.id === exerciseId);
        if (ex) {
            setSelectedExercise(ex as Exercise);
            setIsQuickLogOpen(true);
        }
    };

    return (
        <>
            <QuickLogFAB onClick={() => setIsSelectOpen(true)} />

            <ExerciseSelectDrawer
                isOpen={isSelectOpen}
                onClose={() => setIsSelectOpen(false)}
                exercises={exercises || []}
                onSelect={handleExerciseSelect}
            />

            {selectedExercise && (
                <ExerciseQuickLogDrawer
                    key={selectedExercise.id}
                    isOpen={isQuickLogOpen}
                    onClose={() => {
                        setIsQuickLogOpen(false);
                        setSelectedExercise(null);
                    }}
                    exercise={selectedExercise}
                />
            )}
        </>
    );
}
