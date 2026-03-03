"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState, useMemo } from "react";
import { get, set, del } from "idb-keyval";

/**
 * Custom storage object that implements the interface required by createAsyncStoragePersister,
 * mapping onto the promise-based idb-keyval library.
 */
const idbStorage = {
    getItem: (key: string) => get(key),
    setItem: (key: string, value: string) => set(key, value),
    removeItem: (key: string) => del(key),
};

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week
                        staleTime: 1000 * 60 * 5, // 5 minutes
                        retry: (failureCount, error: Error & { status?: number }) => {
                            // Only retry if it's a network error or a 5xx server error
                            if ((error?.status ?? 0) >= 500 || !navigator.onLine) return true;
                            return failureCount < 3;
                        },
                    },
                    mutations: {
                        // Crucial for offline: Mutations will pause when offline and resume when online
                        networkMode: 'offlineFirst',
                    }
                },
            })
    );

    const persister = useMemo(() => {
        if (typeof window !== "undefined") {
            try {
                return createAsyncStoragePersister({
                    storage: idbStorage,
                    key: "WORKOUT_QUERY_CACHE_V2", // Bumped version for IndexedDB shift
                });
            } catch (err) {
                console.error("Query Persister (IndexedDB) error:", err);
                return null;
            }
        }
        return null;
    }, []);

    if (!persister) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    }

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister,
                maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            }}
            onSuccess={() => {
                // Resume any mutations that were paused during the last session
                queryClient.resumePausedMutations();
            }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}
