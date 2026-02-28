"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { MuscleGroupFilter } from "./ui/MuscleGroupFilter";
import { ExerciseListCard } from "./ui/ExerciseListCard";
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
        <div className="space-y-4">
            {/* Search bar */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search exercises…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl
                        pl-10 pr-4 py-2.5 text-sm text-foreground
                        placeholder:text-muted-foreground/50
                        focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent
                        transition-all duration-200"
                />
            </div>

            {/* Muscle group filter pills */}
            <MuscleGroupFilter selected={filter} onChange={setFilter} />

            {/* Count */}
            <p className="text-xs text-muted-foreground px-0.5">
                {filtered.length} exercise{filtered.length !== 1 ? "s" : ""}
                {filter !== "All" && ` · ${filter}`}
            </p>

            {/* List */}
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
                            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover
                                text-accent-foreground font-display font-semibold
                                px-5 py-3 rounded-xl transition-all duration-200 active:animate-press text-sm"
                        >
                            <Plus className="w-4 h-4" /> Add Exercise
                        </Link>
                    }
                />
            ) : (
                <div className="space-y-2.5">
                    {filtered.map((ex, i) => (
                        <div
                            key={ex.id}
                            className="animate-slide-up"
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <ExerciseListCard
                                name={ex.name}
                                description={ex.description}
                                muscleGroup={ex.muscle_group}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
