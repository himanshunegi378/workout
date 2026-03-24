"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hash, Repeat, Timer, Activity, MoreHorizontal, CheckCircle2, Flame, Target, Trophy, Zap } from "lucide-react";
import { muscleColorMap } from "@/app/components/ui";
import { SetTracker } from "./SetTracker";
import { LogSetDrawer } from "./LogSetDrawer";
import { useLogSet } from "@/app/features/logging/api/mutation-hooks/use-log-set";
import { useUpdateLogSet } from "@/app/features/logging/api/mutation-hooks/use-update-log-set";
import { useDeleteLogSet } from "@/app/features/logging/api/mutation-hooks/use-delete-log-set";
import { getLastLog } from "@/app/features/logging/api/query-hooks/use-last-log";
import { useRestTimer } from "@/app/features/rest-timer";
import { usePRCelebration } from "@/app/features/personal-records/PRCelebrationContext";
import { EditExerciseMetadataDrawer } from "./EditExerciseMetadataDrawer";
import { ExerciseHistoryDrawer } from "@/app/features/exercises/components/ExerciseHistoryDrawer";

interface ExerciseLog {
    id: string;
    weight: number | null;
    reps: number;
    set_order_index: number;
    rpe: number | null;
}

interface ExerciseCardProps {
    workoutId: string;
    programmeId: string;
    ewmId: string;
    exerciseId: string;
    name: string;
    muscleGroup: string;
    setsMin: number;
    setsMax: number;
    repsMin: number;
    repsMax: number;
    restMin: number;
    restMax: number;
    tempo: string;
    initialLogs?: ExerciseLog[];
    previousLogs?: { id: string; weight: number | null; reps: number; set_order_index: number }[];
}

/**
 * The primary interactive card for a single exercise within a live training session.
 * 
 * Context:
 * This is the most complex UI component in the workout execution flow. It displays 
 * the exercise protocol (sets, reps, rest, tempo), tracks completed sets via 
 * `SetTracker`, and manages the logic for logging new sets, updating existing ones, 
 * or triggering PR celebrations.
 * 
 * Why:
 * - Dynamic Workflow: Automatically calculates rest periods based on the prescribed 
 *   rest time and starts the global `RestTimer`.
 * - Comparative Performance: Displays "Beat Previous" data (historical performance) 
 *   directly on the card to encourage progressive overload.
 * - Progressive Status: Visually changes its appearance (glow, opacity, grayscale) 
 *   based on whether the exercise objective has been met or "mastered" (hitting max sets).
 * - State Management: Handles optimistic UI updates for logging sets, ensuring a 
 *   snappy feel even on slower network connections.
 */
export function ExerciseCard({
    workoutId,
    programmeId,
    ewmId: _ewmId,
    exerciseId,
    name,
    muscleGroup,
    setsMin,
    setsMax,
    repsMin,
    repsMax,
    restMin,
    restMax,
    tempo,
    initialLogs = [],
    previousLogs = [],
}: ExerciseCardProps) {
    const colorClass = muscleColorMap[muscleGroup] ?? "bg-accent";
    const router = useRouter();
    const [ewmId, setEwmId] = useState(_ewmId);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [activeSetIndex, setActiveSetIndex] = useState(0);
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [rpe, setRpe] = useState<number | null>(null);
    const [previousLog, setPreviousLog] = useState<{ weight: number | null; reps: number } | null>(null);

    const { startTimer } = useRestTimer();
    const { celebrate } = usePRCelebration();

    const [logs, setLogs] = useState<ExerciseLog[]>(initialLogs);

    useEffect(() => {
        setLogs(initialLogs);
    }, [initialLogs]);

    const { mutate: logSetMutation, isPending: isSaving } = useLogSet();
    const { mutate: updateSetMutation, isPending: isUpdating } = useUpdateLogSet();
    const { mutate: deleteSetMutation, isPending: isDeleting } = useDeleteLogSet();

    const currentLog = logs.find((l) => l.set_order_index === activeSetIndex);
    const isCompleted = logs.length >= setsMin && logs.length > 0;
    const isPerfect = logs.length >= setsMax;
    const completedSetCount = logs.length;

    // The logic remains the same, but we'll focus on UI improvements
    const handleSetClick = async (setIndex: number) => {
        setActiveSetIndex(setIndex);
        const log = logs.find((l) => l.set_order_index === setIndex);

        let initialWeight = "";
        let initialReps = "";

        if (log) {
            initialWeight = log.weight?.toString() || "";
            initialReps = log.reps.toString();
            setRpe(log.rpe);
        } else {
            const previousSetLog = logs
                .filter((l) => l.set_order_index < setIndex)
                .sort((a, b) => b.set_order_index - a.set_order_index)[0];

            if (previousSetLog) {
                initialWeight = previousSetLog.weight?.toString() || "";
                initialReps = previousSetLog.reps.toString();
                setRpe(previousSetLog.rpe);
            } else {
                setRpe(null);
            }
        }

        setWeight(initialWeight);
        setReps(initialReps);
        setIsDrawerOpen(true);

        try {
            const data = await getLastLog(exerciseId);
            setPreviousLog(data);
            if (!log && !initialWeight && !initialReps && data) {
                setWeight(data.weight?.toString() || "");
                setReps(data.reps.toString());
            }
        } catch {
            setPreviousLog(null);
        }
    };

    const handleSaveSet = () => {
        if (!reps) return;
        const optimisticId = crypto.randomUUID();
        const newLogEntry: ExerciseLog = {
            id: currentLog?.id || optimisticId,
            weight: parseFloat(weight) || null,
            reps: parseInt(reps),
            rpe: rpe,
            set_order_index: activeSetIndex,
        };

        if (currentLog) {
            setLogs((prev) => prev.map((l) => (l.id === currentLog.id ? newLogEntry : l)));
            setIsDrawerOpen(false);
            updateSetMutation({ setId: currentLog.id, weight, reps, rpe: rpe?.toString() });
        } else {
            setLogs((prev) => [...prev, newLogEntry]);
            setIsDrawerOpen(false);
            startTimer(restMin, { closeOnFinish: true });
            logSetMutation(
                { id: optimisticId, workoutId, exerciseWithMetadataId: ewmId, exerciseId, setOrderIndex: activeSetIndex, weight, reps, rpe: rpe?.toString() },
                { onSuccess: (newLog) => { if (newLog.pr) celebrate(newLog.pr, name); } }
            );
        }
    };

    const handleDeleteSet = () => {
        if (!currentLog) return;
        if (window.confirm("Remove this set?")) {
            deleteSetMutation(currentLog.id, {
                onSuccess: () => {
                    setLogs((prev) => prev.filter((l) => l.id !== currentLog.id));
                    setIsDrawerOpen(false);
                },
            });
        }
    };

    return (
        <>
            <div
                className={`rounded-3xl bg-background/50 px-5 py-5 text-card-foreground transition-colors duration-200 md:px-6 md:py-6 ${
                    isCompleted ? "bg-success/5" : "hover:bg-background/65"
                }`}
            >
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => setIsHistoryDrawerOpen(true)}
                        className="flex min-w-0 flex-1 items-start gap-4 rounded-2xl text-left transition-colors hover:bg-muted/20"
                    >
                        <div className={`mt-1 h-12 w-1.5 shrink-0 rounded-full ${colorClass}`} />
                        <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                                    {name}
                                </h3>
                                {isPerfect && (
                                    <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-success">
                                        <Trophy className="w-3 h-3" /> Mastered
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{muscleGroup}</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="shrink-0 rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-muted/20"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {isMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                            <div className="absolute right-5 top-16 z-20 w-44 overflow-hidden rounded-2xl bg-background/95 py-2 backdrop-blur">
                                <button onClick={() => { setIsMenuOpen(false); setIsEditDrawerOpen(true); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted/30">
                                    <Activity className="w-4 h-4 text-accent" /> Edit Protocol
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-5 space-y-6">
                    <div className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm md:grid-cols-3 xl:grid-cols-5">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-foreground/70">
                                <Target className="h-3.5 w-3.5" />
                                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Tempo</span>
                            </div>
                            <p className="font-mono text-[11px] text-foreground">{tempo}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-foreground/70">
                                <Hash className="h-3.5 w-3.5" />
                                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Goal</span>
                            </div>
                            <p className="font-medium text-foreground">{setsMin}–{setsMax} sets</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-foreground/70">
                                <Repeat className="h-3.5 w-3.5" />
                                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Range</span>
                            </div>
                            <p className="font-medium text-foreground">{repsMin}–{repsMax} reps</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-foreground/70">
                                <Timer className="h-3.5 w-3.5" />
                                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Rest</span>
                            </div>
                            <p className="font-medium text-foreground">{restMin}–{restMax}s</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-foreground/70">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Work</span>
                            </div>
                            <p className="font-medium text-foreground">{completedSetCount} done</p>
                        </div>
                    </div>

                    {previousLogs.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                            <div className="flex items-center gap-2 text-foreground/70">
                                <Flame className="h-4 w-4 text-accent" />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Beat Previous</span>
                            </div>
                            <span className="font-display text-sm font-semibold text-foreground">
                                {previousLogs[0].weight ? `${previousLogs[0].weight}kg × ` : ""}{previousLogs[0].reps}
                            </span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-foreground/70" />
                                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/70">Set Logging</span>
                            </div>
                            <span className="text-[11px] text-foreground/70">{completedSetCount}/{setsMax}</span>
                        </div>
                        <SetTracker
                            setsMin={setsMin}
                            setsMax={setsMax}
                            logs={logs.map(l => ({ set_order_index: l.set_order_index, reps: l.reps, rpe: l.rpe }))}
                            targetReps={repsMin}
                            onSetClick={handleSetClick}
                            previousLogs={previousLogs}
                        />
                    </div>
                </div>
            </div>

            <LogSetDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                exerciseName={name}
                setIndex={activeSetIndex}
                weight={weight}
                setWeight={setWeight}
                reps={reps}
                setReps={setReps}
                rpe={rpe}
                setRpe={setRpe}
                onSave={handleSaveSet}
                onDelete={handleDeleteSet}
                isSaving={isSaving || isUpdating}
                isDeleting={isDeleting}
                isEdit={!!currentLog}
                previousLog={previousLog}
            />

            <EditExerciseMetadataDrawer
                isOpen={isEditDrawerOpen}
                onClose={() => setIsEditDrawerOpen(false)}
                programmeId={programmeId}
                workoutId={workoutId}
                metadataId={ewmId}
                exerciseName={name}
                initialData={{ exerciseId, setsMin, setsMax, repsMin, repsMax, restMin, restMax, tempo }}
                onUpdate={(newEwm) => { setEwmId(newEwm.id); router.refresh(); }}
            />

            <ExerciseHistoryDrawer
                isOpen={isHistoryDrawerOpen}
                onClose={() => setIsHistoryDrawerOpen(false)}
                exerciseId={exerciseId}
                exerciseName={name}
            />
        </>
    );
}
