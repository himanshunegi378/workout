"use client";

import { useState, useTransition } from "react";
import { DatabaseZap } from "lucide-react";
import { del } from "idb-keyval";
import { useQueryClient } from "@tanstack/react-query";
import { WORKOUT_QUERY_CACHE_KEY } from "@/app/components/providers/QueryProvider";
import { Button } from "@/app/components/ui/Button";

export function ClearQueryCacheRow() {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleClearCache = () => {
        setStatus(null);

        startTransition(async () => {
            try {
                queryClient.clear();
                await del(WORKOUT_QUERY_CACHE_KEY);
                setStatus("Cached app data cleared.");
            } catch (error) {
                console.error("Failed to clear React Query cache", error);
                setStatus("Could not clear cached app data.");
            }
        });
    };

    return (
        <section className="flex flex-col gap-4 border-t border-border/60 py-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background/70 text-danger">
                    <DatabaseZap className="h-5 w-5" />
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                    <span className="font-medium text-foreground">Clear Cache</span>
                    <span className="text-sm text-foreground/85">
                        Remove persisted React Query data from this browser
                    </span>
                    {status ? (
                        <span className="text-sm text-foreground/80">{status}</span>
                    ) : null}
                </div>
            </div>

            <Button
                type="button"
                variant="danger"
                onClick={handleClearCache}
                disabled={isPending}
                className="w-full shrink-0 px-4 py-2 sm:w-auto"
            >
                {isPending ? "Clearing..." : "Clear"}
            </Button>
        </section>
    );
}
