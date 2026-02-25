"use client";

import { Loader2 } from "lucide-react";
import { GroupCard } from "./ui/GroupCard";
import { GroupsEmptyState } from "./ui/GroupsEmptyState";
import { useWorkoutGroups } from "../api/query-hooks/use-workout-groups";

export function WorkoutGroupList() {
    const { data: groups, isLoading, isError } = useWorkoutGroups();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-sm">Loading programs...</span>
            </div>
        );
    }

    if (isError || !groups || groups.length === 0) {
        return <GroupsEmptyState />;
    }

    return (
        <div className="space-y-3">
            {groups.map((group, i) => (
                <div
                    key={group.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                >
                    <GroupCard
                        id={group.id}
                        name={group.name}
                        description={group.description}
                        workoutCount={group.workouts.length}
                    />
                </div>
            ))}
        </div>
    );
}
