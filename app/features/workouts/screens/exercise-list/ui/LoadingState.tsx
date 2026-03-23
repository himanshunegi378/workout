import { PageHeader, CardSkeletonList } from "@/app/components/ui";

export function LoadingState({ programmeId }: { programmeId: string }) {
    return (
        <>
            <PageHeader title="Loading…" backHref={`/programmes/${programmeId}`} />
            <main className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                <CardSkeletonList count={4} chips />
            </main>
        </>
    );
}
