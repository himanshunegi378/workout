"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, BottomNav, Button } from "@/app/components/ui";

interface PageProps {
    params: Promise<{ groupId: string }>;
}

export default function AddWorkoutPage({ params }: PageProps) {
    const { groupId } = use(params);
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = name.trim().length > 0;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;

        setPending(true);
        setError(null);

        try {
            const res = await fetch(`/api/groups/${groupId}/workouts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim() || null,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to create workout");
            }

            router.push(`/groups/${groupId}`);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="min-h-screen pb-20">
            <PageHeader title="New Workout" backHref={`/groups/${groupId}`} />

            <main className="max-w-lg mx-auto px-4 py-6">
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
                    {error && (
                        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-danger text-sm animate-slide-up">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!canSubmit || pending}
                        className="w-full"
                    >
                        {pending ? "Saving…" : "Save Workout"}
                    </Button>
                </form>
            </main>

            <BottomNav />
        </div>
    );
}
