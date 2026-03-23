"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui";
import { useCreateWorkout } from "../../api/mutation-hooks/use-create-workout";

interface AddWorkoutFormProps {
    programmeId: string;
}

/**
 * A form component for creating a new workout within a specific programme.
 * 
 * Context:
 * This form allows users to define a new training day (e.g., "Leg Day") and attach 
 * it to a parent programme. 
 * 
 * Why:
 * - Structured Training: Forces users to name their workouts, which improves 
 *   organization when scrolling through a large training cycle.
 * - UX Feedback: Provides clear loading and error feedback during the asynchronous 
 *   creation process using the `useCreateWorkout` mutation.
 */
export function AddWorkoutForm({ programmeId }: AddWorkoutFormProps) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { mutate: createWorkout, isPending, error: mutationError } = useCreateWorkout();

    const canSubmit = name.trim().length > 0;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;

        createWorkout(
            {
                programmeId,
                data: {
                    name: name.trim(),
                    description: description.trim() || null,
                }
            },
            {
                onSuccess: () => {
                    router.push(`/programmes/${programmeId}`);
                    router.refresh();
                },
            }
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-7 animate-slide-up">
            <div className="space-y-1.5">
                <label
                    className="text-sm font-medium text-foreground"
                    htmlFor="workout-name"
                >
                    Workout Name
                </label>
                <input
                    id="workout-name"
                    type="text"
                    placeholder="e.g. Pull Day, Legs B"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-border/80 bg-background/60 px-4 py-3.5 text-foreground placeholder:text-muted-foreground/50 transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/40 font-body text-base"
                />
            </div>

            <div className="space-y-1.5">
                <label
                    className="text-sm font-medium text-foreground"
                    htmlFor="workout-desc"
                >
                    Description{" "}
                    <span className="text-muted-foreground font-normal">
                        (optional)
                    </span>
                </label>
                <textarea
                    id="workout-desc"
                    rows={3}
                    placeholder="Focus on deadlifts and upper back..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full resize-none rounded-2xl border border-border/80 bg-background/60 px-4 py-3.5 text-foreground placeholder:text-muted-foreground/50 transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/40 font-body text-base"
                />
            </div>

            {mutationError && (
                <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger animate-slide-up">
                    {mutationError instanceof Error ? mutationError.message : "Something went wrong"}
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                disabled={!canSubmit || isPending}
                className="w-full shadow-none"
            >
                {isPending ? "Saving…" : "Save Workout"}
            </Button>
        </form>
    );
}
