# Resolver Pattern — Template

Use this template when adding MSW coverage for a new API domain.

## File location

```
app/features/<domain>/__tests__/mocks/<domain>.resolver.ts
```

## Full Template

```ts
import { HttpResponse } from "msw";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface <Domain>Fixture {
    id: string;
    // add all fields the API returns
    created_at: string;
}

// ─── Fixture Data ─────────────────────────────────────────────────────────────

export const <domain>Fixtures: <Domain>Fixture[] = [
    {
        id: "<domain>-1",
        // ...
        created_at: "2026-01-01T00:00:00.000Z",
    },
];

// ─── Resolvers ────────────────────────────────────────────────────────────────

export const <domain> = {
    /** 200 — returns the default fixture list (or a custom one). */
    success: (data: <Domain>Fixture[] = <domain>Fixtures) =>
        () => HttpResponse.json(data),

    /** 200 — returns an empty array. */
    empty: () =>
        () => HttpResponse.json([]),

    /** 500 — simulates a server error. */
    error: (status = 500, message = "Internal Server Error") =>
        () => HttpResponse.json({ error: message }, { status }),

    /** 401 — simulates an unauthenticated request. */
    unauthorized: () =>
        () => HttpResponse.json({ error: "Unauthorized" }, { status: 401 }),
};
```

## Naming rules

| Placeholder | Example |
|---|---|
| `<domain>` | `programme` |
| `<Domain>` | `Programme` |
| file name | `programme.resolver.ts` |
| imported as | `import { programme } from "./resolvers/programme.resolver"` |

## Registering in handlers.ts

After creating the resolver, add a line to `handlers.ts`:

```ts
import { programme } from "./resolvers/programme.resolver";

export const handlers = [
    http.get("/api/exercises", exercise.success()),
    http.get("/api/groups", programme.success()),   // ← new line
];
```

## Per-test overrides

```ts
// error state
server.use(http.get("/api/groups", programme.error()));

// custom data for a specific test
server.use(http.get("/api/groups", programme.success([
    { id: "g-1", name: "Custom Programme", created_at: "2026-01-01T00:00:00.000Z" }
])));
```
