"use client";

import { Dumbbell, Loader2 } from "lucide-react";
import { ProgrammeCard } from "./ProgrammeCard";
import { useProgrammes } from "../../api/query-hooks/use-programmes";
import { List } from "@/app/components/ui";

/**
 * A container component for displaying a list of all training programmes.
 * 
 * Context:
 * This component acts as the primary layout for the programmes screen, 
 * handling fetching and rendering of `ProgrammeCard` components or an 
 * empty state if no programmes exist.
 */
export function ProgrammeList() {
    const { data: programmes, isPending, isError } = useProgrammes();

    if (isPending) {
        return (
            <List.State className="items-start space-y-5 py-8 text-left text-muted-foreground">
                <div className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    <span className="text-sm">Loading programs...</span>
                </div>
                <div className="max-w-md space-y-3">
                    <div className="h-4 w-28 rounded-full bg-border/70" />
                    <div className="h-3.5 w-full rounded-full bg-border/50" />
                    <div className="h-3.5 w-5/6 rounded-full bg-border/40" />
                </div>
            </List.State>
        );
    }

    if (isError || !programmes || programmes.length === 0) {
        return (
            <List.Empty
                icon={Dumbbell}
                title="No programs yet"
                description="Create your first training program to start organizing workouts."
            />
        );
    }

    return (
        <List.Content>
            {programmes.map((programme, i) => (
                <List.Item key={programme.id} index={i}>
                    <ProgrammeCard
                        id={programme.id}
                        name={programme.name}
                        description={programme.description}
                        workoutCount={programme.workouts.length}
                    />
                </List.Item>
            ))}
        </List.Content>
    );
}
