import { PageHeader, CardSkeletonList } from "@/app/components/ui";

export function LoadingHeader() {
    return (
        <>
            <PageHeader title="Loading…" backHref="/" />
            <main className="max-w-lg mx-auto px-4 py-4">
                <CardSkeletonList count={3} />
            </main>
        </>
    );
}
