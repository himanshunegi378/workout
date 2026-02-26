"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine
} from "recharts";
import { VolumeSessionData } from "../../api/query-hooks/use-volume-data";

interface VolumeChartProps {
    data: VolumeSessionData[];
}

export function VolumeChart({ data }: VolumeChartProps) {
    if (!data.length) return null;

    // Helper to format date "YYYY-MM-DD" to "MMM DD"
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        // Using UTC to avoid timezone shifting
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    };

    // Calculate a simple average of the last 7 sessions
    const recentData = data.slice(-7);
    const avgVolume = recentData.length > 0
        ? recentData.reduce((sum, d) => sum + d.volume, 0) / recentData.length
        : 0;

    return (
        <div className="bg-card text-card-foreground p-5 rounded-3xl border border-border h-[350px] w-full mt-4 elevation-1">
            <h3 className="text-lg font-display font-medium mb-4">Volume Trends</h3>
            <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                            tickFormatter={(val) => `${val / 1000}k`}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }}
                        />
                        {avgVolume > 0 && (
                            <ReferenceLine
                                y={avgVolume}
                                stroke="var(--color-muted-foreground)"
                                strokeDasharray="3 3"
                                label={{ position: 'top', value: '7-Session Avg', fill: 'var(--color-muted-foreground)', fontSize: 10 }}
                            />
                        )}
                        <Bar dataKey="volume" radius={[4, 4, 0, 0]} maxBarSize={50}>
                            {data.map((entry, index) => {
                                // Determine color based on percent change zones
                                let fill = "var(--color-accent)"; // Default fallback

                                if (entry.percentChange === null || entry.percentChange <= 0) {
                                    fill = "var(--color-muted-foreground)"; // Maintenance / Deload
                                } else if (entry.percentChange <= 5) {
                                    fill = "var(--color-success)"; // Optimal
                                } else if (entry.percentChange <= 10) {
                                    fill = "var(--color-warning)"; // Aggressive
                                } else {
                                    fill = "var(--color-danger)"; // Danger spike
                                }

                                return <Cell key={`cell-${index}`} fill={fill} />;
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Custom tooltip to show exact values and % change
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as VolumeSessionData;

        let changeText = "Base session";
        let changeColor = "text-muted-foreground";

        if (data.percentChange !== null) {
            const pct = data.percentChange;
            if (pct > 0) {
                changeText = `+${pct}% vs prev`;
                if (pct <= 5) changeColor = "text-success";
                else if (pct <= 10) changeColor = "text-warning";
                else changeColor = "text-danger";
            } else if (pct < 0) {
                changeText = `${pct}% vs prev`;
                changeColor = "text-muted-foreground";
            } else {
                changeText = "0% (No change)";
                changeColor = "text-muted-foreground";
            }
        }

        return (
            <div className="bg-card text-card-foreground border border-border p-3 rounded-xl shadow-xl elevation-2">
                <p className="font-medium mb-1 flex items-center gap-2">
                    {new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                    <span className="text-xs text-muted-foreground font-normal">({data.sessionCount} session{data.sessionCount > 1 ? 's' : ''})</span>
                </p>
                <div className="flex flex-col gap-1">
                    <p className="text-lg font-display font-medium text-accent">
                        {data.volume.toLocaleString()} kg
                    </p>
                    <p className={`text-sm font-medium ${changeColor}`}>
                        {changeText}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};
