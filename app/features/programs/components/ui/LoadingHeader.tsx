import { PageHeader, CardSkeletonList } from "@/app/components/ui";

export function LoadingHeader() {
    return (
        <>
            <PageHeader title="Loading…" backHref="/" />
            <main className="max-w-lg md:max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-8">
                <CardSkeletonList count={3} />
            </main>
        </>
    );
}
