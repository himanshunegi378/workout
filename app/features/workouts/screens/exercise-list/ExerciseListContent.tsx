"use client";

import { notFound } from "next/navigation";
import { Activity, Loader2, Timer as TimerIcon, Zap, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { PageHeader, EmptyState } from "@/app/components/ui";
import { ExerciseCard } from "./ui/ExerciseCard";
import { AddExerciseTrigger } from "../../../exercises/components/AddExerciseTrigger";
import { useWorkoutDetails, WorkoutDetailsResponse } from "../../api/query-hooks/use-workout-details";

type ExerciseLog = NonNullable<NonNullable<WorkoutDetailsResponse['session']>['sessionExerciseLogs'][number]['exerciseLog']>;

/**
 * The primary container for the live workout execution screen.
 * 
 * Context:
 * This component acts as the "mission control" for a training session. It manages 
 * the live workout timer, calculates real-time training volume, and tracks overall 
 * progress through the prescribed protocol. 
 * 
 * Why:
 * - Real-time Feedback: Provides a "Tactical HUD" with live duration, total sets, 
 *   and volume to keep users motivated and informed during their session.
 * - Progress Visualization: Includes a global progress bar that fills as exercises 
 *   are completed (reaching their minimum set count).
 * - Component Orchestration: Coordinates data flow from the `useWorkoutDetails` 
 *   hook down to individual `ExerciseCard` components, ensuring state consistency 
 *   across the entire session.
 */
export function ExerciseListContent({
    programmeId,
    workoutId,
}: {
    programmeId: string;
    workoutId: string;
}) {
    const { data, isLoading, isError } = useWorkoutDetails(programmeId, workoutId);
    const [secondsElapsed, setSecondsElapsed] = useState(0);

    // Live Timer Logic
    useEffect(() => {
        if (!data?.session?.start_time) return;
        const start = new Date(data.session.start_time).getTime();
        
        const interval = setInterval(() => {
            setSecondsElapsed(Math.floor((Date.now() - start) / 1000));
        }, 1000);
        
        return () => clearInterval(interval);
    }, [data?.session?.start_time]);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <>
                <PageHeader title="Loading..." backHref={`/programmes/${programmeId}`} showBackDefault />
                <div className="min-h-screen flex flex-col pt-24 items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    <span className="text-sm text-muted-foreground animate-pulse font-medium uppercase tracking-[0.2em]">Initializing Console...</span>
                </div>
            </>
        );
    }

    if (isError || !data) {
        if (isError) return (
            <div className="p-8"><EmptyState icon={Activity} title="System Error" description="Could not link to training session." /></div>
        );
        notFound();
    }

    const { workout, session, previousLogsByExercise } = data;

    // Advanced Calculations
    const logsByEwm: Record<string, ExerciseLog[]> = {};
    let currentVolume = 0;
    let totalSetsDone = 0;

    if (session) {
        session.sessionExerciseLogs.forEach((sel) => {
            if (sel.exercise_with_metadata_id && sel.exerciseLog) {
                if (!logsByEwm[sel.exercise_with_metadata_id]) logsByEwm[sel.exercise_with_metadata_id] = [];
                logsByEwm[sel.exercise_with_metadata_id].push(sel.exerciseLog);
                currentVolume += (sel.exerciseLog.weight || 0) * sel.exerciseLog.reps;
                totalSetsDone++;
            }
        });
        Object.values(logsByEwm).forEach(sets => sets.sort((a, b) => a.set_order_index - b.set_order_index));
    }

    const totalExercises = workout.exercisesWithMetadata.length;
    const completedExercises = workout.exercisesWithMetadata.filter(ewm => (logsByEwm[ewm.id]?.length || 0) >= (ewm.sets_min || 1)).length;
    const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <PageHeader
                title={workout.name}
                subtitle="Live Training Session"
                backHref={`/programmes/${programmeId}`}
                showBackDefault
                action={<AddExerciseTrigger programmeId={programmeId} workoutId={workoutId} variant="icon" />}
            />

            {/* Tactical HUD */}
            <div className="sticky top-16 md:top-20 z-30 bg-background/60 backdrop-blur-xl border-b border-border/40">
                <div className="max-w-lg md:max-w-5xl mx-auto px-4 md:px-10 py-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                                <TimerIcon className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Duration</span>
                            </div>
                            <span className="font-display text-lg font-bold text-foreground tabular-nums leading-none">
                                {formatTime(secondsElapsed)}
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                                <Zap className="w-3 h-3 text-accent" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Sets</span>
                            </div>
                            <span className="font-display text-lg font-bold text-foreground leading-none">
                                {totalSetsDone}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                                <Trophy className="w-3 h-3 text-warning" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Volume</span>
                            </div>
                            <span className="font-display text-lg font-bold text-foreground leading-none">
                                {currentVolume > 1000 ? `${(currentVolume/1000).toFixed(1)}k` : currentVolume}kg
                            </span>
                        </div>
                    </div>

                    <div className="relative h-1.5 bg-muted/20 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className="h-full bg-gradient-to-r from-accent to-indigo-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            <main className="max-w-lg md:max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
                {workout.exercisesWithMetadata.length === 0 ? (
                    <EmptyState
                        icon={Activity}
                        title="Empty Protocol"
                        description="Load exercises into the console to begin deployment."
                        action={<AddExerciseTrigger programmeId={programmeId} workoutId={workoutId} variant="button" />}
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                        {workout.exercisesWithMetadata.filter((ewm) => !ewm.is_hidden).map((ewm, i) => {
                            const exerciseLogs = logsByEwm[ewm.id] || [];
                            const isDone = exerciseLogs.length >= (ewm.sets_min || 1);

                            return (
                                <div
                                    key={ewm.id}
                                    className={`group transition-all duration-500 ${isDone ? 'opacity-40 scale-[0.98] grayscale-[0.5]' : 'opacity-100 scale-100'}`}
                                    style={{ animationDelay: `${i * 60}ms` }}
                                >
                                    <ExerciseCard
                                        workoutId={workoutId}
                                        programmeId={programmeId}
                                        ewmId={ewm.id}
                                        exerciseId={ewm.exercise_id}
                                        name={ewm.exercise.name}
                                        muscleGroup={ewm.exercise.muscle_group}
                                        setsMin={ewm.sets_min ?? 0}
                                        setsMax={ewm.sets_max ?? 0}
                                        repsMin={ewm.reps_min ?? 0}
                                        repsMax={ewm.reps_max ?? 0}
                                        restMin={ewm.rest_min ?? 0}
                                        restMax={ewm.rest_max ?? 0}
                                        tempo={ewm.tempo ?? ""}
                                        initialLogs={exerciseLogs}
                                        previousLogs={previousLogsByExercise[ewm.exercise_id] || []}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
