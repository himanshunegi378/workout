"use client";

import { Suspense, use } from "react";
import { BottomNav } from "@/app/components/ui";
import { WorkoutListContent } from "@/app/features/programs/components/WorkoutListContent";
import { LoadingHeader } from "@/app/features/programs/components/ui/LoadingHeader";

interface PageProps {
    params: Promise<{ programmeId: string }>;
}

export default function WorkoutListPage({ params }: PageProps) {
    const { programmeId } = use(params);

    return (
        <div className="min-h-screen pb-20">
            <Suspense fallback={<LoadingHeader />}>
                <WorkoutListContent programmeId={programmeId} />
            </Suspense>
            <BottomNav />
        </div>
    );
}
