'use client'

import { Check, Trash2, Trophy } from "lucide-react";
import { muscleColorMap } from "@/app/components/ui";
import { useDeleteLogSet } from "../../../api/mutation-hooks/use-delete-log-set";
import { useState } from "react";

/**
 * Props for the SetRow component.
 */
interface SetRowProps {
    /** Unique identifier for the set. */
    id: string;
    /** The chronological order of the set within the exercise. */
    index: number;
    /** The weight lifted, or null if bodyweight. */
    weight: number | null;
    /** The number of repetitions completed. */
    reps: number;
    /** Rate of Perceived Exertion (intensity), optional. */
    rpe: number | null;
    /** Indicates if this set is a personal record (PR). */
    prType?: string | null;
}

/**
 * A sub-component that represents a single row (set) within an exercise group.
 * Handles set deletion with confirmation and displays PR indicators.
 * 
 * @param {SetRowProps} props - The set data.
 * @returns {JSX.Element} The rendered set row.
 */
export function SetRow({ id, index, weight, reps, rpe, prType }: SetRowProps) {
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
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                ${prType
                    ? "bg-accent/20 text-accent ring-1 ring-accent/30"
                    : "bg-muted text-muted-foreground"
                }`}
            >
                {prType ? (
                    <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                    index
                )}
            </span>
            <div className="flex-1 flex items-center gap-2">
                <span className="font-display text-sm font-semibold text-foreground">
                    {weight ? `${weight}kg` : "BW"}
                </span>
                <span className="text-muted-foreground">×</span>
                <span className="font-display text-sm font-semibold text-foreground">
                    {reps}
                </span>
                {rpe && (
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-md font-bold border border-indigo-500/20">
                        @{rpe}
                    </span>
                )}
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

import { ExerciseHistoryDrawer } from "@/app/features/exercises/components/ExerciseHistoryDrawer";

/**
 * Props for the ExerciseLogGroup component.
 */
interface ExerciseLogGroupProps {
    /** Unique identifier for the exercise. */
    exerciseId: string;
    /** The display name of the exercise. */
    exerciseName: string;
    /** The primary muscle group targeted by the exercise. */
    muscleGroup: string;
    /** An array of sets logged for this exercise in the current session. */
    sets: { id: string; weight: number | null; reps: number; rpe: number | null; pr_type?: string | null }[];
}

/**
 * A component that groups multiple sets under a single exercise heading.
 * Clicking the exercise name opens the full history drawer for that exercise.
 * 
 * @param {ExerciseLogGroupProps} props - The exercise group data.
 * @returns {JSX.Element} The rendered exercise log group.
 */
export function ExerciseLogGroup({ exerciseId, exerciseName, muscleGroup, sets }: ExerciseLogGroupProps) {
    const colorClass = muscleColorMap[muscleGroup] ?? "bg-accent";
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
        <div className="px-4 py-3">
            <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-2 mb-2 hover:opacity-80 transition-opacity text-left w-full group outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
            >
                <div className={`w-1.5 h-5 rounded-full ${colorClass}`} />
                <span className="font-display text-sm font-semibold group-hover:underline underline-offset-2 decoration-border">
                    {exerciseName}
                </span>
            </button>
            <div className="space-y-1 ml-3.5">
                {sets.map((log, si) => (
                    <SetRow
                        key={log.id}
                        id={log.id}
                        index={si + 1}
                        weight={log.weight}
                        reps={log.reps}
                        rpe={log.rpe}
                        prType={log.pr_type}
                    />
                ))}
            </div>

            <ExerciseHistoryDrawer
                exerciseId={exerciseId}
                exerciseName={exerciseName}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
        </div>
    );
}
