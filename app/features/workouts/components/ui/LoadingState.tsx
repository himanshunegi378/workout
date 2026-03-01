import { PageHeader, CardSkeletonList } from "@/app/components/ui";

export function LoadingState({ programmeId }: { programmeId: string }) {
    return (
        <>
            <PageHeader title="Loading…" backHref={`/programmes/${programmeId}`} />
            <main className="max-w-lg mx-auto px-4 py-4">
                <CardSkeletonList count={4} chips />
            </main>
        </>
    );
}
