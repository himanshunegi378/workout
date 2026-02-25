"use client";

import { useId, useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import { Portal } from "./Portal";
import { useBottomDrawer } from "./BottomDrawerContext";

interface BottomDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    /** Height of the drawer panel. Defaults to "auto". Use "85vh" for tall/scrollable drawers. */
    height?: string;
    children: ReactNode;
}

export function BottomDrawer({ isOpen, onClose, title, height = "auto", children }: BottomDrawerProps) {
    const id = useId();
    const { register, unregister, getZIndex } = useBottomDrawer();

    useEffect(() => {
        if (isOpen) {
            register(id);
        } else {
            unregister(id);
        }
        return () => unregister(id);
    }, [isOpen, id, register, unregister]);

    if (!isOpen) return null;

    const zIndex = getZIndex(id);

    return (
        <Portal>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300"
                style={{ zIndex }}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className="fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-out"
                style={{ zIndex: zIndex + 1 }}
            >
                <div
                    className="bg-card border-t border-border rounded-t-[32px] px-6 pb-20 pt-4 max-w-lg mx-auto elevation-6 flex flex-col animate-slide-up"
                    style={{ height: height !== "auto" ? height : undefined }}
                >
                    {/* Drag Handle */}
                    <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-4 shrink-0" />

                    {/* Header (only if title provided) */}
                    {title && (
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {children}
                </div>
            </div>
        </Portal>
    );
}
