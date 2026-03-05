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

            {/* Drawer container — bottom-aligned on mobile, centered on desktop */}
            <div
                className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-4 transition-all duration-300 pointer-events-none"
                style={{ zIndex: zIndex + 1 }}
            >
                <div
                    className="w-full max-w-lg md:max-w-md bg-card border border-border rounded-t-[32px] md:rounded-[32px] px-6 pb-20 md:pb-8 pt-4 elevation-8 flex flex-col animate-slide-up pointer-events-auto"
                    style={{ 
                        height: height !== "auto" ? height : "auto",
                        maxHeight: "calc(100dvh - 2rem)"
                    }}
                >
                    {/* Drag Handle (hide on desktop) */}
                    <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-4 shrink-0 md:hidden" />

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
