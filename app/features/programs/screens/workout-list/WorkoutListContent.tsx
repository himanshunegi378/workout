"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Dumbbell, Plus, Loader2 } from "lucide-react";
import { PageHeader, EmptyState } from "@/app/components/ui";
import { useIsRestoring } from "@tanstack/react-query";
import { useProgramme } from "../../api/query-hooks/use-programme";
import { WorkoutCard } from "./WorkoutCard";

/**
 * The primary container for displaying all workouts within a specific programme.
 * 
 * Context:
 * This component acts as the main view for a programme, listing all its 
 * scheduled workouts and providing navigation to create new ones or 
 * edit existing ones.
 */
export function WorkoutListContent({ programmeId }: { programmeId: string }) {
    const isRestoring = useIsRestoring();
    const { data: programme, isLoading, isError } = useProgramme(programmeId);

    if (isRestoring || isLoading) {
        return (
            <>
                <PageHeader title="Loading..." backHref="/" />
                <div className="mx-auto flex min-h-[50vh] w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center text-muted-foreground sm:px-6 lg:px-8">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                    <span className="mt-4 text-sm">Loading workouts...</span>
                </div>
            </>
        );
    }

    if (isError || !programme) {
        if (isError) {
            return (
                <>
                    <PageHeader title="Error" backHref="/" />
                    <EmptyState
                        icon={Dumbbell}
                        title="Something went wrong"
                        description="Could not load programme. Please try again."
                    />
                </>
            );
        }
        notFound();
    }

    return (
        <>
            <PageHeader
                title={programme.name}
                backHref="/"
                showBackDefault
                action={
                    <Link
                        href={`/programmes/${programmeId}/workouts/new`}
                        className="p-2 rounded-xl hover:bg-muted transition-colors"
                    >
                        <Plus className="w-5 h-5 text-accent" />
                    </Link>
                }
            />

            <main className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Workouts</p>
                        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
                            Training days
                        </h2>
                    </div>
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground/90">
                        A quiet view of the program structure, with each workout kept as a single open row.
                    </p>
                </div>

                {programme.workouts.length === 0 ? (
                    <EmptyState
                        icon={Dumbbell}
                        title="No workouts yet"
                        description="Add your first workout to start building this program."
                        action={
                            <Link
                                href={`/programmes/${programmeId}/workouts/new`}
                                prefetch={true}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-display text-sm font-semibold !text-background transition-all duration-200 active:animate-press hover:bg-accent-hover"
                            >
                                <Plus className="w-4 h-4" /> Add Workout
                            </Link>
                        }
                    />
                ) : (
                    <div className="space-y-3 md:space-y-4">
                        {programme.workouts.map((workout, i) => {
                            const exercisePreview = workout.exercisesWithMetadata
                                .map((ewm) => ewm.exercise.name)
                                .join(" · ");

                            return (
                                <div
                                    key={workout.id}
                                    className="animate-slide-up"
                                    style={{ animationDelay: `${i * 60}ms` }}
                                >
                                    <WorkoutCard
                                        id={workout.id}
                                        programmeId={programmeId}
                                        name={workout.name}
                                        exercisePreview={exercisePreview}
                                        exerciseCount={workout._count.exercisesWithMetadata}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </>
    );
}
