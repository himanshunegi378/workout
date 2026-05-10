"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Repeat, Timer, Activity, MoreHorizontal, Trophy, Flame, Target } from "lucide-react";
import { muscleColorMap } from "@/app/components/ui";
import { 
    SetTracker, 
    LogSetDrawer, 
    ExerciseQuickLogDrawer 
} from "@/app/features/logging";
import { ConfirmDrawer } from "@/app/components/ui";
import { EditExerciseMetadataDrawer } from "./EditExerciseMetadataDrawer";
import { ExerciseLog, ExerciseWithMetadata } from "../../../types";
import { useExerciseLogging } from "../../../hooks/use-exercise-logging";

interface ExerciseCardProps {
    workoutId: string;
    programmeId: string;
    ewm: ExerciseWithMetadata;
    initialLogs?: ExerciseLog[];
    previousLogs?: ExerciseLog[];
}

/**
 * A comprehensive card displaying an exercise's prescriptive data and current 
 * session progress. 
 * 
 * Context:
 * This is the primary unit of interaction during a workout. It communicates 
 * the exercise protocol (sets, reps, rest, tempo), tracks completed sets via 
 * `SetTracker`, and manages the logic for logging new sets, updating existing ones, 
 * or triggering PR celebrations.
 */
export function ExerciseCard({
    workoutId,
    programmeId,
    ewm,
    initialLogs = [],
    previousLogs = [],
}: ExerciseCardProps) {
    const { exercise } = ewm;
    const colorClass = muscleColorMap[exercise.muscle_group] ?? "bg-accent";
    const router = useRouter();
    
    // We keep ewmId in state because the edit drawer might update it mid-session
    // before the server-side refresh completes.
    const [ewmId, setEwmId] = useState(ewm.id);

    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const {
        logs,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        saveSet,
        deleteSet,
        isSaving,
        isDeleting,
        weight,
        setWeight,
        reps,
        setReps,
        rpe,
        setRpe,
        previousLog,
        currentLog,
    } = useExerciseLogging({
        workoutId,
        exercise,
        initialLogs,
        restMin: ewm.rest_min ?? 0,
    });

    const setsMin = ewm.sets_min ?? 0;
    const setsMax = ewm.sets_max ?? 0;
    const isCompleted = logs.length >= setsMin && logs.length > 0;
    const isPerfect = logs.length >= setsMax && setsMax > 0;

    const handleSaveSet = () => saveSet(ewmId);
    const handleDeleteSet = () => setIsDeleteConfirmOpen(true);

    return (
        <>
            <div 
                className={`relative overflow-hidden rounded-3xl bg-card/45 p-5 transition-all duration-300 border border-border/50
                    ${isCompleted ? "opacity-85" : "opacity-100"}
                    ${isPerfect ? "ring-2 ring-success/30 bg-success/[0.02]" : ""}
                `}
            >
                {/* Header: Name, Muscle Group, Status */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className={`h-8 w-1.5 shrink-0 rounded-full ${colorClass}`} />
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                                {exercise.name}
                            </h3>
                            {isPerfect && (
                                <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-success">
                                    <Flame className="w-3 h-3 fill-current" /> Mastered
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsEditDrawerOpen(true)}
                        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground active:scale-95"
                    >
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                </div>

                {/* Muscle Group Badge */}
                <div className="mt-2 pl-4.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                        {exercise.muscle_group}
                    </span>
                </div>

                {/* Prescription Pills */}
                <div className="mt-5 flex flex-wrap gap-2 pl-4.5">
                    <span className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground/80">
                        <Target className="w-3.5 h-3.5" /> {setsMin}-{setsMax} Sets
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground/80">
                        <Repeat className="w-3.5 h-3.5" /> {ewm.reps_min}-{ewm.reps_max} Reps
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground/80">
                        <Timer className="w-3.5 h-3.5" /> {ewm.rest_min}-{ewm.rest_max}s
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground/80 lowercase">
                        {ewm.tempo}
                    </span>
                    {previousLogs.length > 0 && (
                        <span className="flex items-center gap-1.5 rounded-lg bg-accent/10 text-accent px-2.5 py-1.5 text-xs font-medium">
                            <Trophy className="w-3.5 h-3.5" /> Beat Previous
                        </span>
                    )}
                </div>

                {/* Progress / Set Tracker */}
                <div className="mt-8 pl-4.5">
                    <SetTracker
                        protocol={{
                            setsMin,
                            setsMax,
                            targetReps: ewm.reps_min ?? 0
                        }}
                        logs={logs}
                        onSetClick={openDrawer}
                        previousLogs={previousLogs}
                    />
                </div>

                <button 
                    onClick={() => setIsHistoryDrawerOpen(true)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-border/50 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-muted/30 hover:text-foreground active:scale-[0.98]"
                >
                    <Activity className="h-3.5 w-3.5" />
                    History & Analytics
                </button>
            </div>

            <LogSetDrawer
                isOpen={isDrawerOpen}
                onClose={closeDrawer}
                exerciseName={exercise.name}
                weight={weight}
                setWeight={setWeight}
                reps={reps}
                setReps={setReps}
                rpe={rpe}
                setRpe={setRpe}
                onSave={handleSaveSet}
                onDelete={handleDeleteSet}
                isSaving={isSaving}
                isDeleting={isDeleting}
                isEdit={!!currentLog}
                previousLog={previousLog}
            />

            <EditExerciseMetadataDrawer
                isOpen={isEditDrawerOpen}
                onClose={() => setIsEditDrawerOpen(false)}
                programmeId={programmeId}
                workoutId={workoutId}
                ewm={ewm}
                onUpdate={(newEwm) => { setEwmId(newEwm.id); router.refresh(); }}
            />

            <ExerciseQuickLogDrawer
                key={exercise.id}
                isOpen={isHistoryDrawerOpen}
                onClose={() => setIsHistoryDrawerOpen(false)}
                exercise={exercise}
            />

            <ConfirmDrawer
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={() => {
                    deleteSet();
                    setIsDeleteConfirmOpen(false);
                }}
                title="Remove Set?"
                description="This will permanently delete this set from your session history."
                confirmText="Remove"
                variant="destructive"
            />
        </>
    );
}
