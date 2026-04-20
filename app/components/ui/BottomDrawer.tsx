"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
    const shouldReduceMotion = useReducedMotion();
    const { register, unregister, getZIndex } = useBottomDrawer();
    const [isMounted, setIsMounted] = useState(isOpen);
    const [isDesktop, setIsDesktop] = useState(false);

    if (isOpen && !isMounted) {
        setIsMounted(true);
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");
        const syncViewport = () => setIsDesktop(mediaQuery.matches);

        syncViewport();
        mediaQuery.addEventListener("change", syncViewport);

        return () => mediaQuery.removeEventListener("change", syncViewport);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        register(id);
        return () => unregister(id);
    }, [id, isMounted, register, unregister]);

    if (!isMounted) return null;

    const zIndex = getZIndex(id);
    const panelMaxHeight = "calc(100dvh - 2rem)";
    
    const backdropTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" as const };
    const panelTransition = shouldReduceMotion
        ? { duration: 0 }
        : { type: "spring" as const, damping: 30, stiffness: 320, mass: 0.9 };

    const panelMotion = shouldReduceMotion
        ? { opacity: 1, y: 0, scale: 1 }
        : isDesktop
            ? { opacity: 0, y: 24, scale: 0.98 }
            : { opacity: 1, y: "100%", scale: 1 };

    return (
        <Portal>
            <AnimatePresence onExitComplete={() => setIsMounted(false)}>
                {isOpen ? (
                    <>
                        {/* Backdrop closes the active drawer without affecting lower stacked layers. */}
                        <motion.div
                            key={`${id}-backdrop`}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                            style={{ zIndex }}
                            onClick={onClose}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={backdropTransition}
                        />

                        {/* Mobile uses a bottom sheet; desktop reuses the same content as a centered modal. */}
                        <div
                            className="fixed inset-0 flex items-end justify-center p-0 pointer-events-none md:items-center md:p-4"
                            style={{ zIndex: zIndex + 1 }}
                        >
                            <motion.div
                                key={`${id}-panel`}
                                className="flex w-full max-w-lg flex-col rounded-t-3xl bg-card/98 px-5 pb-20 pt-4 elevation-8 pointer-events-auto md:max-w-md md:rounded-3xl md:px-6 md:pb-8"
                                style={{
                                    height,
                                    maxHeight: panelMaxHeight
                                }}
                                initial={panelMotion}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={panelMotion}
                                transition={panelTransition}
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
                            </motion.div>
                        </div>
                    </>
                ) : null}
            </AnimatePresence>
        </Portal>
    );
}
