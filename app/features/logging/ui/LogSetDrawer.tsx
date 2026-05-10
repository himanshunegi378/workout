"use client";

import { History } from "lucide-react";
import { Button, BottomDrawer, NumberStepper, RPESelector } from "@/app/components/ui";

interface LogSetDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseName: string;
    weight: string;
    setWeight: (w: string) => void;
    reps: string;
    setReps: (r: string) => void;
    rpe: number | null;
    setRpe: (r: number | null) => void;
    onSave: () => void;
    onDelete?: () => void;
    isSaving: boolean;
    isDeleting?: boolean;
    isEdit?: boolean;
    previousLog?: { weight: number | null; reps: number } | null;
}

/**
 * A modal-style drawer for inputting performance data (weight, reps, RPE) for a specific set.
 * 
 * Context:
 * This drawer is the primary interaction point during a live workout. It allows 
 * users to log their active set or edit a previously completed one. 
 * 
 * Why:
 * - Progressive Overload: Includes a "Best Previous" section that allows users 
 *   to quickly fill in their previous performance with one tap, encouraging 
 *   them to match or beat it.
 * - Precise Input: Uses `NumberStepper` and `RPESelector` to ensure that data 
 *   entry is quick and valid, prioritizing common gym movements (e.g., 2.5kg increments).
 * - Multi-mode: Intelligently switches between "Save Set" and "Update Set" 
 *   modes depending on whether the user is logging a new set or editing an old one.
 */
export function LogSetDrawer({
    isOpen,
    onClose,
    exerciseName,
    weight,
    setWeight,
    reps,
    setReps,
    rpe,
    setRpe,
    onSave,
    onDelete,
    isSaving,
    isDeleting,
    isEdit,
    previousLog,
}: LogSetDrawerProps) {
    const fillPrevious = () => {
        if (previousLog) {
            if (previousLog.weight !== null) setWeight(previousLog.weight.toString());
            setReps(previousLog.reps.toString());
        }
    };

    const weightNum = parseFloat(weight) || 0;
    const repsNum = parseInt(reps) || 0;

    return (
        <BottomDrawer isOpen={isOpen} onClose={onClose} title={exerciseName}>
            <div className="flex flex-col gap-6">
                {previousLog && (
                    <button
                        type="button"
                        onClick={fillPrevious}
                        className="group flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl px-1 py-1 text-sm transition-colors active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3 text-muted-foreground transition-colors group-hover:text-foreground">
                            <div className="rounded-full bg-muted/20 p-2 transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                                <History className="w-4 h-4" />
                            </div>
                            <span className="font-bold tracking-tight">Best Previous</span>
                        </div>
                        <span className="ml-auto whitespace-nowrap font-display font-bold text-foreground">
                            {previousLog.weight ? `${previousLog.weight}kg × ` : ""}
                            {previousLog.reps} reps
                        </span>
                    </button>
                )}

                <div>
                    <div className="flex flex-wrap items-start gap-3">
                        <div className="min-w-0 flex-1">
                            <NumberStepper
                                label="Weight"
                                value={weightNum}
                                onChange={(val) => setWeight(val.toString())}
                                min={0}
                                max={500}
                                step={2.5}
                                suffix="kg"
                                stepOptions={[2.5, 5]}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <NumberStepper
                                label="Reps"
                                value={repsNum}
                                onChange={(val) => setReps(val.toString())}
                                min={0}
                                max={100}
                                step={1}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <RPESelector value={rpe} onChange={setRpe} />
                </div>

                <div className="flex flex-col gap-3 pt-2">
                    <Button
                        variant="primary"
                        className="w-full py-4 text-lg font-bold shadow-none"
                        onClick={onSave}
                        disabled={isSaving || isDeleting || !reps}
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-2 justify-center">
                                <span className="animate-pulse">Saving...</span>
                            </div>
                        ) : isEdit ? "Update Set" : "Save Set"}
                    </Button>

                    {isEdit && onDelete && (
                        <button
                            onClick={onDelete}
                            disabled={isSaving || isDeleting}
                            className="w-full rounded-xl py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete Set"}
                        </button>
                    )}
                </div>
            </div>
        </BottomDrawer>
    );
}
