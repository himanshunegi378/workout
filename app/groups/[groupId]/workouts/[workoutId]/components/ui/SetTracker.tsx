"use client";

import { Check } from "lucide-react";

interface SetTrackerProps {
    setsMin: number;
    setsMax: number;
    completedSets: number[];
    onSetClick: (setIndex: number) => void;
}

export function SetTracker({ setsMin, setsMax, completedSets, onSetClick }: SetTrackerProps) {
    const totalCircles = setsMax;

    return (
        <div className="flex flex-wrap gap-3 mt-4">
            {Array.from({ length: totalCircles }).map((_, i) => {
                const isOptional = i >= setsMin;
                const isCompleted = completedSets.includes(i);

                return (
                    <button
                        key={i}
                        onClick={() => onSetClick(i)}
                        className={`
                            relative w-10 h-10 rounded-full flex items-center justify-center shrink-0
                            transition-all duration-300 active:animate-press
                            ${isCompleted
                                ? "bg-accent text-accent-foreground border-transparent"
                                : isOptional
                                    ? "bg-transparent border-2 border-dashed border-border text-muted-foreground hover:border-accent/50"
                                    : "bg-muted border border-border text-foreground hover:border-accent/50"
                            }
                        `}
                        aria-label={`Log set ${i + 1}`}
                    >
                        {isCompleted ? (
                            <Check className="w-5 h-5" strokeWidth={3} />
                        ) : (
                            <span className="font-display font-semibold text-sm">{i + 1}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
