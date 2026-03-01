---
name: workout-ui-testing
description: Write UI component tests for the workout/fitness app using Vitest (jsdom), MSW 2.x, and React Testing Library. Use when creating new test files for components, hooks, or screens; adding MSW mock handlers or resolver factories for a new API route; or debugging failing UI tests. Covers the co-located __tests__ file structure, resolver pattern, renderWithProviders utility, query best practices, and per-test server overrides.
---

# Workout UI Testing

Write UI component tests using **Vitest (jsdom)**, **MSW 2.x**, and **React Testing Library**.

## File Structure

### Global infra — lives in `tests/ui/` (never change these)

```
tests/ui/
├── setup.ts                     ← jest-dom matchers + MSW lifecycle hooks
├── test-utils/render.tsx        ← renderWithProviders + screen/waitFor re-exports
└── mocks/
    ├── server.ts                ← MSW setupServer — do not edit
    └── handlers.ts              ← Pure aggregator: spreads all feature handler arrays
```

### Feature tests — co-located with the feature they test

```
app/features/<domain>/
└── __tests__/
    ├── ComponentName.test.tsx   ← Component/interaction tests
    ├── HookOrScreen.test.tsx    ← Fetch/hook tests using MSW
    └── mocks/
        ├── <domain>.resolver.ts ← Fixture data + named response factories
        └── handlers.ts          ← Feature-local http.get/post/... handler definitions
```

### Global UI component tests — co-located with the component

```
app/components/ui/
└── __tests__/
    └── ComponentName.test.tsx
```

## Workflow: Writing a new test file

1. **Create the file** at `app/features/<domain>/__tests__/ComponentName.test.tsx`

2. **Import render utilities**
   ```tsx
   // For components with React Query hooks:
   import { renderWithProviders, screen, waitFor } from "@/tests/ui/test-utils/render";
   // For pure presentational components (no hooks):
   import { render, screen } from "@testing-library/react";
   import userEvent from "@testing-library/user-event";
   ```

3. **Query by role/text first** — `getByRole`, `getByLabelText`, `getByText`, `getByPlaceholderText`. Use `getByTestId` only as a last resort.

4. **Simulate interactions** with `userEvent.setup()`, never `fireEvent`:
   ```ts
   const user = userEvent.setup();
   await user.type(input, "bench");
   await user.click(button);
   ```

5. **Assert on what the user sees**, not on internal state.

## Workflow: Adding MSW coverage for a new API domain

1. **Create a resolver** at `app/features/<domain>/__tests__/mocks/<domain>.resolver.ts`.
   See **[references/resolver-pattern.md](references/resolver-pattern.md)** for the exact template.

2. **Create a feature handlers file** at `app/features/<domain>/__tests__/mocks/handlers.ts`:
   ```ts
   import { http } from "msw";
   import { programme } from "./programme.resolver";

   export const programmeHandlers = [
       http.get("/api/groups", programme.success()),
       http.post("/api/groups", programme.success()),
   ];
   ```

3. **Register in the global aggregator** `tests/ui/mocks/handlers.ts`:
   ```ts
   import { programmeHandlers } from "@/app/features/programs/__tests__/mocks/handlers";

   export const handlers = [
       ...exerciseHandlers,
       ...programmeHandlers, // ← add here
   ];
   ```

4. **Override per-test** inside any test file:
   ```ts
   import { server } from "@/tests/ui/mocks/server";
   import { exercise } from "./mocks/exercise.resolver"; // relative — same __tests__ folder

   server.use(http.get("/api/exercises", exercise.error()));
   ```
   Overrides reset automatically after each test (`server.resetHandlers()` in setup.ts).

## Mocking Next.js

```ts
vi.mock("next/link", () => ({
    default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
        <a href={href} {...props}>{children}</a>
    ),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
    usePathname: () => "/",
}));
```

## Running Tests

```bash
pnpm test:ui          # single run
pnpm test:ui:watch    # watch mode
```

## Don'ts

- **Never mock `fetch` directly** — use MSW only.
- **Never use `fireEvent`** — use `userEvent` for realistic interactions.
- **Never query by class names** — query by role, label, or text.
- **Never share `QueryClient` across tests** — `renderWithProviders` creates a fresh one each time.
- **Never put test files in `tests/ui/components/`** — tests live co-located with their feature.
- **Never define `http.get/post/...` in `tests/ui/mocks/handlers.ts`** — that file only spreads feature handler arrays.

## References

- **[references/resolver-pattern.md](references/resolver-pattern.md)** — Full template for creating a `<domain>.resolver.ts`. Read when adding MSW coverage for a new API domain.
