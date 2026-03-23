"use client";

import { useState } from "react";
import type { MuscleGroup } from "@/app/generated/prisma/client";

const muscleGroups: MuscleGroup[] = [
    "Abs",
    "Back",
    "Biceps",
    "Cardio",
    "Chest",
    "Forearms",
    "Legs",
    "Shoulders",
    "Triceps",
];

const muscleColorMap: Record<MuscleGroup, string> = {
    Abs: "bg-muscle-abs",
    Back: "bg-muscle-back",
    Biceps: "bg-muscle-biceps",
    Cardio: "bg-muscle-cardio",
    Chest: "bg-muscle-chest",
    Forearms: "bg-muscle-forearms",
    Legs: "bg-muscle-legs",
    Shoulders: "bg-muscle-shoulders",
    Triceps: "bg-muscle-triceps",
};

interface MuscleGroupSelectorProps {
    value?: MuscleGroup | null;
    onChange: (mg: MuscleGroup) => void;
}

export function MuscleGroupSelector({
    value,
    onChange,
}: MuscleGroupSelectorProps) {
    const [selected, setSelected] = useState<MuscleGroup | null>(value ?? null);

    const handleSelect = (mg: MuscleGroup) => {
        setSelected(mg);
        onChange(mg);
    };

    return (
        <div className="flex flex-wrap gap-2">
            {muscleGroups.map((mg) => (
                <button
                    key={mg}
                    type="button"
                    onClick={() => handleSelect(mg)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                      duration-200 border ${selected === mg
                            ? `${muscleColorMap[mg]} text-white border-transparent shadow-sm`
                            : "bg-muted/40 text-muted-foreground/90 border-border/70 hover:border-accent/40 hover:text-foreground"
                        }`}
                >
                    {mg}
                </button>
            ))}
        </div>
    );
}
