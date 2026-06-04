"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface BottomDrawerContextValue {
    register: (id: string) => void;
    unregister: (id: string) => void;
    getZIndex: (id: string) => number;
}

const BottomDrawerContext = createContext<BottomDrawerContextValue | null>(null);

export function BottomDrawerProvider({ children }: { children: ReactNode }) {
    const [stack, setStack] = useState<string[]>([]);

    const register = useCallback((id: string) => {
        setStack((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }, []);

    const unregister = useCallback((id: string) => {
        setStack((prev) => prev.filter((d) => d !== id));
    }, []);

    const getZIndex = useCallback(
        (id: string) => {
            const index = stack.indexOf(id);
            // Keep drawers above the mobile bottom nav (z-50) while preserving stacking order.
            return 60 + (index === -1 ? 0 : index);
        },
        [stack]
    );

    // Body scroll lock when any drawer is open
    useEffect(() => {
        if (stack.length > 0) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [stack.length]);

    return (
        <BottomDrawerContext.Provider value={{ register, unregister, getZIndex }}>
            {children}
        </BottomDrawerContext.Provider>
    );
}

export function useBottomDrawer(): BottomDrawerContextValue {
    const ctx = useContext(BottomDrawerContext);
    if (!ctx) {
        throw new Error("useBottomDrawer must be used inside <BottomDrawerProvider>");
    }
    return ctx;
}
