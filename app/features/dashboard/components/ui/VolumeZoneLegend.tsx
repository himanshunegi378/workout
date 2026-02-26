
export function VolumeZoneLegend() {
    return (
        <div className="bg-card text-card-foreground p-6 rounded-3xl border border-border elevation-1">
            <h3 className="text-lg font-display font-bold mb-4">Volume Zones</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-success shrink-0 ring-4 ring-success/20" />
                    <div>
                        <div className="text-sm font-medium">Optimal Growth (0-5%)</div>
                        <div className="text-xs text-muted-foreground">Sweet spot for steady progress.</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-warning shrink-0 ring-4 ring-warning/20" />
                    <div>
                        <div className="text-sm font-medium">Aggressive Push (5-10%)</div>
                        <div className="text-xs text-muted-foreground">Monitor recovery closely. Don&apos;t increase next session.</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-danger shrink-0 ring-4 ring-danger/20" />
                    <div>
                        <div className="text-sm font-medium">Danger Zone (&gt;10%)</div>
                        <div className="text-xs text-muted-foreground">Risk of injury. Reduce volume by 5% next time.</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground shrink-0 ring-4 ring-muted-foreground/20" />
                    <div>
                        <div className="text-sm font-medium">Maintenance / Deload (&lt;=0%)</div>
                        <div className="text-xs text-muted-foreground">Good for recovery weeks.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper to determine zone color
export function getZoneColor(percentChange: number | null): string {
    if (percentChange === null) return "currentColor"; // No previous data
    if (percentChange <= 0) return "var(--color-muted-foreground)";
    if (percentChange <= 5) return "var(--color-success)";
    if (percentChange <= 10) return "var(--color-warning)";
    return "var(--color-danger)";
}

// Helper to determine zone bg class
export function getZoneBgClass(percentChange: number | null): string {
    if (percentChange === null) return "bg-muted";
    if (percentChange <= 0) return "bg-muted";
    if (percentChange <= 5) return "bg-success";
    if (percentChange <= 10) return "bg-warning";
    return "bg-danger";
}

// Helper to determine zone text class
export function getZoneTextClass(percentChange: number | null): string {
    if (percentChange === null) return "text-muted-foreground";
    if (percentChange <= 0) return "text-muted-foreground";
    if (percentChange <= 5) return "text-success";
    if (percentChange <= 10) return "text-warning";
    return "text-danger";
}
