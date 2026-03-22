"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hash, Repeat, Timer, Activity, MoreHorizontal, CheckCircle2, Flame, Target, Trophy, Zap } from "lucide-react";
import { MetadataChip, muscleColorMap } from "@/app/components/ui";
import { SetTracker } from "./SetTracker";
import { LogSetDrawer } from "./LogSetDrawer";
import { useLogSet } from "@/app/features/logging/api/mutation-hooks/use-log-set";
import { useUpdateLogSet } from "@/app/features/logging/api/mutation-hooks/use-update-log-set";
import { useDeleteLogSet } from "@/app/features/logging/api/mutation-hooks/use-delete-log-set";
import { getLastLog } from "@/app/features/logging/api/query-hooks/use-last-log";
import { useRestTimer } from "@/app/features/workouts/contexts/RestTimerContext";
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
            <div className={`relative bg-card text-card-foreground rounded-[2.5rem] p-8 border transition-all duration-500 overflow-hidden ${isCompleted ? 'border-success/20 bg-success/5 shadow-none' : 'border-border/60 hover:border-accent/40 elevation-4'}`}>
                {/* Visual Glow for Active/Focused State */}
                {!isCompleted && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent animate-pulse" />
                )}

                {/* Header Section */}
                <div className="flex items-start justify-between mb-8 gap-4">
                    <div className="flex items-center gap-5 min-w-0">
                        <div className={`shrink-0 w-2 h-12 rounded-full ${colorClass} shadow-[0_0_15px_rgba(0,0,0,0.2)]`} />
                        <div className="min-w-0">
                            <h3 className="font-display text-2xl font-bold truncate tracking-tight leading-none mb-2">
                                {name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2.5 py-1 bg-muted/40 rounded-lg border border-border/20">
                                    {muscleGroup}
                                </span>
                                {isPerfect && (
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-success uppercase tracking-widest bg-success/10 px-2.5 py-1 rounded-lg border border-success/20">
                                        <Trophy className="w-3 h-3" /> Mastered
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 -mr-3 rounded-2xl hover:bg-muted transition-all shrink-0 active:scale-90">
                        <MoreHorizontal className="w-6 h-6 text-muted-foreground" />
                    </button>

                    {isMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                            <div className="absolute right-8 top-20 w-40 bg-card border border-border rounded-2xl elevation-8 z-20 py-2 overflow-hidden animate-slide-up">
                                <button onClick={() => { setIsMenuOpen(false); setIsEditDrawerOpen(true); }} className="w-full px-5 py-3 text-left text-sm hover:bg-muted transition-colors flex items-center gap-3 font-bold">
                                    <Activity className="w-4 h-4 text-accent" /> Edit Protocol
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left Panel: The Briefing */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-border/40 pb-3">
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-accent/60" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Tempo</span>
                            </div>
                            <span className="text-[10px] font-bold text-accent/80 font-mono">{tempo}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <MetadataChip label="Goal" value={`${setsMin}–${setsMax} Sets`} icon={<Hash className="w-3.5 h-3.5" />} />
                            <MetadataChip label="Range" value={`${repsMin}–${repsMax} Reps`} icon={<Repeat className="w-3.5 h-3.5" />} />
                            <MetadataChip label="Rest" value={`${restMin}–${restMax}s`} icon={<Timer className="w-3.5 h-3.5" />} />
                            <MetadataChip label="Work" value={`${logs.length} Done`} icon={<CheckCircle2 className="w-3.5 h-3.5" />} />
                        </div>

                        {/* Tactical Challenge Box */}
                        {previousLogs.length > 0 && (
                            <div className="mt-4 p-4 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-between group/challenge hover:bg-accent/10 transition-colors cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-accent/10 text-accent">
                                        <Flame className="w-4 h-4 animate-pulse" />
                                    </div>
                                    <span className="text-[10px] font-bold text-accent/80 uppercase tracking-widest">Beat Previous</span>
                                </div>
                                <span className="font-display font-bold text-sm text-foreground">
                                    {previousLogs[0].weight ? `${previousLogs[0].weight}kg × ` : ""}{previousLogs[0].reps}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: The Action */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-border/40 pb-3">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-warning/60" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Set Logging</span>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground/40 italic">Set Status</span>
                        </div>
                        <div className="bg-muted/10 rounded-3xl p-2 border border-border/20">
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
        </>
    );
}
