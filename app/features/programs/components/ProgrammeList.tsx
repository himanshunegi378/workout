"use client";

import { Loader2 } from "lucide-react";
import { ProgrammeCard } from "./ui/ProgrammeCard";
import { ProgrammesEmptyState } from "./ui/ProgrammesEmptyState";
import { useProgrammes } from "../api/query-hooks/use-programmes";

export function ProgrammeList() {
    const { data: programmes, isLoading, isError } = useProgrammes();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-sm">Loading programs...</span>
            </div>
        );
    }

    if (isError || !programmes || programmes.length === 0) {
        return <ProgrammesEmptyState />;
    }

    return (
        <div className="space-y-3">
            {programmes.map((programme, i) => (
                <div
                    key={programme.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                >
                    <ProgrammeCard
                        id={programme.id}
                        name={programme.name}
                        description={programme.description}
                        workoutCount={programme.workouts.length}
                    />
                </div>
            ))}
        </div>
    );
}
