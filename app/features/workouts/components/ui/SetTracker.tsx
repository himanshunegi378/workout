"use client";


interface SetTrackerProps {
    setsMin: number;
    setsMax: number;
    logs: { set_order_index: number; reps: number }[];
    targetReps: number;
    onSetClick: (setIndex: number) => void;
}

export function SetTracker({ setsMin, setsMax, logs, targetReps, onSetClick }: SetTrackerProps) {
    const totalCircles = setsMax;

    return (
        <div className="flex flex-wrap gap-3 mt-4">
            {Array.from({ length: totalCircles }).map((_, i) => {
                const isOptional = i >= setsMin;
                const log = logs.find((l) => l.set_order_index === i);
                const isCompleted = !!log;
                const missedTarget = isCompleted && log.reps < targetReps;

                return (
                    <button
                        key={i}
                        onClick={() => onSetClick(i)}
                        className={`
                            relative w-10 h-10 rounded-full flex items-center justify-center shrink-0
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
                            </div>
                        ) : (
                            <span className="font-display font-semibold text-sm">{i + 1}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
