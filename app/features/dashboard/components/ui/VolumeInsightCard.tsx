"use client";

import { AlertTriangle, TrendingUp, CheckCircle, Info } from "lucide-react";
import { VolumeSessionData } from "../../api/query-hooks/use-volume-data";

interface VolumeInsightCardProps {
    data: VolumeSessionData[];
}

export function VolumeInsightCard({ data }: VolumeInsightCardProps) {
    if (data.length < 2) {
        return (
            <div className="bg-card text-card-foreground p-4 rounded-2xl border border-border flex gap-3 text-sm items-start elevation-1">
                <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p className="font-medium">Log more workouts to see insights on your volume progression.</p>
            </div>
        );
    }

    const latest = data[data.length - 1];
    const prev = data[data.length - 2];
    const percentChange = latest.percentChange ?? 0;

    let icon = <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />;
    let message = "Keep logging workouts to track your volume.";
    let bgClass = "bg-card border-border";
    let textClass = "text-foreground";

    // Two consecutive drops: Deload needed
    if (percentChange < 0 && (prev.percentChange ?? 0) < 0) {
        icon = <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />;
        message = "Volume dropped for two consecutive sessions. Your body might be under-recovered. Consider taking a Deload Week (reduce volume by 30-50%).";
        bgClass = "bg-warning/10 border-warning/30";
        textClass = "text-warning-foreground";
    }
    // Danger Spike (> 10%)
    else if (percentChange > 10) {
        icon = <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />;
        message = "Dangerous volume spike! A jump over 10% risks injury and fatigue debt. Consider reducing weight or sets by 5% next session.";
        bgClass = "bg-danger/10 border-danger/30";
        textClass = "text-danger-foreground";
    }
    // Aggressive Push (5 - 10%)
    else if (percentChange > 5 && percentChange <= 10) {
        icon = <TrendingUp className="w-5 h-5 text-warning shrink-0 mt-0.5" />;
        message = "Aggressive push! You're in the 5-10% zone. Do not increase volume again next session. Let your body catch up.";
        bgClass = "bg-warning/10 border-warning/30";
        textClass = "text-warning-foreground";
    }
    // Optimal Growth (2 - 5%)
    else if (percentChange > 2 && percentChange <= 5) {
        icon = <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />;
        message = "Optimal Growth Zone! You're in the 2-5% sweet spot for progressive overload. Keep it up.";
        bgClass = "bg-success/10 border-success/30";
        textClass = "text-success-foreground";
    }
    // Maintenance (0 - 2%)
    else if (percentChange >= 0 && percentChange <= 2) {
        icon = <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />;
        message = "Maintenance level. You're holding steady. Good for stressful weeks or when sleep is poor.";
        bgClass = "bg-muted/50 border-border";
        textClass = "text-muted-foreground";
    }
    // Single slight drop
    else if (percentChange < 0) {
        icon = <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />;
        message = "Volume dipped slightly. If this happens again next session, you may need a deload.";
        bgClass = "bg-muted/50 border-border";
        textClass = "text-muted-foreground";
    }

    return (
        <div className={`p-4 rounded-2xl border flex gap-3 text-sm items-start elevation-1 shadow-sm ${bgClass} ${textClass}`}>
            {icon}
            <p className="leading-relaxed font-medium">{message}</p>
        </div>
    );
}
