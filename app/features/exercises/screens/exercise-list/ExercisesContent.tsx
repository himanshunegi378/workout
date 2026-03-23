"use client";

import { Loader2, Dumbbell } from "lucide-react";
import { EmptyState } from "@/app/components/ui";
import { ExerciseListClient } from "./ui/ExerciseListClient";
import { useExercises } from "../../api/query-hooks/use-exercises";

/**
 * A container component for the main exercise library view.
 * 
 * Context:
 * This component handles the data fetching and high-level states (loading, error, or data display) 
 * for the entire exercise list screen. It delegates the actual rendering and filtering of the 
 * list to the `ExerciseListClient`.
 * 
 * Why:
 * - Separation of Concerns: Keeps the screen-level container logic clean by delegating UI list 
 *   interactions to a specialized client component.
 * - UX Feedback: Provides tailored loading states and error messages specifically for 
 *   the exercise library context.
 */
export function ExercisesContent() {
    const { data: exercises, isLoading, isError } = useExercises();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="h-7 w-7 animate-spin text-accent" />
                <span className="text-sm font-medium">Loading exercises...</span>
            </div>
        );
    }

    if (isError || !exercises) {
        return (
            <EmptyState
                icon={Dumbbell}
                title="Something went wrong"
                description="Could not load exercise library. Please try again."
            />
        );
    }

    return <ExerciseListClient exercises={exercises} />;
}
