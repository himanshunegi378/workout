import { Suspense } from "react";
import { PageHeader, PageShell, CardSkeletonList } from "@/app/components/ui";
import { ExercisesContent } from "@/app/features/exercises/screens";

export default function ExercisesPage() {
    return (
        <PageShell
            size="xl"
            header={
                <PageHeader
                    title="Exercises"
                    subtitle="Browse and manage your exercise library"
                />
            }
        >
            <Suspense fallback={<CardSkeletonList count={6} />}>
                <ExercisesContent />
            </Suspense>
        </PageShell>
    );
}
