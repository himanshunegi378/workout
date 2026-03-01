# UI Testing Guide

## Quick Start

```bash
# Run all UI tests
pnpm test:ui

# Run in watch mode
pnpm test:ui:watch
```

## Architecture

```
tests/ui/
├── setup.ts                          # Global setup: jest-dom matchers + MSW lifecycle
├── mocks/
│   ├── handlers.ts                   # Default MSW request handlers
│   └── server.ts                     # MSW server instance
├── test-utils/
│   └── render.tsx                    # renderWithProviders + re-exports
└── components/
    ├── Button.test.tsx               # Component rendering example
    ├── EmptyState.test.tsx           # Prop-driven rendering example
    ├── ExerciseListClient.test.tsx   # User interaction example
    └── ExercisesFetch.test.tsx       # MSW API mocking example
```

## Writing a UI Test

### 1. Basic Component Test

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyComponent } from "@/app/components/MyComponent";

describe("MyComponent", () => {
    it("renders content", () => {
        render(<MyComponent title="Hello" />);
        expect(screen.getByText("Hello")).toBeInTheDocument();
    });
});
```

### 2. With User Interaction

```tsx
import userEvent from "@testing-library/user-event";

it("handles click", async () => {
    const user = userEvent.setup();
    render(<MyButton onClick={handleClick}>Click</MyButton>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 3. With React Query (Providers)

Use `renderWithProviders` for components that need `QueryClientProvider`:

```tsx
import { renderWithProviders, screen, waitFor } from "@/tests/ui/test-utils/render";

it("fetches data", async () => {
    renderWithProviders(<DataComponent />);
    await waitFor(() => {
        expect(screen.getByText("Data loaded")).toBeInTheDocument();
    });
});
```

## Adding MSW Mock Handlers

### Default Handlers

Add to `tests/ui/mocks/handlers.ts`:

```ts
import { http, HttpResponse } from "msw";

export const handlers = [
    http.get("/api/my-endpoint", () => {
        return HttpResponse.json({ data: "mock" });
    }),
];
```

### Per-Test Overrides

Override inside a test for error/edge-case scenarios:

```tsx
import { server } from "@/tests/ui/mocks/server";
import { http, HttpResponse } from "msw";

it("handles API error", async () => {
    server.use(
        http.get("/api/my-endpoint", () => {
            return new HttpResponse(null, { status: 500 });
        })
    );
    // ... test error UI
});
```

The override is automatically reset after the test via `server.resetHandlers()` in setup.

## Query Priority

Prefer accessibility queries (highest to lowest priority):

1. `getByRole` — buttons, links, headings, etc.
2. `getByLabelText` — form inputs
3. `getByText` — visible text content
4. `getByPlaceholderText` — input placeholders
5. `getByTestId` — last resort only

## Conventions

- **File naming**: `ComponentName.test.tsx`
- **Pattern**: Arrange → Act → Assert
- **No snapshots** unless justified
- **No `fetch`/`axios` mocks** — use MSW only
- **One concern per test** — keep tests focused
