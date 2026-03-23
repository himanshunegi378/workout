"use client";

import { use } from "react";
import { PageHeader, PageShell } from "@/app/components/ui";
import { AddWorkoutForm } from "@/app/features/workouts/screens";

interface PageProps {
    params: Promise<{ programmeId: string }>;
}

export default function AddWorkoutPage({ params }: PageProps) {
    const { programmeId } = use(params);

    return (
        <PageShell
            size="md"
            contentClassName="py-6 sm:py-8 lg:py-10"
            header={<PageHeader title="New Workout" backHref={`/programmes/${programmeId}`} showBackDefault />}
        >
            <AddWorkoutForm programmeId={programmeId} />
        </PageShell>
    );
}
