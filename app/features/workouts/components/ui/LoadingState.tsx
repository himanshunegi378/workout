import { PageHeader, CardSkeletonList } from "@/app/components/ui";

export function LoadingState({ programmeId }: { programmeId: string }) {
    return (
        <>
            <PageHeader title="Loading…" backHref={`/programmes/${programmeId}`} />
            <main className="max-w-lg md:max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-8">
                <CardSkeletonList count={4} chips />
            </main>
        </>
    );
}
