"use client";

import { ExerciseLog } from "../types";

/**
 * Protocol configuration for the set tracker.
 * Encapsulates the prescriptive targets for the exercise.
 */
interface TrackerProtocol {
    setsMin: number;
    setsMax: number;
    targetReps: number;
}

interface SetTrackerProps {
    /** The prescriptive targets for this exercise. */
    protocol: TrackerProtocol;
    /** The actual logs completed in the current session. */
    logs: Partial<ExerciseLog>[];
    /** Callback triggered when a set bubble is tapped. */
    onSetClick: (setIndex: number) => void;
    /** Historical performance for comparison (Beat Previous). */
    previousLogs?: Partial<ExerciseLog>[];
}

/**
 * A specialized visual indicator and trigger for logging sets in an exercise.
 * 
 * Context:
 * This component provides a row of interactive "bubbles" representing each set 
 * in an exercise's prescribed protocol. It visually distinguishes between 
 * required sets and optional (bonus) sets.
 * 
 * Why:
 * - Immediate Visual Reward: Filling a bubble provides instant gratification 
 *   as users progress through their exercise.
 * - Performance Context: Displays historical set data (e.g., previous weight/reps) 
 *   directly below the logging circles to help users match or exceed their numbers. 
 * - Multi-state Feedback: Changes colors and labels based on set completion status, 
 *   missed targets (e.g., rep goal not met), and RPE ratings.
 */
export function SetTracker({ 
    protocol, 
    logs, 
    onSetClick, 
    previousLogs = [] 
}: SetTrackerProps) {
    const { setsMin, setsMax, targetReps } = protocol;
    const totalCircles = setsMax;

    return (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-6 pb-2">
            {Array.from({ length: totalCircles }).map((_, i) => {
                const isOptional = i >= setsMin;
                const log = logs.find((l) => l.set_order_index === i);
                const isCompleted = !!log;
                const missedTarget = isCompleted && (log.reps ?? 0) < targetReps;

                const prevLog = previousLogs.find((l) => l.set_order_index === i);

                return (
                    <div key={i} className="relative w-11 shrink-0 pb-5">
                        <button
                            onClick={() => onSetClick(i)}
                            className={`
                            relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors duration-200
                            ${isCompleted
                                    ? missedTarget
                                        ? "bg-warning/10 text-warning"
                                        : "bg-accent/10 text-accent"
                                    : isOptional
                                        ? "bg-background text-foreground/70 hover:bg-muted/20"
                                        : "bg-muted/35 text-foreground hover:bg-muted/50"
                                }
                        `}
                            aria-label={`Log set ${i + 1}`}
                        >
                            {isCompleted ? (
                                <div className="flex flex-col items-center justify-center leading-none">
                                    <span className="font-display text-sm font-semibold">{log.reps}</span>
                                    {log.rpe && (
                                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[8px] font-semibold text-background">
                                            {log.rpe}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span className="font-display text-sm font-medium">{i + 1}</span>
                            )}
                        </button>
                        <div className="absolute left-1/2 top-[3.1rem] flex w-max -translate-x-1/2 justify-center">
                            {prevLog ? (
                                <span className="text-[10px] leading-none tracking-tight text-foreground/70">
                                    {prevLog.weight ? `${prevLog.weight}×${prevLog.reps}` : `${prevLog.reps}r`}
                                </span>
                            ) : null}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
