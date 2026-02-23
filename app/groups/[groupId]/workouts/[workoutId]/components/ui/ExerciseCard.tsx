"use client";

import { useState } from "react";
import { Hash, Repeat, Timer, Activity, MoreHorizontal } from "lucide-react";
import { MetadataChip, muscleColorMap } from "@/app/components/ui";
import { SetTracker } from "./SetTracker";
import { LogSetDrawer } from "./LogSetDrawer";
import { RestTimer } from "./RestTimer";

interface ExerciseCardProps {
    workoutId: string;
    ewmId: string; // ExerciseWithMetadata ID
    exerciseId: string;
    name: string;
    muscleGroup: string;
    setsMin: number;
    setsMax: number;
    repsMin: number;
    repsMax: number;
    restMin: number;
    restMax: number;
    tempo: string;
    initialCompletedSets?: number[];
}

export function ExerciseCard({
    workoutId,
    ewmId,
    exerciseId,
    name,
    muscleGroup,
    setsMin,
    setsMax,
    repsMin,
    repsMax,
    restMin,
    restMax,
    tempo,
    initialCompletedSets = [],
}: ExerciseCardProps) {
    const colorClass = muscleColorMap[muscleGroup] ?? "bg-accent";

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeSetIndex, setActiveSetIndex] = useState(0);
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [previousLog, setPreviousLog] = useState<{ weight: number | null; reps: number } | null>(null);

    // Timer State
    const [isTimerOpen, setIsTimerOpen] = useState(false);

    // Track which sets are completed locally for immediate UI feedback
    const [completedSets, setCompletedSets] = useState<number[]>(initialCompletedSets);

    const handleSetClick = async (setIndex: number) => {
        setActiveSetIndex(setIndex);
        setWeight("");
        setReps("");

        // Fetch previous log data to pre-fill
        try {
            const res = await fetch(`/api/exercises/${exerciseId}/last-log`);
            if (res.ok) {
                const data = await res.json();
                setPreviousLog(data);
            }
        } catch (error) {
            console.error("Failed to fetch previous log", error);
        }

        setIsDrawerOpen(true);
    };

    const handleSaveSet = async () => {
        if (!reps) return;
        setIsSaving(true);

        try {
            const res = await fetch("/api/log/set", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workoutId,
                    exerciseWithMetadataId: ewmId,
                    exerciseId,
                    setOrderIndex: activeSetIndex,
                    weight: weight ? parseFloat(weight) : null,
                    reps: parseInt(reps),
                }),
            });

            if (res.ok) {
                setCompletedSets((prev) => [...new Set([...prev, activeSetIndex])]);
                setIsDrawerOpen(false);
                setIsTimerOpen(true); // Auto-start rest timer
            } else {
                const data = await res.json();
                alert(`Error saving set: ${data.error}`);
            }
        } catch (error: any) {
            console.error("Failed to log set", error);
            alert(`Network error saving set: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="bg-card text-card-foreground rounded-2xl p-4 border border-border">
                {/* Exercise header */}
                <div className="flex items-center gap-3 mb-3">
                    <div className={`w-2 h-8 rounded-full ${colorClass}`} />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base font-semibold truncate">
                            {name}
                        </h3>
                        <span className="text-xs text-muted-foreground capitalize">
                            {muscleGroup}
                        </span>
                    </div>
                    <button className="p-2 rounded-xl hover:bg-muted transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                    <MetadataChip
                        label="Sets"
                        value={`${setsMin}–${setsMax}`}
                        icon={<Hash className="w-3.5 h-3.5" />}
                    />
                    <MetadataChip
                        label="Reps"
                        value={`${repsMin}–${repsMax}`}
                        icon={<Repeat className="w-3.5 h-3.5" />}
                    />
                    <MetadataChip
                        label="Rest"
                        value={`${restMin}–${restMax}s`}
                        icon={<Timer className="w-3.5 h-3.5" />}
                    />
                    <MetadataChip
                        label="Tempo"
                        value={tempo}
                        icon={<Activity className="w-3.5 h-3.5" />}
                    />
                </div>

                {/* Set Tracker row */}
                <div className="pt-4 border-t border-border mt-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Log Sets
                    </span>
                    <SetTracker
                        setsMin={setsMin}
                        setsMax={setsMax}
                        completedSets={completedSets}
                        onSetClick={handleSetClick}
                    />
                </div>
            </div>

            <LogSetDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                exerciseName={name}
                setIndex={activeSetIndex}
                weight={weight}
                setWeight={setWeight}
                reps={reps}
                setReps={setReps}
                onSave={handleSaveSet}
                isSaving={isSaving}
                previousLog={previousLog}
            />

            <RestTimer
                isOpen={isTimerOpen}
                durationSeconds={restMin}
                onClose={() => setIsTimerOpen(false)}
            />
        </>
    );
}
