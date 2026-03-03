import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, StaleWhileRevalidate } from "serwist";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (string | PrecacheEntry)[] | undefined;
    }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        {
            // Cache exercise and programme definitions aggressively
            matcher: ({ url }) => url.pathname.startsWith("/api/exercises") || url.pathname.startsWith("/api/programmes"),
            handler: new StaleWhileRevalidate({
                cacheName: "workout-api-data",
            }),
        },
        ...defaultCache,
    ],
});

serwist.addEventListeners();
