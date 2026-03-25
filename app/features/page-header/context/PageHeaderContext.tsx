"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface PageHeaderActionEntry {
    id: string;
    node: React.ReactNode;
}

interface PageHeaderActionsContextValue {
    actions: PageHeaderActionEntry[];
    addAction: (node: React.ReactNode) => string;
    removeAction: (id: string) => void;
}

const PageHeaderActionsContext = createContext<PageHeaderActionsContextValue | null>(null);
const PageHeaderHostContext = createContext<{
    hasHost: boolean;
    setHasHost: (value: boolean) => void;
} | null>(null);

/**
 * Tracks whether a page header host is mounted in the current layout tree.
 */
export function PageHeaderHostProvider({ children }: { children: React.ReactNode }) {
    const [hasHost, setHasHost] = useState(false);

    return (
        <PageHeaderHostContext.Provider value={{ hasHost, setHasHost }}>
            {children}
        </PageHeaderHostContext.Provider>
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
 * Returns the host registration state for the shared page header mount point.
 */
export function usePageHeaderHost() {
    return useContext(PageHeaderHostContext);
}

/**
 * Marks the current subtree as owning a mounted page header host while it is rendered.
 * basically to detect whether PageHeader is used or not
 */
export function PageHeaderHostMount() {
    const host = usePageHeaderHost();

    useEffect(() => {
        if (!host) return;

        host.setHasHost(true);
        return () => {
            host.setHasHost(false);
        };
    }, [host]);

    return null;
}
