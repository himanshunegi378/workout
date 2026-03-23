"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { BottomDrawer, muscleColorMap } from "@/app/components/ui";

interface Exercise {
    id: string;
    name: string;
    muscle_group: string;
}

interface ExerciseSelectDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    exercises: Exercise[];
    onSelect: (exerciseId: string) => void;
    selectedId?: string;
}

/**
 * A modal-style bottom drawer for searching and selecting an exercise from a central library.
 * 
 * Context:
 * This acts as a reusable selector within the application (e.g., when adding exercises to a workout). 
 * It includes real-time filtering to handle large lists of exercises across different muscle groups.
 * 
 * Why:
 * - Searchability: Provides an intuitive way to find exercises by name or muscle group without 
 *   scrolling through a long, unstructured list.
 * - UX Visuals: Uses muscle-group-specific color coding to help users quickly identify 
 *   the category of an exercise, improving the speed of the selection process.
 * - Decoupling: Separates the selection mechanism from the configuration screen (`AddExerciseDrawer`),
 *   promoting cleaner component boundaries.
 */
export function ExerciseSelectDrawer({
    isOpen,
    onClose,
    exercises,
    onSelect,
    selectedId,
}: ExerciseSelectDrawerProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredExercises = useMemo(() => {
        if (!searchQuery.trim()) return exercises;
        const query = searchQuery.toLowerCase();
        return exercises.filter(
            (ex) =>
                ex.name.toLowerCase().includes(query) ||
                ex.muscle_group.toLowerCase().includes(query)
        );
    }, [exercises, searchQuery]);

    return (
        <BottomDrawer isOpen={isOpen} onClose={onClose} title="Select Exercise" height="85vh">
            <div className="shrink-0 border-b border-border/50 pb-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border border-border/70 bg-background/60 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                </div>
            </div>

            <div className="w-full flex-1 overflow-y-auto py-2 -mx-4 px-4">
                {filteredExercises.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                        <p className="text-sm">No exercises found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {filteredExercises.map((ex) => (
                            <button
                                key={ex.id}
                                onClick={() => {
                                    onSelect(ex.id);
                                    onClose();
                                }}
                                className={`flex w-full items-center gap-4 px-1 py-4 text-left transition-colors duration-200 active:scale-[0.99] ${selectedId === ex.id
                                    ? "bg-accent/5 text-foreground"
                                    : "hover:bg-muted/20"
                                    }`}
                            >
                                <div
                                    className={`h-10 w-1.5 shrink-0 rounded-full ${muscleColorMap[ex.muscle_group as keyof typeof muscleColorMap] || "bg-muted"
                                        }`}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">{ex.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5 capitalize truncate">{ex.muscle_group}</p>
                                </div>
                                <div className="ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border/50">
                                    {selectedId === ex.id && (
                                        <div className="w-3 h-3 rounded-full bg-accent" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </BottomDrawer>
    );
}
