"use client";

import { BottomDrawer } from "./BottomDrawer";
import { Button } from "./Button";

interface ConfirmDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "primary" | "destructive";
}

export function ConfirmDrawer({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary"
}: ConfirmDrawerProps) {
    return (
        <BottomDrawer isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col gap-6">
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>
                <div className="flex flex-col gap-3 pt-2">
                    <Button
                        variant={variant === "destructive" ? "primary" : "primary"}
                        className={`w-full py-4 text-lg font-bold shadow-none ${variant === "destructive" ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : ""}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </Button>
                    <button
                        onClick={onClose}
                        className="w-full rounded-xl py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/10"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </BottomDrawer>
    );
}
