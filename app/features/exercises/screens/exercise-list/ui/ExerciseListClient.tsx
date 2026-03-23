"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { MuscleGroupFilter } from "./MuscleGroupFilter";
import { ExerciseListCard } from "./ExerciseListCard";
import { EmptyState } from "@/app/components/ui";
import { Dumbbell } from "lucide-react";

type Filter = "All" | "Abs" | "Back" | "Biceps" | "Cardio" | "Chest" | "Forearms" | "Legs" | "Shoulders" | "Triceps";

interface Exercise {
    id: string;
    name: string;
    description: string | null;
    muscle_group: string;
}

interface ExerciseListClientProps {
    exercises: Exercise[];
}

/**
 * The client-side logic and UI for the exercise library list.
 * 
 * Context:
 * This component manages the presentation layer of the exercise library, including 
 * real-time search filtering and category-based filtering (muscle groups).
 * 
 * Why:
 * - Interactivity: By handling filtering on the client side, it provides an instantaneous 
 *   user experience when searching for exercises.
 * - Dynamic Layout: Automatically adjusts the list rendering based on filter results, 
 *   showing an empty state with an "Add Exercise" prompt when no matches are found.
 * - Animation: Orchestrates staggered entrance animations for list items to enhance the 
 *   premium feel of the application.
 */
export function ExerciseListClient({ exercises }: ExerciseListClientProps) {
    const [filter, setFilter] = useState<Filter>("All");
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        return exercises.filter((ex) => {
            const matchGroup = filter === "All" || ex.muscle_group === filter;
            const matchQuery = ex.name.toLowerCase().includes(query.toLowerCase());
            return matchGroup && matchQuery;
        });
    }, [exercises, filter, query]);

    return (
        <div className="space-y-6">
            <section className="space-y-5 border-b border-border/40 pb-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Library overview</p>
                        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                            Build a cleaner movement library.
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Search quickly, filter by muscle group, and keep the most useful exercises easy to find.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search exercises…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full rounded-full border border-border/70 bg-background/70 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/40"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/80">
                        <p>
                            {filtered.length} exercise{filtered.length !== 1 ? "s" : ""}
                            {filter !== "All" && ` · ${filter}`}
                        </p>
                        <Link
                            href="/exercises/new"
                            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:bg-muted/25"
                        >
                            <Plus className="h-4 w-4" />
                            New exercise
                        </Link>
                    </div>

                    <MuscleGroupFilter selected={filter} onChange={setFilter} />
                </div>
            </section>

            {filtered.length === 0 ? (
                <EmptyState
                    icon={Dumbbell}
                    title="No Exercises Found"
                    description={
                        query
                            ? `No results for "${query}"`
                            : "Add your first exercise to get started"
                    }
                    action={
                        <Link
                            href="/exercises/new"
                            className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover active:scale-[0.98]"
                        >
                            <Plus className="w-4 h-4" /> Add Exercise
                        </Link>
                    }
                />
            ) : (
                <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                        {filtered.map((ex, i) => (
                            <div
                                key={ex.id}
                                className="animate-slide-up h-full"
                                style={{ animationDelay: `${(i < 12 ? i : 12) * 40}ms` }}
                            >
                                <ExerciseListCard
                                    name={ex.name}
                                    description={ex.description}
                                    muscleGroup={ex.muscle_group}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
