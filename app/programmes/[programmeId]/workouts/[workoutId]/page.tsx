"use client";

import { Suspense, use } from "react";
import { BottomNav } from "@/app/components/ui";
import { ExerciseListContent } from "@/app/features/workouts/components/ExerciseListContent";
import { LoadingState } from "@/app/features/workouts/components/ui/LoadingState";

interface PageProps {
    params: Promise<{ programmeId: string; workoutId: string }>;
}

export default function ExerciseListPage({ params }: PageProps) {
    const { programmeId, workoutId } = use(params);

    return (
        <div className="min-h-screen pb-20">
            <Suspense fallback={<LoadingState programmeId={programmeId} />}>
                <ExerciseListContent programmeId={programmeId} workoutId={workoutId} />
            </Suspense>
            <BottomNav />
        </div>
    );
}
