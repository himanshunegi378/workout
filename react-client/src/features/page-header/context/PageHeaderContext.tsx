"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

interface PageHeaderActionEntry {
    id: string;
    node: React.ReactNode;
}

interface PageHeaderActionsContextValue {
    actions: PageHeaderActionEntry[];
    addAction: (node: React.ReactNode) => string;
    removeAction: (id: string) => void;
}

interface PageHeaderStatusContextValue {
    /** Whether a page header is currently mounted in the viewport. */
    isAvailable: boolean;
    /** Registers a header instance as mounted. */
    registerHeader: () => void;
    /** Unregisters a header instance. */
    unregisterHeader: () => void;
}

const PageHeaderActionsContext = createContext<PageHeaderActionsContextValue | null>(null);
const PageHeaderStatusContext = createContext<PageHeaderStatusContextValue | null>(null);

/**
 * Tracks the presence of page headers to manage layout and fallback components.
 */
export function PageHeaderStatusProvider({ children }: { children: React.ReactNode }) {
    const [mountedCount, setMountedCount] = useState(0);

    const registerHeader = useCallback(() => {
        setMountedCount((prev) => prev + 1);
    }, []);

    const unregisterHeader = useCallback(() => {
        setMountedCount((prev) => Math.max(0, prev - 1));
    }, []);

    const value = {
        isAvailable: mountedCount > 0,
        registerHeader,
        unregisterHeader,
    };

    return (
        <PageHeaderStatusContext.Provider value={value}>
            {children}
        </PageHeaderStatusContext.Provider>
    );
}

/**
 * Stores action nodes so feature code can inject controls into the shared page header.
 */
export function PageHeaderActionsProvider({ children }: { children: React.ReactNode }) {
    const [actions, setActions] = useState<PageHeaderActionEntry[]>([]);
    const nextIdRef = useRef(0);

    /**
     * Registers a header action and returns its stable removal id.
     */
    const addAction = useCallback((node: React.ReactNode) => {
        const id = `page-header-action-${nextIdRef.current++}`;
        setActions((prev) => [...prev, { id, node }]);
        return id;
    }, []);

    /**
     * Removes a previously registered header action by id.
     */
    const removeAction = useCallback((id: string) => {
        setActions((prev) => prev.filter((action) => action.id !== id));
    }, []);

    return (
        <PageHeaderActionsContext.Provider value={{ actions, addAction, removeAction }}>
            {children}
        </PageHeaderActionsContext.Provider>
    );
}

/**
 * Returns the action registry used to add or remove page header controls.
 */
export function usePageHeaderActions() {
    return useContext(PageHeaderActionsContext);
}

/**
 * Returns the presence status of the page header.
 */
export function usePageHeaderStatus() {
    return useContext(PageHeaderStatusContext);
}
