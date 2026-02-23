"use client";

import { useEffect, useRef } from "react";
import { X, History } from "lucide-react";
import { Button, Portal } from "@/app/components/ui";

interface LogSetDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseName: string;
    setIndex: number;
    weight: string;
    setWeight: (w: string) => void;
    reps: string;
    setReps: (r: string) => void;
    onSave: () => void;
    onDelete?: () => void;
    isSaving: boolean;
    isDeleting?: boolean;
    isEdit?: boolean;
    previousLog?: { weight: number | null; reps: number } | null;
}

export function LogSetDrawer({
    isOpen,
    onClose,
    exerciseName,
    setIndex,
    weight,
    setWeight,
    reps,
    setReps,
    onSave,
    onDelete,
    isSaving,
    isDeleting,
    isEdit,
    previousLog,
}: LogSetDrawerProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const fillPrevious = () => {
        if (previousLog) {
            if (previousLog.weight !== null) setWeight(previousLog.weight.toString());
            setReps(previousLog.reps.toString());
        }
    };

    return (
        <Portal>
            <div className="fixed inset-0 z-50 flex flex-col justify-end">
                {/* Backdrop */}
                <div
                    ref={overlayRef}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
                    onClick={(e) => {
                        if (e.target === overlayRef.current) onClose();
                    }}
                />

                {/* Drawer */}
                <div className="relative w-full bg-card border-t border-border rounded-t-3xl p-6 pb-10 sm:pb-safe animate-slide-up shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-display font-semibold text-xl text-foreground">
                                Log Set {setIndex + 1}
                            </h2>
                            <p className="text-sm text-muted-foreground">{exerciseName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {previousLog && (
                        <button
                            onClick={fillPrevious}
                            className="w-full mb-6 flex items-center justify-between p-3 rounded-xl bg-accent/10 border border-accent/20 text-sm text-accent transition-colors active:bg-accent/20"
                        >
                            <div className="flex items-center gap-2">
                                <History className="w-4 h-4" />
                                <span>Previous:</span>
                            </div>
                            <span className="font-semibold">
                                {previousLog.weight ? `${previousLog.weight}kg × ` : ""}
                                {previousLog.reps} reps
                            </span>
                        </button>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {/* Weight Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                inputMode="decimal"
                                min="0"
                                step="0.5"
                                placeholder="0"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full bg-muted border border-border rounded-2xl px-4 py-4
                                         text-2xl font-display font-semibold text-center text-foreground
                                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent
                                         transition-all duration-200"
                            />
                        </div>

                        {/* Reps Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Reps
                            </label>
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                step="1"
                                placeholder="0"
                                value={reps}
                                onChange={(e) => setReps(e.target.value)}
                                className="w-full bg-muted border border-border rounded-2xl px-4 py-4
                                         text-2xl font-display font-semibold text-center text-foreground
                                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent
                                         transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            variant="primary"
                            className="w-full py-4 text-base"
                            onClick={onSave}
                            disabled={isSaving || isDeleting || !reps}
                        >
                            {isSaving ? "Saving..." : isEdit ? "Update Set" : "Save Set"}
                        </Button>

                        {isEdit && onDelete && (
                            <button
                                onClick={onDelete}
                                disabled={isSaving || isDeleting}
                                className="w-full py-3 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-all disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete Set"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Portal>
    );
}
