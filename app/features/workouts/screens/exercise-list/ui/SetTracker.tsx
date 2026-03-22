"use client";


interface SetTrackerProps {
    setsMin: number;
    setsMax: number;
    logs: { set_order_index: number; reps: number; rpe: number | null }[];
    targetReps: number;
    onSetClick: (setIndex: number) => void;
    previousLogs?: { id: string; weight: number | null; reps: number; set_order_index: number }[];
}

export function SetTracker({ setsMin, setsMax, logs, targetReps, onSetClick, previousLogs = [] }: SetTrackerProps) {
    const totalCircles = setsMax;

    return (
        <div className="flex flex-wrap gap-3 mt-4 pb-4">
            {Array.from({ length: totalCircles }).map((_, i) => {
                const isOptional = i >= setsMin;
                const log = logs.find((l) => l.set_order_index === i);
                const isCompleted = !!log;
                const missedTarget = isCompleted && log.reps < targetReps;

                const prevLog = previousLogs.find((l) => l.set_order_index === i);

                return (
                    <div key={i} className="relative w-10 h-10 shrink-0">
                        <button
                            onClick={() => onSetClick(i)}
                            className={`
                            relative w-full h-full rounded-full flex items-center justify-center
                            transition-all duration-300 active:animate-press
                            ${isCompleted
                                    ? missedTarget
                                        ? "bg-warning text-warning-foreground border-transparent shadow-[0_0_12px_rgba(253,203,110,0.3)]"
                                        : "bg-accent text-accent-foreground border-transparent"
                                    : isOptional
                                        ? "bg-transparent border-2 border-dashed border-border text-muted-foreground hover:border-accent/50"
                                        : "bg-muted border border-border text-foreground hover:border-accent/50"
                                }
                        `}
                            aria-label={`Log set ${i + 1}`}
                        >
                            {isCompleted ? (
                                <div className="flex flex-col items-center justify-center leading-none">
                                    <span className="font-display font-bold text-sm">{log.reps}</span>
                                    {log.rpe && (
                                        <span className="absolute -top-1 -right-1 flex items-center justify-center bg-indigo-500 text-[8px] text-white w-4 h-4 rounded-full border border-card font-bold shadow-sm">
                                            {log.rpe}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span className="font-display font-semibold text-sm">{i + 1}</span>
                            )}
                        </button>
                        <div className="absolute top-[44px] left-1/2 -translate-x-1/2 flex justify-center w-max">
                            {prevLog ? (
                                <span className="text-[10px] leading-none text-muted-foreground/80 font-medium tracking-tight">
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
