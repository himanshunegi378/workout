import { Platform } from 'react-native';
import { QueryClient } from '@tanstack/react-query';
import { Persister } from '@tanstack/react-query-persist-client';
import { createMMKV } from 'react-native-mmkv';

/**
 * Core TanStack QueryClient with optimized caching behaviors.
 * gcTime is set to 7 days, staleTime is 5 minutes, and queries/mutations default
 * to 'online' mode so they automatically pause/queue during network dropouts.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 7, // Keep cached queries for 7 days
      staleTime: 1000 * 60 * 5, // Cache is fresh for 5 minutes
      networkMode: 'online', // Require connection to fetch, reads from cache when offline
    },
    mutations: {
      networkMode: 'online', // Pause and queue mutations when offline
    },
  },
});

const CACHE_KEY = 'workout_react_query_cache';

// Unified KV store adapter supporting MMKV on native and localStorage on Web
let storage: {
  set: (key: string, value: string) => void;
  getString: (key: string) => string | undefined;
  delete: (key: string) => void;
};

if (Platform.OS === 'web') {
  storage = {
    set: (key, val) => {
      try {
        localStorage.setItem(key, val);
      } catch (e) {
        console.warn('localStorage set failed:', e);
      }
    },
    getString: (key) => {
      try {
        return localStorage.getItem(key) ?? undefined;
      } catch {
        return undefined;
      }
    },
    delete: (key) => {
      try {
        localStorage.removeItem(key);
      } catch {}
    },
  };
} else {
  const mmkv = createMMKV({ id: 'query-cache' });
  storage = {
    set: (key, val) => mmkv.set(key, val),
    getString: (key) => mmkv.getString(key),
    delete: (key) => mmkv.remove(key),
  };
}

/**
 * Custom client persister to write and restore TanStack Query cache.
 */
export const clientPersister: Persister = {
  persistClient: (persistClient) => {
    storage.set(CACHE_KEY, JSON.stringify(persistClient));
  },
  restoreClient: () => {
    const cached = storage.getString(CACHE_KEY);
    if (!cached) return undefined;
    try {
      return JSON.parse(cached);
    } catch {
      return undefined;
    }
  },
  removeClient: () => {
    storage.delete(CACHE_KEY);
  },
};
