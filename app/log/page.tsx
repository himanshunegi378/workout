import { Suspense } from "react";
import { PageShell, CardSkeletonList } from "@/app/components/ui";
import { PageHeader } from "@/app/features/page-header";
import { LogContent } from "@/app/features/logging/screens";

export default function LogPage() {
    return (
        <PageShell
            size="xl"
            header={
                <PageHeader
                    title="Workout Log"
                    subtitle="History of previous sessions"
                />
            }
        >
            <Suspense fallback={<CardSkeletonList count={3} />}>
                <LogContent />
            </Suspense>
        </PageShell>
    );
}
