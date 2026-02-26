import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { VolumeSessionData } from "../../api/query-hooks/use-volume-data";
import { getZoneTextClass, getZoneBgClass } from "./VolumeZoneLegend";

interface VolumeOverviewCardProps {
    data: VolumeSessionData[];
}

export function VolumeOverviewCard({ data }: VolumeOverviewCardProps) {
    if (!data.length) {
        return (
            <div className="bg-card text-card-foreground p-6 rounded-3xl border border-border flex flex-col items-center justify-center min-h-[140px] elevation-1">
                <p className="text-muted-foreground italic">No workout volume logged yet.</p>
            </div>
        );
    }

    const latest = data[data.length - 1];
    const isIncrease = latest.percentChange !== null && latest.percentChange > 0;
    const isDecrease = latest.percentChange !== null && latest.percentChange < 0;
    const isFlat = latest.percentChange === 0;

    const displayPercent = latest.percentChange !== null
        ? Math.abs(latest.percentChange).toFixed(1) + "%"
        : "N/A";

    return (
        <div className="bg-card text-card-foreground p-6 rounded-3xl border border-border elevation-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Latest Session Volume</h3>
            <div className="flex items-end justify-between mt-2">
                <div>
                    <span className="text-4xl font-display font-bold">
                        {latest.volume.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground ml-2 text-sm">kg</span>
                </div>

                {latest.percentChange !== null && (
                    <div className="text-right flex flex-col items-end">
                        <div className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full text-sm bg-opacity-20 ${getZoneTextClass(latest.percentChange)} ${getZoneBgClass(latest.percentChange).replace('bg-', 'bg-').concat('/15')} border border-current/20 shadow-sm`}>
                            {isIncrease && <TrendingUp className="w-4 h-4" />}
                            {isDecrease && <TrendingDown className="w-4 h-4" />}
                            {isFlat && <Minus className="w-4 h-4" />}
                            <span>{isIncrease ? "+" : isDecrease ? "-" : ""}{displayPercent}</span>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">vs previous</span>
                    </div>
                )}
            </div>
        </div>
    );
}
