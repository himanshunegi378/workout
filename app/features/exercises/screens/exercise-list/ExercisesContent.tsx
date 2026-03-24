"use client";

import { Loader2, Dumbbell } from "lucide-react";
import { List } from "@/app/components/ui";
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
            <List.Root>
                <div className="border-b border-border/50 pb-4">
                    <div className="h-11 w-full animate-pulse rounded-full bg-muted/30" />
                    <div className="mt-4 flex flex-wrap gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-muted/25" />
                        ))}
                    </div>
                </div>
                <List.Loading title="Loading exercises..." icon={Loader2} />
            </List.Root>
        );
    }

    if (isError || !exercises) {
        return (
            <List.Error
                icon={Dumbbell}
                title="Something went wrong"
                description="Could not load exercise library. Please try again."
            />
        );
    }

    return <ExerciseListClient exercises={exercises} />;
}
