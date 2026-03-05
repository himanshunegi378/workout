"use client";

import { Gauge } from "lucide-react";

interface RPESelectorProps {
    value: number | null;
    onChange: (rpe: number | null) => void;
    label?: string;
}

const RPE_OPTIONS = [5, 6, 7, 8, 9, 10];

export function RPESelector({ value, onChange, label = "RPE (Intensity)" }: RPESelectorProps) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
                <Gauge className="w-4 h-4 text-accent/80" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
                {value && (
                    <span className="ml-auto text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-lg">
                        Intensity: {value === 10 ? 'Max Effort' : `${value}/10`}
                    </span>
                )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1">
                {RPE_OPTIONS.map((rpe) => {
                    const isSelected = value === rpe;
                    return (
                        <button
                            key={rpe}
                            type="button"
                            onClick={() => onChange(isSelected ? null : rpe)}
                            className={`shrink-0 w-12 h-12 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 active:scale-90
                                ${isSelected
                                    ? "bg-indigo-500 text-white border-transparent shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500/20"
                                    : "bg-card/40 text-muted-foreground border-border/60 hover:border-accent/40 hover:bg-muted/20"
                                }`}
                        >
                            <span className="text-lg font-display font-bold leading-none">{rpe}</span>
                            <span className="text-[8px] uppercase font-bold opacity-60 mt-0.5">
                                {rpe === 10 ? 'Max' : rpe >= 9 ? 'Hard' : rpe >= 7 ? 'Mod' : 'Easy'}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
