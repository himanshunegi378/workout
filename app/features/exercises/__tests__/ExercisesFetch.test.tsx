import { describe, it, expect } from "vitest";
import { http } from "msw";
import {
    renderWithProviders,
    screen,
    waitFor,
} from "@/tests/ui/test-utils/render";
import { server } from "@/tests/ui/mocks/server";
import { exercise } from "./mocks/exercise.resolver";
import { useExercises } from "@/app/features/exercises/api/query-hooks/use-exercises";

/**
 * A minimal test component that exercises the useExercises hook.
 * This lets us test the full data-fetching flow with MSW.
 */
function ExercisesFetchTest() {
    const { data, isLoading, isError, error } = useExercises();

    if (isLoading) return <p>Loading exercises…</p>;
    if (isError) return <p>Error: {(error as Error).message}</p>;

    return (
        <ul>
            {data?.map((ex: { id: string; name: string }) => (
                <li key={ex.id}>{ex.name}</li>
            ))}
        </ul>
    );
}

describe("ExercisesFetch (MSW integration)", () => {
    it("fetches and displays exercises from the API", async () => {
        renderWithProviders(<ExercisesFetchTest />);

        expect(screen.getByText("Loading exercises…")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Bench Press")).toBeInTheDocument();
        });

        expect(screen.getByText("Barbell Squat")).toBeInTheDocument();
        expect(screen.getByText("Pull Up")).toBeInTheDocument();
    });

    it("handles API error responses", async () => {
        server.use(http.get("/api/exercises", exercise.error()));

        renderWithProviders(<ExercisesFetchTest />);

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });

    it("handles empty exercise list", async () => {
        server.use(http.get("/api/exercises", exercise.empty()));

        renderWithProviders(<ExercisesFetchTest />);

        await waitFor(() => {
            expect(screen.queryByText("Loading exercises…")).not.toBeInTheDocument();
        });

        expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });

    it("fetches with custom fixture data", async () => {
        server.use(
            http.get("/api/exercises", exercise.success([
                {
                    id: "custom-1",
                    name: "Custom Exercise",
                    description: "A custom one",
                    muscle_group: "Abs",
                    user_id: "test-user",
                    created_at: "2026-01-01T00:00:00.000Z",
                },
            ]))
        );

        renderWithProviders(<ExercisesFetchTest />);

        await waitFor(() => {
            expect(screen.getByText("Custom Exercise")).toBeInTheDocument();
        });
    });
});
