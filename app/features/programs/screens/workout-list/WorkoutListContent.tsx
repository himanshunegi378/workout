"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Dumbbell, Plus, Loader2 } from "lucide-react";
import { PageHeader, List } from "@/app/components/ui";
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
                <List.Loading
                    className="mx-auto min-h-[50vh] w-full max-w-6xl px-4 sm:px-6 lg:px-8"
                    title="Loading workouts..."
                    icon={Loader2}
                />
            </>
        );
    }

    if (isError || !programme) {
        if (isError) {
            return (
                <>
                    <PageHeader title="Error" backHref="/" />
                    <List.Error
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
                <List.Root>
                    <List.Header>
                        <List.Intro className="gap-2 md:items-end">
                            <List.Heading>
                                <List.Eyebrow className="tracking-[0.22em]">Workouts</List.Eyebrow>
                                <List.Title className="md:text-2xl">Training days</List.Title>
                            </List.Heading>
                            <List.Description className="max-w-xl text-muted-foreground/90">
                                A quiet view of the program structure, with each workout kept as a single open row.
                            </List.Description>
                        </List.Intro>
                    </List.Header>

                    {programme.workouts.length === 0 ? (
                        <List.Empty
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
                        <List.Content>
                            {programme.workouts.map((workout, i) => {
                                const exercisePreview = workout.exercisesWithMetadata
                                    .map((ewm) => ewm.exercise.name)
                                    .join(" · ");

                                return (
                                    <List.Item key={workout.id} index={i}>
                                        <WorkoutCard
                                            id={workout.id}
                                            programmeId={programmeId}
                                            name={workout.name}
                                            exercisePreview={exercisePreview}
                                            exerciseCount={workout._count.exercisesWithMetadata}
                                        />
                                    </List.Item>
                                );
                            })}
                        </List.Content>
                    )}
                </List.Root>
            </main>
        </>
    );
}
