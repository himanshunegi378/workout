import { Suspense } from "react";
import { BottomNav } from "@/app/components/ui";
import { ExerciseListContent } from "./components/ExerciseListContent";
import { LoadingState } from "./components/ui/LoadingState";

interface PageProps {
    params: Promise<{ groupId: string; workoutId: string }>;
}

export default async function ExerciseListPage({ params }: PageProps) {
    const { groupId, workoutId } = await params;

    return (
        <div className="min-h-screen pb-20">
            <Suspense fallback={<LoadingState groupId={groupId} />}>
                <ExerciseListContent groupId={groupId} workoutId={workoutId} />
            </Suspense>
            <BottomNav />
        </div>
    );
}
