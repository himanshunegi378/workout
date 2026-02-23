import { notFound } from "next/navigation";
import Link from "next/link";
import { Dumbbell, Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import { PageHeader, Button, EmptyState } from "@/app/components/ui";
import { WorkoutCard } from "./ui/WorkoutCard";

export async function WorkoutListContent({ groupId }: { groupId: string }) {
    const userId = await requireUserId();

    const group = await prisma.workoutGroup.findFirst({
        where: { id: groupId, user_id: userId },
        include: {
            workouts: {
                orderBy: { order_index: "asc" },
                include: {
                    exercisesWithMetadata: {
                        include: {
                            exercise: { select: { name: true } },
                        },
                        orderBy: { order_index: "asc" },
                        take: 3,
                    },
                    _count: { select: { exercisesWithMetadata: true } },
                },
            },
        },
    });

    if (!group) notFound();

    return (
        <>
            <PageHeader
                title={group.name}
                backHref="/"
                action={
                    <Link
                        href={`/groups/${groupId}/workouts/new`}
                        className="p-2 rounded-xl hover:bg-muted transition-colors"
                    >
                        <Plus className="w-5 h-5 text-accent" />
                    </Link>
                }
            />

            <main className="max-w-lg mx-auto px-4 py-4">
                {group.workouts.length === 0 ? (
                    <EmptyState
                        icon={Dumbbell}
                        title="No Workouts Yet"
                        description="Add your first workout to this program"
                        action={
                            <Link
                                href={`/groups/${groupId}/workouts/new`}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3
                                         rounded-xl font-display text-sm font-semibold
                                         transition-all duration-200 active:animate-press
                                         bg-accent hover:bg-accent-hover text-accent-foreground shadow-lg shadow-accent/20"
                            >
                                <Plus className="w-4 h-4" /> Add Workout
                            </Link>
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        {group.workouts.map((workout, i) => {
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
                                        groupId={groupId}
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
