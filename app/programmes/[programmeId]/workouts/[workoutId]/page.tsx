"use client";

import { Suspense, use } from "react";
import { BottomNav } from "@/app/components/ui";
import { ExerciseListContent } from "@/app/features/workouts/components/ExerciseListContent";
import { LoadingState } from "@/app/features/workouts/components/ui/LoadingState";

interface PageProps {
    params: Promise<{ groupId: string; workoutId: string }>;
}

export default function ExerciseListPage({ params }: PageProps) {
    const { groupId, workoutId } = use(params);

    return (
        <div className="min-h-screen pb-20">
            <Suspense fallback={<LoadingState groupId={groupId} />}>
                <ExerciseListContent groupId={groupId} workoutId={workoutId} />
            </Suspense>
            <BottomNav />
        </div>
    );
}
