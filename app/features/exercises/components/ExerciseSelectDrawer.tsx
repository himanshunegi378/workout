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
            {/* Search Bar */}
            <div className="pb-4 shrink-0 border-b border-border/50">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-muted border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto w-full py-2 -mx-4 px-4">
                {filteredExercises.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                        <p className="text-sm">No exercises found.</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredExercises.map((ex) => (
                            <button
                                key={ex.id}
                                onClick={() => {
                                    onSelect(ex.id);
                                    onClose();
                                }}
                                className={`w-full text-left flex items-center p-4 rounded-xl transition-all duration-200 active:scale-[0.98] ${selectedId === ex.id
                                    ? "bg-accent/10 border border-accent/20"
                                    : "hover:bg-muted border border-transparent"
                                    }`}
                            >
                                <div
                                    className={`w-1.5 h-10 rounded-full shrink-0 mr-4 ${muscleColorMap[ex.muscle_group as keyof typeof muscleColorMap] || "bg-muted"
                                        }`}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">{ex.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5 capitalize truncate">{ex.muscle_group}</p>
                                </div>
                                <div className="w-5 h-5 rounded-full border border-border/50 flex items-center justify-center shrink-0 ml-3">
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
