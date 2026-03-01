"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState, useMemo } from "react";


export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // gcTime specifies how long unused data remains in the cache.
                        gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week
                    },
                },
            })
    );

    const persister = useMemo(() => {
        // Only run on the client side in Next.js.
        if (typeof window !== "undefined") {
            try {
                return createAsyncStoragePersister({
                    storage: window.localStorage,
                    key: "WORKOUT_QUERY_CACHE_V1", // Descriptive versioned key
                });
            } catch (err) {
                console.error("Query Persister error:", err);
                return null;
            }
        }
        return null;
    }, []);

    // SSR or fallback when persistence is unavailable.
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
        >
            {children}
        </PersistQueryClientProvider>
    );
}
