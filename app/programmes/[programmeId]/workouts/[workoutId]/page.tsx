"use client";

import { Suspense, use } from "react";
import { ExerciseListContent, LoadingState } from "@/app/features/workouts/screens";

interface PageProps {
    params: Promise<{ programmeId: string; workoutId: string }>;
}

export default function ExerciseListPage({ params }: PageProps) {
    const { programmeId, workoutId } = use(params);

    return (
        <Suspense fallback={<LoadingState programmeId={programmeId} />}>
            <ExerciseListContent programmeId={programmeId} workoutId={workoutId} />
        </Suspense>
    );
}
