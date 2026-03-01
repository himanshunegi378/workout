import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExerciseListClient } from "@/app/features/exercises/components/ExerciseListClient";

// Mock next/link to render as a plain anchor
vi.mock("next/link", () => ({
    default: ({ children, href, ...props }: { children: React.ReactNode; href: string;[key: string]: unknown }) => (
        <a href={href} {...props}>{children}</a>
    ),
}));

const mockExercises = [
    { id: "1", name: "Bench Press", description: "Flat barbell bench press", muscle_group: "Chest" },
    { id: "2", name: "Barbell Squat", description: "Back squat with barbell", muscle_group: "Legs" },
    { id: "3", name: "Pull Up", description: "Bodyweight pull-up", muscle_group: "Back" },
    { id: "4", name: "Incline Dumbbell Press", description: "Incline press", muscle_group: "Chest" },
];

describe("ExerciseListClient", () => {
    it("renders all exercises", () => {
        render(<ExerciseListClient exercises={mockExercises} />);

        expect(screen.getByText("Bench Press")).toBeInTheDocument();
        expect(screen.getByText("Barbell Squat")).toBeInTheDocument();
        expect(screen.getByText("Pull Up")).toBeInTheDocument();
        expect(screen.getByText("Incline Dumbbell Press")).toBeInTheDocument();
    });

    it("displays correct exercise count", () => {
        render(<ExerciseListClient exercises={mockExercises} />);
        expect(screen.getByText("4 exercises")).toBeInTheDocument();
    });

    it("filters exercises by search query", async () => {
        const user = userEvent.setup();
        render(<ExerciseListClient exercises={mockExercises} />);

        const searchInput = screen.getByPlaceholderText(/search exercises/i);
        await user.type(searchInput, "bench");

        expect(screen.getByText("Bench Press")).toBeInTheDocument();
        expect(screen.queryByText("Barbell Squat")).not.toBeInTheDocument();
        expect(screen.queryByText("Pull Up")).not.toBeInTheDocument();
    });

    it("filters exercises by muscle group", async () => {
        const user = userEvent.setup();
        render(<ExerciseListClient exercises={mockExercises} />);

        await user.click(screen.getByRole("button", { name: "Chest" }));

        expect(screen.getByText("Bench Press")).toBeInTheDocument();
        expect(screen.getByText("Incline Dumbbell Press")).toBeInTheDocument();
        expect(screen.queryByText("Barbell Squat")).not.toBeInTheDocument();
        expect(screen.queryByText("Pull Up")).not.toBeInTheDocument();
    });

    it("combines search and muscle group filter", async () => {
        const user = userEvent.setup();
        render(<ExerciseListClient exercises={mockExercises} />);

        await user.click(screen.getByRole("button", { name: "Chest" }));
        await user.type(screen.getByPlaceholderText(/search exercises/i), "incline");

        expect(screen.getByText("Incline Dumbbell Press")).toBeInTheDocument();
        expect(screen.queryByText("Bench Press")).not.toBeInTheDocument();
    });

    it("shows empty state when no exercises match", async () => {
        const user = userEvent.setup();
        render(<ExerciseListClient exercises={mockExercises} />);

        await user.type(screen.getByPlaceholderText(/search exercises/i), "zzzzzzz");

        expect(screen.getByText("No Exercises Found")).toBeInTheDocument();
        expect(screen.getByText(/no results for "zzzzzzz"/i)).toBeInTheDocument();
    });

    it("shows empty state with Add Exercise link when list is empty", () => {
        render(<ExerciseListClient exercises={[]} />);

        expect(screen.getByText("No Exercises Found")).toBeInTheDocument();
        expect(
            screen.getByText("Add your first exercise to get started")
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /add exercise/i })).toHaveAttribute(
            "href",
            "/exercises/new"
        );
    });
});
