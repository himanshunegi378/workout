import { Suspense } from "react";
import { BottomNav, CardSkeletonList } from "@/app/components/ui";
import { WorkoutListContent } from "@/app/features/programs/components/WorkoutListContent";
import { LoadingHeader } from "@/app/features/programs/components/ui/LoadingHeader";

interface PageProps {
    params: Promise<{ groupId: string }>;
}

export default async function WorkoutListPage({ params }: PageProps) {
    const { groupId } = await params;

    return (
        <div className="min-h-screen pb-20">
            <Suspense fallback={<LoadingHeader />}>
                <WorkoutListContent groupId={groupId} />
            </Suspense>
            <BottomNav />
        </div>
    );
}
