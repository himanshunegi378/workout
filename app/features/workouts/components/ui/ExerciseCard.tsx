"use client";

import { useState } from "react";
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

import { EditExerciseMetadataDrawer } from "./EditExerciseMetadataDrawer";

interface ExerciseLog {
    id: string;
    weight: number | null;
    reps: number;
    set_order_index: number;
}

interface ExerciseCardProps {
    workoutId: string;
    groupId: string;
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
}

export function ExerciseCard({
    workoutId,
    groupId,
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
    const [previousLog, setPreviousLog] = useState<{ weight: number | null; reps: number } | null>(null);

    const { startTimer } = useRestTimer();

    // Track logs locally for immediate UI feedback
    const [logs, setLogs] = useState<ExerciseLog[]>(initialLogs);

    const { mutate: logSetMutation, isPending: isSaving } = useLogSet();
    const { mutate: updateSetMutation, isPending: isUpdating } = useUpdateLogSet();
    const { mutate: deleteSetMutation, isPending: isDeleting } = useDeleteLogSet();

    const currentLog = logs.find((l) => l.set_order_index === activeSetIndex);
    const completedSets = logs.map((l) => l.set_order_index);

    const handleSetClick = async (setIndex: number) => {
        setActiveSetIndex(setIndex);
        const log = logs.find((l) => l.set_order_index === setIndex);

        let initialWeight = "";
        let initialReps = "";

        if (log) {
            initialWeight = log.weight?.toString() || "";
            initialReps = log.reps.toString();
        } else {
            // Default to previous set in current session
            const previousSetLog = logs
                .filter((l) => l.set_order_index < setIndex)
                .sort((a, b) => b.set_order_index - a.set_order_index)[0];

            if (previousSetLog) {
                initialWeight = previousSetLog.weight?.toString() || "";
                initialReps = previousSetLog.reps.toString();
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

        if (currentLog) {
            // Update existing set
            updateSetMutation(
                {
                    setId: currentLog.id,
                    weight,
                    reps,
                },
                {
                    onSuccess: (updated: ExerciseLog) => {
                        setLogs((prev) =>
                            prev.map((l) => (l.id === updated.id ? updated : l))
                        );
                        setIsDrawerOpen(false);
                    },
                    onError: (error: any) => {
                        alert(`Error updating set: ${error.message}`);
                    },
                }
            );
        } else {
            // Create new set
            logSetMutation(
                {
                    workoutId,
                    exerciseWithMetadataId: ewmId,
                    exerciseId,
                    setOrderIndex: activeSetIndex,
                    weight: weight,
                    reps: reps,
                },
                {
                    onSuccess: (newLog) => {
                        setLogs((prev) => [...prev, newLog]);
                        setIsDrawerOpen(false);
                        startTimer(restMin); // Auto-start rest timer
                    },
                    onError: (error: any) => {
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
                onError: (error: any) => {
                    alert(`Error deleting set: ${error.message}`);
                },
            });
        }
    };

    return (
        <>
            <div className="bg-card text-card-foreground rounded-2xl p-4 border border-border">
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
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden">
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
                        completedSets={completedSets}
                        onSetClick={handleSetClick}
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
                groupId={groupId}
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

