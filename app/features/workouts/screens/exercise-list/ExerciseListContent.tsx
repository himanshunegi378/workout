"use client";

import { notFound } from "next/navigation";
import { Activity, Loader2, Timer as TimerIcon, Zap, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { PageShell, List } from "@/app/components/ui";
import { PageHeader } from "@/app/features/page-header";
import { RestTimerHeaderActionBridge } from "@/app/features/rest-timer";
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
    const { data, isPending, isError } = useWorkoutDetails(programmeId, workoutId);
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

    if (isPending) {
        return (
            <PageShell
                header={<PageHeader title="Loading..." backHref={`/programmes/${programmeId}`} showBackDefault />}
                size="xl"
            >
                <List.Loading
                    className="min-h-[50vh]"
                    title="Initializing session..."
                    icon={Loader2}
                />
            </PageShell>
        );
    }

    if (isError || !data) {
        if (isError) return (
            <PageShell
                header={<PageHeader title="Workout Session" backHref={`/programmes/${programmeId}`} showBackDefault />}
                size="xl"
            >
                <List.Error
                    icon={Activity}
                    title="System Error"
                    description="Could not link to training session."
                />
            </PageShell>
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
        <PageShell
            header={
                <PageHeader
                    title={workout.name}
                    subtitle="Live Training Session"
                    backHref={`/programmes/${programmeId}`}
                    showBackDefault
                    action={<AddExerciseTrigger programmeId={programmeId} workoutId={workoutId} variant="icon" />}
                />
            }
            size="xl"
            contentClassName="max-w-none px-0 py-0"
        >



            <div className="sticky top-16 z-30 border-b rounded-2xl border-border/40 bg-background/95 backdrop-blur-md md:top-20">
                <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">

                    <div className="flex items-baseline gap-6 sm:gap-8">
                        <span className="font-display text-3xl sm:text-4xl font-black tracking-tighter tabular-nums text-foreground">
                            {formatTime(secondsElapsed)}
                        </span>

                        <div className="flex items-baseline gap-1.5 opacity-80">
                            <span className="font-display text-xl font-bold tabular-nums">{totalSetsDone}</span>
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Sets</span>
                        </div>

                        <div className="flex items-baseline gap-1.5 opacity-80">
                            <span className="font-display text-xl font-bold tabular-nums">
                                {currentVolume > 1000 ? `${(currentVolume / 1000).toFixed(1)}k` : currentVolume}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Kg</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground tabular-nums tracking-widest">{completedExercises} OF {totalExercises}</span>
                        <div className="w-24 h-1.5 rounded-full bg-border overflow-hidden">
                            <div className="h-full bg-foreground transition-all duration-700 ease-out" style={{ width: `${progressPercentage}%` }} />
                        </div>
                    </div>

                </div>
            </div>

            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                {workout.exercisesWithMetadata.length === 0 ? (
                    <List.Empty
                        icon={Activity}
                        title="Empty Protocol"
                        description="Load exercises into the console to begin deployment."
                        action={<AddExerciseTrigger programmeId={programmeId} workoutId={workoutId} variant="button" />}
                    />
                ) : (
                    <List.Content layout="grid" columns={2} gap="lg" className="lg:gap-5">
                        {workout.exercisesWithMetadata.filter((ewm) => !ewm.is_hidden).map((ewm, i) => {
                            const exerciseLogs = logsByEwm[ewm.id] || [];
                            const isDone = exerciseLogs.length >= (ewm.sets_min || 1);

                            return (
                                <List.Item
                                    key={ewm.id}
                                    index={i}
                                    tone={isDone ? "completed" : "default"}
                                    className="group"
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
                                </List.Item>
                            );
                        })}
                    </List.Content>
                )}
            </div>
        </PageShell>
    );
}
