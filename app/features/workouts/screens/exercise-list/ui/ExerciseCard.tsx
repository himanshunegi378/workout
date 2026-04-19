"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Repeat, Timer, Activity, MoreHorizontal, Trophy, Flame, Target } from "lucide-react";
import { muscleColorMap } from "@/app/components/ui";
import { SetTracker } from "./SetTracker";
import { LogSetDrawer } from "./LogSetDrawer";
import { 
    useLogSet, 
    useUpdateLogSet, 
    useDeleteLogSet, 
    getLastLog, 
    ExerciseQuickLogDrawer 
} from "@/app/features/logging";
import { useRestTimer } from "@/app/features/rest-timer";
import { usePRCelebration } from "@/app/features/personal-records/PRCelebrationContext";
import { EditExerciseMetadataDrawer } from "./EditExerciseMetadataDrawer";


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
                className={`rounded-3xl bg-background/50 px-5 py-5 text-card-foreground transition-all duration-200 md:px-6 md:py-6 border border-border/30 ${isCompleted ? "bg-success/5" : "hover:bg-background/65"
                    }`}
            >
                <div className="flex items-start justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => setIsHistoryDrawerOpen(true)}
                        className="flex min-w-0 flex-1 items-center gap-4 text-left transition-colors"
                    >
                        <div className={`h-8 w-1.5 shrink-0 rounded-full ${colorClass}`} />
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
                    </button>

                    <div className="relative shrink-0">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted/20"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                                <div className="absolute right-0 top-12 z-20 w-44 overflow-hidden rounded-2xl bg-background/95 py-2 backdrop-blur shadow-xl border border-border/50">
                                    <button onClick={() => { setIsMenuOpen(false); setIsEditDrawerOpen(true); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted/30">
                                        <Activity className="w-4 h-4 text-accent" /> Edit Protocol
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Micro-Badges Row */}
                <div className="mt-5 flex flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground/80">
                        <Target className="w-3.5 h-3.5" /> {setsMin}-{setsMax} Sets
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground/80">
                        <Repeat className="w-3.5 h-3.5" /> {repsMin}-{repsMax} Reps
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground/80">
                        <Timer className="w-3.5 h-3.5" /> {restMin}-{restMax}s
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground/80 lowercase">
                        {tempo}
                    </span>
                    {previousLogs.length > 0 && (
                        <span className="flex items-center gap-1.5 rounded-lg bg-accent/10 text-accent px-2.5 py-1.5 text-xs font-medium">
                            <Flame className="w-3.5 h-3.5" /> Prev: {previousLogs[0].weight ? `${previousLogs[0].weight}kg × ` : ""}{previousLogs[0].reps}
                        </span>
                    )}
                </div>

                <div className="mt-8">
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

            <LogSetDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                exerciseName={name}
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

            <ExerciseQuickLogDrawer
                key={exerciseId}
                isOpen={isHistoryDrawerOpen}
                onClose={() => setIsHistoryDrawerOpen(false)}
                exerciseId={exerciseId}
                exerciseName={name}
            />
        </>
    );
}

