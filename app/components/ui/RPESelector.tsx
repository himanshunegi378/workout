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
                <Gauge className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground/90">{label}</span>
                {value && (
                    <span className="ml-auto rounded-lg border border-accent/20 bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
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
                            className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border transition-all duration-300 active:scale-90
                                ${isSelected
                                    ? "border-accent/20 bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                                    : "border-border/70 bg-card/50 text-muted-foreground/90 hover:border-accent/40 hover:bg-muted/30 hover:text-foreground"
                                }`}
                        >
                            <span className="text-lg font-display font-bold leading-none">{rpe}</span>
                            <span className="mt-0.5 text-[8px] font-bold uppercase opacity-70">
                                {rpe === 10 ? 'Max' : rpe >= 9 ? 'Hard' : rpe >= 7 ? 'Mod' : 'Easy'}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
