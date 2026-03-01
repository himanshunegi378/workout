import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactElement } from "react";

/**
 * Creates a fresh QueryClient for each test to ensure isolation.
 */
function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false, // Don't retry failed queries in tests
                gcTime: Infinity, // Keep data in cache for the duration of the test
            },
        },
    });
}

/**
 * Wraps the component under test with the necessary providers.
 * Add more providers here as the test suite grows (e.g. ThemeProvider, SessionProvider).
 */
function AllProviders({ children }: { children: React.ReactNode }) {
    const queryClient = createTestQueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

/**
 * Custom render function that wraps components with app-level providers.
 *
 * Usage:
 *   import { renderWithProviders, screen } from "@/tests/ui/test-utils/render";
 *   renderWithProviders(<MyComponent />);
 *   expect(screen.getByText("Hello")).toBeInTheDocument();
 */
export function renderWithProviders(
    ui: ReactElement,
    options?: Omit<RenderOptions, "wrapper">
) {
    return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from @testing-library/react for convenience
export { screen, within, waitFor } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
