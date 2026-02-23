'use client'

import { Check, Trash2 } from "lucide-react";
import { muscleColorMap } from "@/app/components/ui";
import { useDeleteLogSet } from "../../api/mutation-hooks/use-delete-log-set";
import { useState } from "react";

interface SetRowProps {
    id: string;
    index: number;
    weight: number | null;
    reps: number;
}

export function SetRow({ id, index, weight, reps }: SetRowProps) {
    const { mutate: deleteSet, isPending } = useDeleteLogSet();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to remove this set?")) {
            setIsDeleting(true);
            deleteSet(id, {
                onSettled: () => setIsDeleting(false),
            });
        }
    };

    return (
        <div className={`flex items-center gap-3 group transition-opacity ${isDeleting || isPending ? "opacity-50 pointer-events-none" : ""}`}>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {index}
            </span>
            <div className="flex-1 flex items-center gap-2">
                <span className="font-display text-sm font-semibold text-foreground">
                    {weight ? `${weight}kg` : "BW"}
                </span>
                <span className="text-muted-foreground">×</span>
                <span className="font-display text-sm font-semibold text-foreground">
                    {reps}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleDelete}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10  group-hover:opacity-100 transition-all"
                    title="Remove set"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-success" />
                </div>
            </div>
        </div>
    );
}

interface ExerciseLogGroupProps {
    exerciseName: string;
    muscleGroup: string;
    sets: { id: string; weight: number | null; reps: number }[];
}

export function ExerciseLogGroup({ exerciseName, muscleGroup, sets }: ExerciseLogGroupProps) {
    const colorClass = muscleColorMap[muscleGroup] ?? "bg-accent";

    return (
        <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-1.5 h-5 rounded-full ${colorClass}`} />
                <span className="font-display text-sm font-semibold">
                    {exerciseName}
                </span>
            </div>
            <div className="space-y-1 ml-3.5">
                {sets.map((log, si) => (
                    <SetRow
                        key={log.id}
                        id={log.id}
                        index={si + 1}
                        weight={log.weight}
                        reps={log.reps}
                    />
                ))}
            </div>
        </div>
    );
}
