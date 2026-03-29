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
    const [isActive, setIsActive] = useState(false);
    const { mutate: createProgramme, isPending, error: mutationError } = useCreateProgramme();

    const canSubmit = name.trim().length > 0;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;

        createProgramme(
            {
                name: name.trim(),
                description: description.trim() || null,
                is_active: isActive,
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

            <div className="space-y-2 pb-4">
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
                    className="w-full rounded-2xl bg-background/45 px-4 py-3 text-foreground placeholder:text-muted-foreground/90 focus:outline-none focus:ring-2 focus:ring-ring/40 font-body text-base"
                />
            </div>

            <div className="space-y-2 pb-4">
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
                    className="w-full resize-none rounded-2xl bg-background/45 px-4 py-3 text-foreground placeholder:text-muted-foreground/90 focus:outline-none focus:ring-2 focus:ring-ring/40 font-body text-base"
                />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl bg-background/45 p-4 ring-1 ring-inset ring-foreground/5">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-foreground" htmlFor="active-toggle">
                        Mark as Active
                    </label>
                    <p className="text-xs text-muted-foreground">
                        Automatically deactivates any other active programs.
                    </p>
                </div>
                <button
                    type="button"
                    id="active-toggle"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 bg-background/50 ${isActive ? "bg-accent" : "bg-muted-foreground/20"}`}
                    role="switch"
                    aria-checked={isActive}
                >
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"}`}
                    />
                </button>
            </div>

            {mutationError && (
                <div className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger animate-slide-up">
                    {mutationError instanceof Error ? mutationError.message : "Something went wrong"}
                </div>
            )}

            <div className="pt-2">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!canSubmit || isPending}
                    className="w-full sm:w-auto text-background!"
                >
                    {isPending ? "Saving…" : "Save Program"}
                </Button>
            </div>
        </form>
    );
}
