"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MuscleGroup } from "@/app/generated/prisma/client";
import { Button, MuscleGroupSelector } from "@/app/components/ui";
import { useCreateExercise } from "../../api/mutation-hooks/use-create-exercise";

export function AddExerciseForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | null>(null);
    const { mutate: createExercise, isPending, error: mutationError } = useCreateExercise();

    const canSubmit = name.trim().length > 0 && muscleGroup !== null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;

        createExercise(
            {
                name: name.trim(),
                description: description.trim() || null,
                muscle_group: muscleGroup,
            },
            {
                onSuccess: () => {
                    router.push("/exercises");
                    router.refresh();
                },
            }
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            {/* Exercise Name */}
            <div className="space-y-1.5">
                <label
                    className="text-sm font-medium text-foreground"
                    htmlFor="exercise-name"
                >
                    Exercise Name
                </label>
                <input
                    id="exercise-name"
                    type="text"
                    placeholder="e.g. Barbell Bench Press"
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
                    htmlFor="exercise-desc"
                >
                    Description{" "}
                    <span className="text-muted-foreground font-normal">
                        (optional)
                    </span>
                </label>
                <textarea
                    id="exercise-desc"
                    rows={3}
                    placeholder="Compound chest exercise targeting pectorals…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl
                 px-4 py-3 text-foreground placeholder:text-muted-foreground/50
                 focus:outline-none focus:ring-2 focus:ring-ring
                 focus:border-accent transition-all duration-200
                 font-body text-base resize-none"
                />
            </div>

            {/* Muscle Group */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                    Muscle Group
                </label>
                <MuscleGroupSelector
                    value={muscleGroup}
                    onChange={setMuscleGroup}
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
                {isPending ? "Saving…" : "Save Exercise"}
            </Button>
        </form>
    );
}
