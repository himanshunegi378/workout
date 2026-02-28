"use client";

import { useState } from "react";
import { useExercises } from "@/app/features/exercises/api/query-hooks/use-exercises";
import { ExerciseSelectDrawer } from "@/app/features/exercises/components/ExerciseSelectDrawer";
import { StandaloneLogDrawer } from "./StandaloneLogDrawer";
import { QuickLogFAB } from "./QuickLogFAB";

export function QuickLogActions() {
    const { data: exercises } = useExercises();
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [isStandaloneOpen, setIsStandaloneOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<{ id: string; name: string } | null>(null);

    const handleExerciseSelect = (exerciseId: string) => {
        const ex = exercises?.find((e: { id: string }) => e.id === exerciseId);
        if (ex) {
            setSelectedExercise({ id: ex.id, name: ex.name });
            setIsStandaloneOpen(true);
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
                <StandaloneLogDrawer
                    isOpen={isStandaloneOpen}
                    onClose={() => {
                        setIsStandaloneOpen(false);
                        setSelectedExercise(null);
                    }}
                    exerciseId={selectedExercise.id}
                    exerciseName={selectedExercise.name}
                />
            )}
        </>
    );
}
