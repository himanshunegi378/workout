"use client";

import { useState } from "react";
import { Loader2, History } from "lucide-react";
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
            <BottomDrawer isOpen={isOpen} onClose={onClose} title={exerciseName}>
                <div className="flex flex-col gap-6">
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
                    className="group flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl px-1 py-1 text-sm transition-colors active:scale-[0.98]"
                >
                    <div className="flex items-center gap-3 text-muted-foreground transition-colors group-hover:text-foreground">
                        <div className="rounded-full bg-muted/20 p-2 transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                            <History className="w-4 h-4" />
                        </div>
                        <span className="font-bold tracking-tight">Best Previous</span>
                    </div>
                    <span className="ml-auto whitespace-nowrap font-display font-bold text-foreground">
                        {lastLog.weight ? `${lastLog.weight}kg × ` : ""}
                        {lastLog.reps} reps
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
            </div>
        </>
    );
}
