"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hash, Repeat, Timer, Activity, MoreHorizontal } from "lucide-react";
import { MetadataChip, muscleColorMap } from "@/app/components/ui";
import { SetTracker } from "./SetTracker";
import { LogSetDrawer } from "./LogSetDrawer";
import { useLogSet } from "@/app/features/logging/api/mutation-hooks/use-log-set";
import { useUpdateLogSet } from "@/app/features/logging/api/mutation-hooks/use-update-log-set";
import { useDeleteLogSet } from "@/app/features/logging/api/mutation-hooks/use-delete-log-set";
import { getLastLog } from "@/app/features/logging/api/query-hooks/use-last-log";
import { useRestTimer } from "@/app/features/workouts/contexts/RestTimerContext";
import { usePRCelebration } from "@/app/features/personal-records/PRCelebrationContext";
import type { PRType } from "@/lib/pr-utils";

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
    ewmId: string; // ExerciseWithMetadata ID
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
    // Drawer State
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

    // Track logs locally for immediate UI feedback
    const [logs, setLogs] = useState<ExerciseLog[]>(initialLogs);

    // Update local logs when initialLogs changes (e.g. on manual refresh or hydration)
    useEffect(() => {
        setLogs(initialLogs);
    }, [initialLogs]);

    const { mutate: logSetMutation, isPending: isSaving } = useLogSet();
    const { mutate: updateSetMutation, isPending: isUpdating } = useUpdateLogSet();
    const { mutate: deleteSetMutation, isPending: isDeleting } = useDeleteLogSet();

    const currentLog = logs.find((l) => l.set_order_index === activeSetIndex);

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
            // Default to previous set in current session
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

        // Fetch previous log data (from last session)
        try {
            const data = await getLastLog(exerciseId);
            setPreviousLog(data);

            // If it's a new set and we still don't have initial values, use last session's data
            if (!log && !initialWeight && !initialReps && data) {
                setWeight(data.weight?.toString() || "");
                setReps(data.reps.toString());
            }
        } catch (error) {
            console.error("Failed to fetch previous log", error);
            setPreviousLog(null);
        }
    };

    const handleSaveSet = () => {
        if (!reps) return;

        // Create optimistic log entry
        const optimisticId = (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7));
        const newLogEntry: ExerciseLog = {
            id: currentLog?.id || optimisticId,
            weight: parseFloat(weight) || null,
            reps: parseInt(reps),
            rpe: rpe,
            set_order_index: activeSetIndex,
        };

        if (currentLog) {
            // Update existing set - Optimistic UI
            setLogs((prev) =>
                prev.map((l) => (l.id === currentLog.id ? newLogEntry : l))
            );
            setIsDrawerOpen(false);

            updateSetMutation(
                {
                    setId: currentLog.id,
                    weight,
                    reps,
                    rpe: rpe?.toString(),
                },
                {
                    onError: (error: Error) => {
                        // Silent fail for network errors, let background sync retry
                        if (error.message.includes("fetch") || !navigator.onLine) return;
                        alert(`Error updating set: ${error.message}`);
                    },
                }
            );
        } else {
            // Create new set - Optimistic UI
            setLogs((prev) => [...prev, newLogEntry]);
            setIsDrawerOpen(false);

            // Start rest timer immediately for better UX
            startTimer(restMin, {
                closeOnFinish: true
            });

            logSetMutation(
                {
                    id: optimisticId, // Pass the same ID for client/server consistency
                    workoutId,
                    exerciseWithMetadataId: ewmId,
                    exerciseId,
                    setOrderIndex: activeSetIndex,
                    weight: weight,
                    reps: reps,
                    rpe: rpe?.toString(),
                },
                {
                    onSuccess: (newLog: ExerciseLog & { pr: PRType | null }) => {
                        // Celebrate PR if one was detected server-side
                        if (newLog.pr) {
                            celebrate(newLog.pr, name);
                        }
                    },
                    onError: (error: Error) => {
                        // Silent fail for network errors, let background sync retry
                        if (error.message.includes("fetch") || !navigator.onLine) return;
                        alert(`Error saving set: ${error.message}`);
                    },
                }
            );
        }
    };

    const handleDeleteSet = () => {
        if (!currentLog) return;

        if (window.confirm("Are you sure you want to remove this set?")) {
            deleteSetMutation(currentLog.id, {
                onSuccess: () => {
                    setLogs((prev) => prev.filter((l) => l.id !== currentLog.id));
                    setIsDrawerOpen(false);
                },
                onError: (error: Error) => {
                    alert(`Error deleting set: ${error.message}`);
                },
            });
        }
    };

    return (
        <>
            <div className="bg-card text-card-foreground rounded-2xl p-4 border border-border elevation-3">
                {/* Exercise header */}
                <div className="flex items-center gap-3 mb-3 relative">
                    <div className={`w-2 h-8 rounded-full ${colorClass}`} />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base font-semibold truncate">
                            {name}
                        </h3>
                        <span className="text-xs text-muted-foreground capitalize">
                            {muscleGroup}
                        </span>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-xl hover:bg-muted transition-colors"
                        >
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10 "
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border rounded-xl elevation-4 z-20 py-1 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsEditDrawerOpen(true);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                    >
                                        <Activity className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                    <MetadataChip
                        label="Sets"
                        value={`${setsMin}–${setsMax}`}
                        icon={<Hash className="w-3.5 h-3.5" />}
                    />
                    <MetadataChip
                        label="Reps"
                        value={`${repsMin}–${repsMax}`}
                        icon={<Repeat className="w-3.5 h-3.5" />}
                    />
                    <MetadataChip
                        label="Rest"
                        value={`${restMin}–${restMax}s`}
                        icon={<Timer className="w-3.5 h-3.5" />}
                    />
                    <MetadataChip
                        label="Tempo"
                        value={tempo}
                        icon={<Activity className="w-3.5 h-3.5" />}
                    />
                </div>

                {/* Set Tracker row */}
                <div className="pt-4 border-t border-border mt-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Log Sets
                    </span>
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
                initialData={{
                    exerciseId,
                    setsMin,
                    setsMax,
                    repsMin,
                    repsMax,
                    restMin,
                    restMax,
                    tempo,
                }}
                onUpdate={(newEwm) => {
                    setEwmId(newEwm.id);
                    router.refresh();
                }}
            />
        </>
    );
}

