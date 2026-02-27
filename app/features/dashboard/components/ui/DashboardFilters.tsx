"use client";

import { ChevronDown } from "lucide-react";
import { DashboardFiltersState } from "../../types";

interface DashboardFiltersProps {
    filters: DashboardFiltersState;
    setFilters: (update: (prev: DashboardFiltersState) => DashboardFiltersState) => void;
    workouts: { id: string; name: string }[];
    muscleGroups: string[];
}

export function DashboardFilters({ filters, setFilters, workouts, muscleGroups }: DashboardFiltersProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Workout Selector */}
            {workouts.length > 0 && (
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Workout</label>
                    <div className="relative">
                        <select
                            className="w-full appearance-none bg-card hover:bg-muted/50 transition-colors text-foreground border border-border rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent elevation-1 cursor-pointer"
                            value={filters.workoutId}
                            onChange={(e) => setFilters(f => ({ ...f, workoutId: e.target.value }))}
                        >
                            <option value="all">All Workouts</option>
                            {workouts.map(w => (
                                <option key={w.id} value={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>
            )}

            {/* Muscle Group Selector */}
            {muscleGroups.length > 0 && (
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Muscle</label>
                    <div className="relative">
                        <select
                            className="w-full appearance-none bg-card hover:bg-muted/50 transition-colors text-foreground border border-border rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent elevation-1 cursor-pointer"
                            value={filters.muscleGroup}
                            onChange={(e) => setFilters(f => ({ ...f, muscleGroup: e.target.value }))}
                        >
                            <option value="all">All Muscles</option>
                            {muscleGroups.map(mg => (
                                <option key={mg} value={mg}>
                                    {mg}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
