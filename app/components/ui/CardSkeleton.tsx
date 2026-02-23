export function CardSkeleton({ chips = false }: { chips?: boolean }) {
    return (
        <div className="bg-card rounded-2xl p-4 border border-border animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded-lg w-2/3" />
                    <div className="h-3 bg-muted rounded-lg w-1/3" />
                </div>
            </div>
            {chips && (
                <div className="grid grid-cols-4 gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 bg-muted rounded-xl" />
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
        <div className="space-y-3">
            {[...Array(count)].map((_, i) => (
                <CardSkeleton key={i} chips={chips} />
            ))}
        </div>
    );
}
