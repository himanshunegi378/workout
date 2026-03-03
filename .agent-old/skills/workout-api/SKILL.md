---
name: workout-api
description: Create and modify Next.js API routes for the workout/fitness app. Use when building GET/POST/PATCH/DELETE endpoints, handling authentication in routes, structuring request validation, or debugging API errors. Covers route file conventions, auth guard pattern, error handling, dynamic route params, and response status codes.
---

# Workout API Routes

Create REST API routes for the workout app using **Next.js App Router** route handlers.

## Route File Convention

```
app/api/
├── auth/              ← NextAuth routes
├── exercises/         ← GET (list), POST (create)
│   └── [exerciseId]/
│       └── logs/      ← GET (exercise history)
├── groups/            ← GET (list), POST (create)
│   └── [groupId]/     ← GET (single group)
│       └── workouts/
│           └── [workoutId]/
│               └── details/ ← GET (workout + active session)
└── log/
    ├── sessions/      ← GET (user sessions)
    └── set/           ← POST/PATCH/DELETE (log sets)
```

## Workflow: Creating a New API Route

1. **Pick the URL path** — follow RESTful convention: `/api/<resource>` for collections, `/api/<resource>/[resourceId]` for single items
2. **Create file** at `app/api/<path>/route.ts`
3. **Export named async function** matching the HTTP method: `GET`, `POST`, `PATCH`, `DELETE`
4. **Auth guard first** — call `getUserId()`, return 401 if null
5. **Parse & validate** request body (for POST/PATCH)
6. **Call Prisma** using `select` (never `include`)
7. **Return** `NextResponse.json(data, { status })` 
8. **Wrap in try/catch** — log error, return 500

See **[references/api-template.md](references/api-template.md)** for annotated templates.

## Auth Pattern

Always use `getUserId()` from `@/lib/auth-helpers` for API routes. It returns `string | null` (no redirect).

```ts
import { getUserId } from "@/lib/auth-helpers";

const userId = await getUserId();
if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

> **Don't** use `requireUserId()` in API routes — it calls `redirect()` which throws and breaks API response flow. `requireUserId()` is for Server Components/Actions only.

## Dynamic Route Parameters

In Next.js 15+, route params are **Promises**. Always `await` them:

```ts
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    const { groupId } = await params;
    // ...
}
```

## Query Parameters

Always use `URL` to parse search parameters from the request object:

```ts
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const grouped = searchParams.get("grouped") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "30");
    // ...
}
```

## Server-side Logic & Grouping

**Prefer server-side processing** for data transformations (like grouping by date) to minimize frontend complexity and bundle size.

1.  **Filter early**: Remove invalid or empty records in the API before sending.
2.  **Group by key**: Return a structured object/array (e.g., `GroupedSession[]`) that the UI can map over directly.
3.  **Consistency**: Use the same formatting logic (dates, currencies) on the server to ensure consistency across different views.

### Slug Naming Rule (CRITICAL)

**Standardize** dynamic segment names across all routes at the same path level. Never mix slug names (e.g., `[id]` vs `[exerciseId]` in `/api/exercises/`).

Current conventions:
- `[exerciseId]` for exercise routes
- `[groupId]` for group routes  
- `[workoutId]` for workout routes

## Response Status Codes

| Status | When |
|---|---|
| `200` | Successful GET / PATCH / DELETE |
| `201` | Successful POST (resource created) |
| `400` | Invalid request body / missing fields |
| `401` | Not authenticated |
| `404` | Resource not found |
| `500` | Unexpected server error |

## Error Handling

Always wrap in `try/catch`. Log context for debugging:

```ts
} catch (error) {
    console.error("Failed to fetch workout group:", error);
    return NextResponse.json(
        { error: "Failed to fetch workout group" },
        { status: 500 }
    );
}
```

## Don'ts

- **No direct Prisma in components** — always go through API routes or server actions
- **No `redirect()` in API routes** — use `NextResponse.json` with status 401
- **No `include` in Prisma queries** — use `select` to fetch only what the UI needs
- **No forgetting `user_id`** — every query returning user-owned data MUST filter by `user_id`
