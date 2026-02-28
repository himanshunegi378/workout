"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui";
import { useCreateProgramme } from "../api/mutation-hooks/use-create-programme";

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
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            {/* Program Name */}
            <div className="space-y-1.5">
                <label
                    className="text-sm font-medium text-foreground"
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
                {isPending ? "Saving…" : "Save Program"}
            </Button>
        </form>
    );
}
