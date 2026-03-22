"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui";
import { useCreateWorkout } from "../../api/mutation-hooks/use-create-workout";

interface AddWorkoutFormProps {
    programmeId: string;
}

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
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            {/* Workout Name */}
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
                    className="w-full bg-muted border border-border rounded-xl
                 px-4 py-3 text-foreground placeholder:text-muted-foreground/50
                 focus:outline-none focus:ring-2 focus:ring-ring
                 focus:border-accent transition-all duration-200
                 font-body text-base"
                />
            </div>

            {/* Description */}
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
                    className="w-full bg-muted border border-border rounded-xl
                 px-4 py-3 text-foreground placeholder:text-muted-foreground/50
                 focus:outline-none focus:ring-2 focus:ring-ring
                 focus:border-accent transition-all duration-200
                 font-body text-base resize-none"
                />
            </div>

            {/* Error */}
            {mutationError && (
                <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-danger text-sm animate-slide-up">
                    {mutationError instanceof Error ? mutationError.message : "Something went wrong"}
                </div>
            )}

            {/* Submit */}
            <Button
                type="submit"
                variant="primary"
                disabled={!canSubmit || isPending}
                className="w-full"
            >
                {isPending ? "Saving…" : "Save Workout"}
            </Button>
        </form>
    );
}
