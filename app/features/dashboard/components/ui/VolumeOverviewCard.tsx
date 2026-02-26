import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { VolumeSessionData } from "../../api/query-hooks/use-volume-data";
import { getZoneTextClass, getZoneBgClass } from "./VolumeZoneLegend";

interface VolumeOverviewCardProps {
    data: VolumeSessionData[];
}

export function VolumeOverviewCard({ data }: VolumeOverviewCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

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
        <div className="bg-card text-card-foreground p-6 rounded-3xl border border-border elevation-1 flex flex-col transition-all duration-300">
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

            {/* Drill Down Toggle */}
            {latest.exercises && latest.exercises.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full flex items-center justify-between text-sm font-medium text-foreground hover:text-accent transition-colors"
                    >
                        <span>Exercise Breakdown</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Drill Down Content */}
                    {isExpanded && (
                        <div className="mt-4 space-y-3 animate-slide-up" style={{ animationDelay: '0ms' }}>
                            {latest.exercises.map((ex, idx) => {
                                const percentOfTotal = ((ex.volume / latest.volume) * 100).toFixed(0);
                                return (
                                    <div key={idx} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-foreground font-medium truncate pr-4">{ex.name}</span>
                                            <span className="text-muted-foreground shrink-0">{ex.volume.toLocaleString()} kg</span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${percentOfTotal}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
