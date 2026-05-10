"use client";

import { notFound, useRouter } from "next/navigation";
import { Activity, Loader2, Trophy } from "lucide-react";
import { useState } from "react";
import { PageShell, List, ConfirmDrawer } from "@/app/components/ui";
import { PageHeader } from "@/app/features/page-header";
import { ExerciseCard } from "./ui/ExerciseCard";
import { AddExerciseTrigger } from "@/app/features/exercises";
import { useWorkoutDetails } from "../../api/query-hooks/use-workout-details";
import { useFinishWorkout } from "../../api/mutation-hooks/use-finish-workout";
import { useWorkoutSession } from "../../hooks/use-workout-session";

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
    const router = useRouter();
    const { data, isPending, isError } = useWorkoutDetails(programmeId, workoutId);
    const { mutate: finishWorkout, isPending: isFinishing } = useFinishWorkout();
    const { displayTime, metrics, session, workout, previousLogsByExercise } = useWorkoutSession(data);
    const [isFinishConfirmOpen, setIsFinishConfirmOpen] = useState(false);

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

    if (isError || !data || !workout || !metrics) {
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

    const handleFinishWorkout = () => {
        if (!session) return;
        setIsFinishConfirmOpen(true);
    };

    const confirmFinishWorkout = () => {
        if (!session) return;
        finishWorkout({ sessionId: session.id }, {
            onSuccess: () => {
                router.push(`/programmes/${programmeId}`);
            }
        });
    };

    return (
        <PageShell
            header={
                <PageHeader
                    title={workout.name}
                    subtitle="Live Training Session"
                    backHref={`/programmes/${programmeId}`}
                    showBackDefault
                    action={
                        <div className="flex items-center gap-2">
                            {session && (
                                <button
                                    onClick={handleFinishWorkout}
                                    disabled={isFinishing}
                                    className="flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent font-bold rounded-xl transition-all disabled:opacity-50"
                                >
                                    {isFinishing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trophy className="w-4 h-4" />
                                    )}
                                    <span>Finish</span>
                                </button>
                            )}
                            <AddExerciseTrigger programmeId={programmeId} workoutId={workoutId} variant="icon" />
                        </div>
                    }
                />
            }
            size="xl"
            contentClassName="max-w-none px-0 py-0"
        >



            <div className="sticky top-16 z-30 border-b rounded-2xl border-border/40 bg-background/95 backdrop-blur-md md:top-20">
                <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">

                    <div className="flex items-baseline gap-6 sm:gap-8">
                        <span className="font-display text-3xl sm:text-4xl font-black tracking-tighter tabular-nums text-foreground">
                            {displayTime}
                        </span>

                        <div className="flex items-baseline gap-1.5 opacity-80">
                            <span className="font-display text-xl font-bold tabular-nums">{metrics.totalSetsDone}</span>
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Sets</span>
                        </div>

                        <div className="flex items-baseline gap-1.5 opacity-80">
                            <span className="font-display text-xl font-bold tabular-nums">
                                {metrics.totalVolume > 1000 ? `${(metrics.totalVolume / 1000).toFixed(1)}k` : metrics.totalVolume}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Kg</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground tabular-nums tracking-widest">{metrics.completedExercises} OF {metrics.totalExercises}</span>
                        <div className="w-24 h-1.5 rounded-full bg-border overflow-hidden">
                            <div className="h-full bg-foreground transition-all duration-700 ease-out" style={{ width: `${metrics.progressPercentage}%` }} />
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
                            const exerciseLogs = metrics.logsByEwm[ewm.id] || [];
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
                                        ewm={ewm}
                                        initialLogs={exerciseLogs}
                                        previousLogs={previousLogsByExercise?.[ewm.exercise_id] || []}
                                    />
                                </List.Item>
                            );
                        })}
                    </List.Content>
                )}
            </div>

            <ConfirmDrawer
                isOpen={isFinishConfirmOpen}
                onClose={() => setIsFinishConfirmOpen(false)}
                onConfirm={confirmFinishWorkout}
                title="Finish Workout?"
                description="Ready to finish your training session? Current volume and total duration will be logged."
                confirmText="Finish Training"
                variant="primary"
            />
        </PageShell>
    );
}
