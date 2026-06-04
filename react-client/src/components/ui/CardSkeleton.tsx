export function CardSkeleton({ chips = false }: { chips?: boolean }) {
    return (
        <div className="rounded-2xl bg-card/80 p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-muted/70" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded-lg bg-muted/70" />
                    <div className="h-3 w-1/3 rounded-lg bg-muted/60" />
                </div>
            </div>
            {chips && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 rounded-xl bg-muted/60" />
                    ))}
                </div>
            )}
        </div>
    );
}

export function CardSkeletonList({
    count = 4,
    chips = false,
}: {
    count?: number;
    chips?: boolean;
}) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {[...Array(count)].map((_, i) => (
                <CardSkeleton key={i} chips={chips} />
            ))}
        </div>
    );
}
