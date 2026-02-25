"use client";

import { useRef } from "react";
import { History } from "lucide-react";
import { Button, BottomDrawer, NumberStepper } from "@/app/components/ui";

interface LogSetDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseName: string;
    setIndex: number;
    weight: string;
    setWeight: (w: string) => void;
    reps: string;
    setReps: (r: string) => void;
    onSave: () => void;
    onDelete?: () => void;
    isSaving: boolean;
    isDeleting?: boolean;
    isEdit?: boolean;
    previousLog?: { weight: number | null; reps: number } | null;
}

export function LogSetDrawer({
    isOpen,
    onClose,
    exerciseName,
    setIndex,
    weight,
    setWeight,
    reps,
    setReps,
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
        <BottomDrawer isOpen={isOpen} onClose={onClose} title={`Log Set ${setIndex + 1}`}>
            <p className="text-sm text-muted-foreground -mt-4 mb-6">{exerciseName}</p>

            {previousLog && (
                <button
                    onClick={fillPrevious}
                    className="w-full mb-6 flex items-center justify-between p-3 rounded-xl bg-accent/10 border border-accent/20 text-sm text-accent transition-colors active:bg-accent/20"
                >
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4" />
                        <span>Previous:</span>
                    </div>
                    <span className="font-semibold">
                        {previousLog.weight ? `${previousLog.weight}kg × ` : ""}
                        {previousLog.reps} reps
                    </span>
                </button>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Weight Input */}
                <NumberStepper
                    label="Weight"
                    value={weightNum}
                    onChange={(val) => setWeight(val.toString())}
                    min={0}
                    max={500}
                    step={5}
                    suffix="kg"
                    stepOptions={[5]}
                />

                {/* Reps Input */}
                <NumberStepper
                    label="Reps"
                    value={repsNum}
                    onChange={(val) => setReps(val.toString())}
                    min={0}
                    max={100}
                    step={1}
                />
            </div>

            <div className="flex flex-col gap-3">
                <Button
                    variant="primary"
                    className="w-full py-4 text-base"
                    onClick={onSave}
                    disabled={isSaving || isDeleting || !reps}
                >
                    {isSaving ? "Saving..." : isEdit ? "Update Set" : "Save Set"}
                </Button>

                {isEdit && onDelete && (
                    <button
                        onClick={onDelete}
                        disabled={isSaving || isDeleting}
                        className="w-full py-3 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-all disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting..." : "Delete Set"}
                    </button>
                )}
            </div>
        </BottomDrawer>
    );
}
