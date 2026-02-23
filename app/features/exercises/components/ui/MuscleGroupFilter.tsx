"use client";

import { muscleColorMap } from "@/app/components/ui";

const ALL_GROUPS = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"] as const;
type Filter = (typeof ALL_GROUPS)[number];

interface MuscleGroupFilterProps {
    selected: Filter;
    onChange: (f: Filter) => void;
}

export function MuscleGroupFilter({ selected, onChange }: MuscleGroupFilterProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {ALL_GROUPS.map((group) => {
                const isActive = selected === group;
                const colorClass = group !== "All" ? muscleColorMap[group] : "";

                return (
                    <button
                        key={group}
                        type="button"
                        onClick={() => onChange(group)}
                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold
                            transition-all duration-200 border
                            ${isActive
                                ? group === "All"
                                    ? "bg-accent text-accent-foreground border-accent"
                                    : `${colorClass} text-white border-transparent`
                                : "bg-muted text-muted-foreground border-border hover:border-accent/40"
                            }`}
                    >
                        {group}
                    </button>
                );
            })}
        </div>
    );
}
