"use client";

import { Check, Trash2 } from "lucide-react";
import { muscleColorMap } from "@/app/components/ui";
import { useDeleteLogSet } from "../../../api/mutation-hooks/use-delete-log-set";
import { useState } from "react";
import { ExerciseQuickLogDrawer } from "./ExerciseQuickLogDrawer";
import { SetLogItem } from "../../../ui/SetLogItem";
import { ExerciseLog } from "../../../types";
import { Exercise } from "@/app/features/workouts/types";

/**
 * Props for the SetRow component.
 */
interface SetRowProps {
    /** The domain object representing the logged set. */
    log: ExerciseLog;
    /** Indicates if this set was logged ad-hoc (not part of the program). */
    isAdHoc?: boolean;
}

/**
 * A sub-component that represents a single row (set) within an exercise group.
 * Handles set deletion with confirmation and displays PR indicators.
 */
export function SetRow({ log, isAdHoc }: SetRowProps) {
    const { mutate: deleteSet, isPending } = useDeleteLogSet();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to remove this set?")) {
            setIsDeleting(true);
            deleteSet(log.id, {
                onSettled: () => setIsDeleting(false),
            });
        }
    };

    return (
        <div className={`flex items-center gap-3 group py-2 transition-opacity ${isDeleting || isPending ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex-1">
                <SetLogItem
                    variant="list"
                    log={log}
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
    /** The domain object representing the exercise. */
    exercise: Exercise;
    /** An array of sets logged for this exercise in the current session. */
    sets: (ExerciseLog & { isAdHoc?: boolean })[];
    /** The date of the session this exercise belongs to. */
    sessionDate?: string;
}

/**
 * A component that groups multiple sets under a single exercise heading.
 * Clicking the exercise name opens the combined quick-log and history drawer for that exercise.
 */
export function ExerciseLogGroup({ exercise, sets, sessionDate }: ExerciseLogGroupProps) {
    const colorClass = muscleColorMap[exercise.muscle_group] ?? "bg-accent";
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
        <div className="rounded-3xl bg-background/20 px-4 py-4">
            <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex w-full items-center gap-3 text-left group outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
                <div className={`h-5 w-1.5 rounded-full ${colorClass}`} />
                <span className="font-display text-sm font-semibold tracking-tight text-foreground group-hover:underline underline-offset-2 decoration-border">
                    {exercise.name}
                </span>
            </button>
            <div className="mt-3 space-y-0.5 pl-5">
                {sets.map((log) => (
                    <SetRow
                        key={log.id}
                        log={log}
                        isAdHoc={log.isAdHoc}
                    />
                ))}
            </div>

            <ExerciseQuickLogDrawer
                key={exercise.id}
                exercise={exercise}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                initialDate={sessionDate}
            />
        </div>
    );
}
