"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { BottomDrawer } from "@/app/components/ui";
import { Portal } from "@/app/components/ui/Portal";
import { useLogSet } from "../../api/mutation-hooks/use-log-set";

interface StandaloneLogDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseId: string;
    exerciseName: string;
}

export function StandaloneLogDrawer({ isOpen, onClose, exerciseId, exerciseName }: StandaloneLogDrawerProps) {
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");

    const { mutate: logSet, isPending } = useLogSet();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!reps) return;

        logSet({
            exerciseId,
            setOrderIndex: 1, // Standalone logs are their own entity, so index 1 is fine
            weight: weight || "0",
            reps: reps,
        }, {
            onSuccess: () => {
                setWeight("");
                setReps("");
                onClose();
            }
        });
    };

    return (
        <Portal>
            <BottomDrawer isOpen={isOpen} onClose={onClose}>
                <div className="flex flex-col">
                    <div className="px-5 py-4 border-b border-border bg-background/95 backdrop-blur-sm relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 blur-3xl rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="font-display text-xl font-bold text-foreground">Log Set</h2>
                            <p className="text-sm text-muted-foreground font-medium mt-0.5">{exerciseName}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 space-y-6">
                        <div className="space-y-4 text-left">
                            <div>
                                <label className="block text-sm font-semibold text-muted-foreground mb-2 px-1">Weight (kg) <span className="text-muted-foreground/50 font-normal">— Optional</span></label>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    step="0.5"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="e.g. 60"
                                    className="w-full bg-muted border border-border rounded-xl px-4 py-3.5
                                        text-foreground font-display text-lg font-semibold transition-all duration-200
                                        placeholder:text-muted-foreground/30 placeholder:font-normal
                                        focus:outline-none focus:ring-2 focus:ring-accent focus:bg-background"
                                    disabled={isPending}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-muted-foreground mb-2 px-1">Reps</label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    required
                                    value={reps}
                                    onChange={(e) => setReps(e.target.value)}
                                    placeholder="e.g. 10"
                                    className="w-full bg-muted border border-border rounded-xl px-4 py-3.5
                                        text-foreground font-display text-lg font-semibold transition-all duration-200
                                        placeholder:text-muted-foreground/30 placeholder:font-normal
                                        focus:outline-none focus:ring-2 focus:ring-accent focus:bg-background"
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!reps || isPending}
                            className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-display font-bold
                                py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-lg tracking-wide
                                transition-all duration-300 disabled:opacity-50 active:scale-[0.98] elevation-1"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Set"
                            )}
                        </button>
                    </form>
                </div>
            </BottomDrawer>
        </Portal>
    );
}
