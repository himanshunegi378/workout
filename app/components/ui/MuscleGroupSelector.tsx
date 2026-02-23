"use client";

import { useState } from "react";
import type { MuscleGroup } from "@/app/generated/prisma/client";

const muscleGroups: MuscleGroup[] = [
    "Chest",
    "Back",
    "Legs",
    "Shoulders",
    "Arms",
    "Core",
];

const muscleColorMap: Record<MuscleGroup, string> = {
    Chest: "bg-muscle-chest",
    Back: "bg-muscle-back",
    Legs: "bg-muscle-legs",
    Shoulders: "bg-muscle-shoulders",
    Arms: "bg-muscle-arms",
    Core: "bg-muscle-core",
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
                            ? `${muscleColorMap[mg]} text-white border-transparent`
                            : "bg-muted text-muted-foreground border-border hover:border-accent/40"
                        }`}
                >
                    {mg}
                </button>
            ))}
        </div>
    );
}
