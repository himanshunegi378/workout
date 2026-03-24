import { PageHeader, PageShell, CardSkeletonList } from "@/app/components/ui";

export function LoadingState({ programmeId }: { programmeId: string }) {
    return (
        <PageShell header={<PageHeader title="Loading…" backHref={`/programmes/${programmeId}`} />} size="xl">
            <div>
                <CardSkeletonList count={4} chips />
            </div>
        </PageShell>
    );
}
