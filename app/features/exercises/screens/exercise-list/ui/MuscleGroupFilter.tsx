"use client";

import { muscleColorMap } from "@/app/components/ui";

const ALL_GROUPS = ["All", "Abs", "Back", "Biceps", "Cardio", "Chest", "Forearms", "Legs", "Shoulders", "Triceps"] as const;
type Filter = (typeof ALL_GROUPS)[number];

interface MuscleGroupFilterProps {
    selected: Filter;
    onChange: (f: Filter) => void;
}

/**
 * A horizontal, scrollable filter bar for selecting muscle groups.
 * 
 * Context:
 * This component is used at the top of the exercise library to allow users to quickly 
 * narrow down the list of exercises by target area (e.g., Chest, Back, Legs).
 * 
 * Why:
 * - Direct Access: Provides immediate visibility into all available categories 
 *   without requiring a dropdown or secondary navigation level.
 * - Visual Reinforcement: Uses consistent muscle-group color coding to match 
 *   the `ExerciseListCard` visuals, creating a unified mental map for the user.
 * - UX Efficiency: Supports quick "one-tap" switching between categories, 
 *   optimized for mobile use.
 */
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
