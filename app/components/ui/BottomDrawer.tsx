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
    const panelHeight = height !== "auto" ? height : "auto";
    const panelMaxHeight = "calc(100dvh - 2rem)";

    return (
        <Portal>
            {/* Backdrop closes the active drawer without affecting lower stacked layers. */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300"
                style={{ zIndex }}
                onClick={onClose}
            />

            {/* Mobile uses a bottom sheet; desktop reuses the same content as a centered modal. */}
            <div
                className="fixed inset-0 flex items-end justify-center p-0 transition-all duration-300 pointer-events-none md:items-center md:p-4"
                style={{ zIndex: zIndex + 1 }}
            >
                <div
                    className="flex w-full max-w-lg flex-col rounded-t-3xl bg-card/98 px-5 pb-20 pt-4 elevation-8 pointer-events-auto md:max-w-md md:rounded-3xl md:px-6 md:pb-8"
                    style={{
                        height: panelHeight,
                        maxHeight: panelMaxHeight
                    }}
                >
                    {/* Visual affordance for the mobile sheet pattern. */}
                    <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/30 md:hidden" />

                    {title && (
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
                            <button
                                onClick={onClose}
                                className="-mr-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
