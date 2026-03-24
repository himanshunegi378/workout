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

export function PageHeaderHostProvider({ children }: { children: React.ReactNode }) {
    const [hasHost, setHasHost] = useState(false);

    return (
        <PageHeaderHostContext.Provider value={{ hasHost, setHasHost }}>
            {children}
        </PageHeaderHostContext.Provider>
    );
}

export function PageHeaderActionsProvider({ children }: { children: React.ReactNode }) {
    const [actions, setActions] = useState<PageHeaderActionEntry[]>([]);
    const nextIdRef = useRef(0);

    const addAction = useCallback((node: React.ReactNode) => {
        const id = `page-header-action-${nextIdRef.current++}`;
        setActions((prev) => [...prev, { id, node }]);
        return id;
    }, []);

    const removeAction = useCallback((id: string) => {
        setActions((prev) => prev.filter((action) => action.id !== id));
    }, []);

    return (
        <PageHeaderActionsContext.Provider value={{ actions, addAction, removeAction }}>
            {children}
        </PageHeaderActionsContext.Provider>
    );
}

export function usePageHeaderActions() {
    return useContext(PageHeaderActionsContext);
}

export function usePageHeaderHost() {
    return useContext(PageHeaderHostContext);
}

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
