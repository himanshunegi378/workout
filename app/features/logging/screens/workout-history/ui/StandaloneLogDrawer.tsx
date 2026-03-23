"use client";

import { useState } from "react";
import { Loader2, History, Target } from "lucide-react";
import { BottomDrawer, NumberStepper, Button, RPESelector } from "@/app/components/ui";
import { Portal } from "@/app/components/ui/Portal";
import { useLogSet } from "../../../api/mutation-hooks/use-log-set";
import { usePRCelebration } from "@/app/features/personal-records/PRCelebrationContext";
import { useLastLog } from "../../../api/query-hooks/use-last-log";
import type { PRType } from "@/lib/pr-utils";

/**
 * Props for the StandaloneLogDrawer component.
 */
interface StandaloneLogDrawerProps {
    /** Whether the drawer is currently open. */
    isOpen: boolean;
    /** Callback function to close the drawer. */
    onClose: () => void;
    /** Unique identifier for the exercise to log. */
    exerciseId: string;
    /** The display name of the exercise. */
    exerciseName: string;
}

interface LastLog {
    id: string;
    weight: number | null;
    reps: number;
    rpe: number | null;
}

/**
 * A drawer component that allows users to log a set for a specific exercise independently of a planned workout.
 * It fetches the last known log for the exercise and handles the logging mutation.
 * 
 * @param {StandaloneLogDrawerProps} props - Component properties.
 * @returns {JSX.Element} The rendered drawer and form.
 */
export function StandaloneLogDrawer({ isOpen, onClose, exerciseId, exerciseName }: StandaloneLogDrawerProps) {
    const { celebrate } = usePRCelebration();
    const { mutate: logSet, isPending } = useLogSet();
    const { data: lastLog } = useLastLog(exerciseId, isOpen);

    /**
     * Handles the submission of the log form.
     * 
     * @param {string} weight - The weight value as a string.
     * @param {string} reps - The repetitions value as a string.
     * @param {string|null} rpe - The RPE value as a string or null.
     */
    const handleSubmit = (weight: string, reps: string, rpe: string | null) => {
        if (!reps || reps === "0") return;

        logSet({
            exerciseId,
            setOrderIndex: 1,
            weight: weight || "0",
            reps: reps,
            rpe: rpe || undefined,
        }, {
            onSuccess: (newLog: { pr: PRType | null }) => {
                onClose();
                if (newLog.pr) {
                    celebrate(newLog.pr, exerciseName);
                }
            }
        });
    };

    return (
        <Portal>
            <BottomDrawer isOpen={isOpen} onClose={onClose} title="Quick Log">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/70">
                            <Target className="w-5 h-5 text-accent" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Exercise</p>
                            <h3 className="truncate font-display text-lg font-semibold tracking-tight text-foreground">{exerciseName}</h3>
                        </div>
                    </div>

                    <LogForm
                        key={exerciseId + (lastLog?.id || "empty")}
                        lastLog={lastLog}
                        onSubmit={handleSubmit}
                        isPending={isPending}
                    />
                </div>
            </BottomDrawer>
        </Portal>
    );
}

/**
 * Props for the internal LogForm component.
 */
interface LogFormProps {
    /** Data from the last time this exercise was logged. */
    lastLog?: LastLog;
    /** Callback for form submission. */
    onSubmit: (weight: string, reps: string, rpe: string | null) => void;
    /** Whether a logging mutation is currently in progress. */
    isPending: boolean;
}

/**
 * The internal form used within the StandaloneLogDrawer for inputting set details.
 * 
 * @param {LogFormProps} props - Component properties.
 * @returns {JSX.Element} The rendered logging form.
 */
function LogForm({ lastLog, onSubmit, isPending }: LogFormProps) {
    const [weight, setWeight] = useState(lastLog?.weight?.toString() || "0");
    const [reps, setReps] = useState(lastLog?.reps?.toString() || "0");
    const [rpe, setRpe] = useState<number | null>(lastLog?.rpe || null);

    /**
     * Automatically fills the form fields with data from the previous performance.
     */
    const handleFillPrevious = () => {
        if (lastLog) {
            setWeight(lastLog.weight?.toString() || "0");
            setReps(lastLog.reps?.toString() || "0");
            setRpe(lastLog.rpe);
        }
    };

    const weightNum = parseFloat(weight) || 0;
    const repsNum = parseInt(reps) || 0;

    return (
        <>
            {lastLog && (
                <button
                    type="button"
                    onClick={handleFillPrevious}
                    className="flex w-full flex-col gap-2 border-b border-border/60 py-3 text-left text-sm transition-colors hover:text-foreground sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="flex items-center gap-2 text-foreground/85">
                        <History className="w-4 h-4" />
                        <span className="font-medium">Recent performance</span>
                    </div>
                    <span className="font-bold text-foreground">
                        {lastLog.weight ? `${lastLog.weight}kg × ` : ""}
                        {lastLog.reps} reps
                    </span>
                </button>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div className="pt-6">
                <RPESelector value={rpe} onChange={setRpe} />
            </div>

            <Button
                variant="primary"
                className="w-full py-4 text-base font-semibold !text-background"
                onClick={() => onSubmit(weight, reps, rpe?.toString() || null)}
                disabled={isPending || !reps || reps === "0"}
            >
                {isPending ? (
                    <div className="flex items-center gap-2 justify-center">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Logging Set...</span>
                    </div>
                ) : (
                    "Log Set"
                )}
            </Button>
        </>
    );
}
