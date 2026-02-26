---
name: workout-data
description: React Query data fetching patterns for the workout/fitness app. Use when creating query hooks, mutation hooks, query keys, or debugging cache/state issues. Covers the feature-folder API layer structure, typed fetch hooks, query key factory pattern, cache invalidation strategy, and lazy data fetching.
---

# Workout Data Fetching

Data fetching and state management for the workout app using **TanStack React Query** with API routes.

## Feature-Folder API Structure

Each domain (`programs`, `workouts`, `exercises`, `logging`) owns its API layer:

```
app/features/<domain>/api/
├── query-keys.ts        ← Centralized cache key factory
├── query-hooks/         ← useQuery wrapper hooks
│   ├── use-items.ts
│   └── use-item-detail.ts
└── mutation-hooks/      ← useMutation wrapper hooks
    ├── use-create-item.ts
    └── use-delete-item.ts
```

## Query Key Factory Pattern

Every domain defines a key factory object:

```ts
export const workoutKeys = {
    all: ["workouts"] as const,
    lists: () => [...workoutKeys.all, "list"] as const,
    list: (groupId: string) => [...workoutKeys.lists(), { groupId }] as const,
    details: () => [...workoutKeys.all, "detail"] as const,
    detail: (id: string) => [...workoutKeys.details(), id] as const,
};
```

This enables targeted invalidation (`detail(id)`) or broad invalidation (`all`).

## Query Hook Pattern (CRITICAL: Explicit Return Types)

Every `queryFn` **MUST** have an explicit return type. Without it, the hook returns `any` and downstream components get implicit `any` errors.

```ts
import { useQuery } from "@tanstack/react-query";
import { workoutKeys } from "../query-keys";

type WorkoutGroupSummary = {
    id: string;
    name: string;
    description: string | null;
    workouts: { id: string }[];
};

export function useWorkoutGroups() {
    return useQuery({
        queryKey: workoutKeys.lists(),
        queryFn: async (): Promise<WorkoutGroupSummary[]> => {
            const res = await fetch("/api/groups");
            if (!res.ok) throw new Error("Failed to fetch workout groups");
            return res.json() as Promise<WorkoutGroupSummary[]>;
        },
    });
}
```

## Shared Types (CRITICAL)

To prevent circular dependencies (`Component -> Hook -> Component`), **always extract shared interfaces** to a feature-level `types.ts` file:

```
app/features/<domain>/
├── types.ts             ← Exports all shared interfaces
├── api/
│   └── query-hooks/
│       └── use-items.ts  ← Imports interfaces from ../types
└── components/
    └── Component.tsx    ← Imports interfaces from ../types
```

## Query Parameters in Hooks

When passing parameters to the API, use the `URL` object and update the `queryKey` if the parameter affects the result:

```ts
export function useSessions({ grouped = true }: { grouped?: boolean } = {}) {
    return useQuery<GroupedSession[]>({
        queryKey: [...logKeys.sessions(), { grouped }], // Include param in key
        queryFn: async (): Promise<GroupedSession[]> => {
            const url = new URL("/api/log/sessions", window.location.origin);
            if (grouped) url.searchParams.set("grouped", "true");
            
            const res = await fetch(url.toString());
            if (!res.ok) throw new Error("Failed to fetch sessions");
            return res.json() as Promise<GroupedSession[]>;
        },
    });
}
```

See **[references/hook-template.md](references/hook-template.md)** for full query + mutation templates.

## Fetch Pattern Inside Hooks

```ts
queryFn: async (): Promise<T> => {
    const res = await fetch(`/api/<resource>`);
    if (!res.ok) throw new Error("Failed to fetch <resource>");
    return res.json() as Promise<T>;
},
```

Always: check `res.ok`, throw on failure, cast with `as Promise<T>`.

## Lazy / Conditional Fetching

Use `enabled` to defer queries until a condition is met:

```ts
// Only fetch when drawer is open and exerciseId is known
useQuery({
    queryKey: logKeys.history(exerciseId),
    queryFn: ...,
    enabled: !!exerciseId,
});
```

## Cache Invalidation Strategy

### Mutation hooks invalidate related queries:

```ts
const { mutate } = useMutation({
    mutationFn: (id: string) => fetch(`/api/log/set/${id}`, { method: "DELETE" }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: logKeys.all });
    },
});
```

### Broad vs Narrow invalidation:

| Scenario | Strategy |
|---|---|
| Mutation affects one list | Invalidate specific key: `workoutKeys.detail(id)` |
| Mutation affects multiple UI areas (session list + history) | Invalidate base key: `logKeys.all` |

## React Query Provider

`QueryProvider` is a `"use client"` component wrapping children with `QueryClientProvider`. Located at `app/components/providers/QueryProvider.tsx`. Mounted once in `app/layout.tsx`.

## Don'ts

- **No `queryFn` without explicit return type** — causes implicit `any` cascading through UI components
- **No server actions for reads** — use API routes + `fetch()` in hooks
- **No inline query keys** — always use the domain's key factory
- **No forgetting `enabled`** — conditional queries must use `enabled: !!param` to avoid unnecessary fetches
