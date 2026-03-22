"use client";

import { Suspense, use } from "react";
import { WorkoutListContent } from "@/app/features/programs/screens";
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
        </div>
    );
}
