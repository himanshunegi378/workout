"use client";

import { Check, Trash2 } from "lucide-react";
import { muscleColorMap } from "@/app/components/ui";
import { useDeleteLogSet } from "../../../api/mutation-hooks/use-delete-log-set";
import { useState } from "react";
import { ExerciseQuickLogDrawer } from "./ExerciseQuickLogDrawer";
import { SetLogItem } from "../../../ui/SetLogItem";

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
    /** Indicates if this set was logged ad-hoc (not part of the program). */
    isAdHoc?: boolean;
}

/**
 * A sub-component that represents a single row (set) within an exercise group.
 * Handles set deletion with confirmation and displays PR indicators.
 * 
 * @param {SetRowProps} props - The set data.
 * @returns {JSX.Element} The rendered set row.
 */
export function SetRow({ id, index, weight, reps, rpe, prType, isAdHoc }: SetRowProps) {
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
        <div className={`flex items-center gap-3 group py-2 transition-opacity ${isDeleting || isPending ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex-1">
                <SetLogItem
                    variant="list"
                    index={index}
                    weight={weight}
                    reps={reps}
                    rpe={rpe}
                    prType={prType}
                    isAdHoc={isAdHoc}
                />
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleDelete}
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/75 transition-colors hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
                title="Remove set"
            >
                <Trash2 className="w-4 h-4" />
            </button>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/15">
                    <Check className="w-3.5 h-3.5 text-success" />
                </div>
            </div>
        </div>
    );
}

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
    sets: { id: string; weight: number | null; reps: number; rpe: number | null; pr_type?: string | null; isAdHoc?: boolean }[];
    /** The date of the session this exercise belongs to. */
    sessionDate?: string;
}

/**
 * A component that groups multiple sets under a single exercise heading.
 * Clicking the exercise name opens the combined quick-log and history drawer for that exercise.
 * 
 * @param {ExerciseLogGroupProps} props - The exercise group data.
 * @returns {JSX.Element} The rendered exercise log group.
 */
export function ExerciseLogGroup({ exerciseId, exerciseName, muscleGroup, sets, sessionDate }: ExerciseLogGroupProps) {
    const colorClass = muscleColorMap[muscleGroup] ?? "bg-accent";
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
        <div className="rounded-3xl bg-background/20 px-4 py-4">
            <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex w-full items-center gap-3 text-left group outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
                <div className={`h-5 w-1.5 rounded-full ${colorClass}`} />
                <span className="font-display text-sm font-semibold tracking-tight text-foreground group-hover:underline underline-offset-2 decoration-border">
                    {exerciseName}
                </span>
            </button>
            <div className="mt-3 space-y-0.5 pl-5">
                {sets.map((log, si) => (
                    <SetRow
                        key={log.id}
                        id={log.id}
                        index={si + 1}
                        weight={log.weight}
                        reps={log.reps}
                        rpe={log.rpe}
                        prType={log.pr_type}
                        isAdHoc={log.isAdHoc}
                    />
                ))}
            </div>

            <ExerciseQuickLogDrawer
                key={exerciseId}
                exerciseId={exerciseId}
                exerciseName={exerciseName}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                initialDate={sessionDate}
            />
        </div>
    );
}
