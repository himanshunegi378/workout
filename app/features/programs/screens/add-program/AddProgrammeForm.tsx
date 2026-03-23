"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui";
import { useCreateProgramme } from "../../api/mutation-hooks/use-create-programme";

/**
 * A form component for creating a new training programme.
 * 
 * Context:
 * "Programmes" represent the top-level structure of a user's training 
 * (e.g., "Powerlifting Block 1"). This form allows users to define the 
 * name and broad theme of their training phase.
 */
export function AddProgrammeForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { mutate: createProgramme, isPending, error: mutationError } = useCreateProgramme();

    const canSubmit = name.trim().length > 0;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;

        createProgramme(
            {
                name: name.trim(),
                description: description.trim() || null,
            },
            {
                onSuccess: () => {
                    router.push("/");
                    router.refresh();
                },
            }
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8 animate-slide-up">
            <div className="space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Program details</p>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                    Give the plan a clear name
                </h2>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                    Keep it simple and easy to scan. The description can stay brief or stay empty.
                </p>
            </div>

            <div className="space-y-2 border-b border-border/40 pb-4">
                <label
                    className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                    htmlFor="programme-name"
                >
                    Program Name
                </label>
                <input
                    id="programme-name"
                    type="text"
                    placeholder="e.g. Push Pull Legs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-0 border-b border-border/60 bg-transparent px-0 py-3 text-foreground placeholder:text-muted-foreground/90 focus:border-accent focus:outline-none focus:ring-0 font-body text-base"
                />
            </div>

            <div className="space-y-2 border-b border-border/40 pb-4">
                <label
                    className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                    htmlFor="programme-desc"
                >
                    Description{" "}
                    <span className="text-muted-foreground font-normal">
                        (optional)
                    </span>
                </label>
                <textarea
                    id="programme-desc"
                    rows={3}
                    placeholder="A 3-day split focused on..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full resize-none border-0 bg-transparent px-0 py-3 text-foreground placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 font-body text-base"
                />
            </div>

            {mutationError && (
                <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger animate-slide-up">
                    {mutationError instanceof Error ? mutationError.message : "Something went wrong"}
                </div>
            )}

            <div className="pt-2">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!canSubmit || isPending}
                    className="w-full sm:w-auto !text-background"
                >
                    {isPending ? "Saving…" : "Save Program"}
                </Button>
            </div>
        </form>
    );
}
