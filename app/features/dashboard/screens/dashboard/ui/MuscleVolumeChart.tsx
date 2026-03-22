"use client";

import React from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';
import { MuscleGroup } from "@/app/generated/prisma/client";
import { muscleColorMap } from "@/app/components/ui";
import { useMuscleHistoricalVolume } from "../../../api/query-hooks/use-muscle-historical-data";
import { Loader2, Activity } from 'lucide-react';

interface MuscleVolumeChartProps {
    muscleGroup: MuscleGroup;
}

export const MuscleVolumeChart: React.FC<MuscleVolumeChartProps> = ({ muscleGroup }) => {
    const { data, isLoading, error } = useMuscleHistoricalVolume(muscleGroup);

    // Simple mapping for demonstration - ideally this comes from a theme config
    const colors: Record<string, string> = {
        'Chest': '#ff4757',
        'Back': '#2ed573',
        'Legs': '#ffa502',
        'Shoulders': '#5352ed',
        'Arms': '#eccc68',
        'Abs': '#70a1ff'
    };
    const strokeColor = colors[muscleGroup] || '#5352ed';

    if (isLoading) {
        return (
            <div className="h-48 w-full flex items-center justify-center bg-card/20 rounded-xl border border-border/20">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/30" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="h-48 w-full flex flex-col items-center justify-center bg-card/20 rounded-xl border border-border/20 gap-2">
                <Activity size={24} className="text-muted-foreground/40" />
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">History Unavailable</p>
            </div>
        );
    }

    return (
        <div className="h-56 w-full mt-4 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 p-4 relative group overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-60">Volume Trend (kg)</p>
                <p className="text-xl font-display font-black leading-none">8 Week Pulse</p>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 60, right: 0, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                        dataKey="label" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 900 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 900 }}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(10, 10, 10, 0.8)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(8px)',
                            padding: '8px 12px'
                        }}
                        itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                        labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px', marginBottom: '4px', fontWeight: 900, textTransform: 'uppercase' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="volume" 
                        stroke={strokeColor} 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorVolume)" 
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
