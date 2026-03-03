"use client";

import { History, Target } from "lucide-react";
import { Button, BottomDrawer, NumberStepper, RPESelector } from "@/app/components/ui";

interface LogSetDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseName: string;
    setIndex: number;
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

export function LogSetDrawer({
    isOpen,
    onClose,
    exerciseName,
    setIndex,
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
        <BottomDrawer isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Set" : `Log Set ${setIndex + 1}`}>
            <div className="flex flex-col -mt-4">
                <div className="flex items-center gap-3 mb-6 bg-accent/5 p-3 rounded-2xl border border-accent/10">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-accent uppercase tracking-wider">Exercise</p>
                        <h3 className="font-display font-bold text-foreground truncate">{exerciseName}</h3>
                    </div>
                </div>

                {previousLog && (
                    <button
                        type="button"
                        onClick={fillPrevious}
                        className="w-full mb-6 flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50 text-sm transition-all active:scale-[0.98] hover:bg-muted"
                    >
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <History className="w-4 h-4" />
                            <span className="font-medium">Previous performance</span>
                        </div>
                        <span className="font-bold text-foreground">
                            {previousLog.weight ? `${previousLog.weight}kg × ` : ""}
                            {previousLog.reps} reps
                        </span>
                    </button>
                )}

                <div className="grid grid-cols-2 gap-4 mb-8">
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

                    <NumberStepper
                        label="Reps"
                        value={repsNum}
                        onChange={(val) => setReps(val.toString())}
                        min={0}
                        max={100}
                        step={1}
                    />
                </div>

                <div className="mb-6">
                    <RPESelector value={rpe} onChange={setRpe} />
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        variant="primary"
                        className="w-full py-4 text-lg font-bold shadow-lg shadow-accent/20"
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
                            className="w-full py-3 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-all disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete Set"}
                        </button>
                    )}
                </div>
            </div>
        </BottomDrawer>
    );
}
