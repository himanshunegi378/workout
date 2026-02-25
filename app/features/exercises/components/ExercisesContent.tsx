"use client";

import { Loader2, Dumbbell } from "lucide-react";
import { EmptyState } from "@/app/components/ui";
import { ExerciseListClient } from "./ExerciseListClient";
import { useExercises } from "../api/query-hooks/use-exercises";

export function ExercisesContent() {
    const { data: exercises, isLoading, isError } = useExercises();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <span className="text-sm text-muted-foreground animate-pulse font-medium">Loading exercises...</span>
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
