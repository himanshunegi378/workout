import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { Dumbbell } from "lucide-react";

describe("EmptyState", () => {
    it("renders title and description", () => {
        render(
            <EmptyState
                icon={Dumbbell}
                title="No Exercises Found"
                description="Add your first exercise to get started"
            />
        );

        expect(screen.getByText("No Exercises Found")).toBeInTheDocument();
        expect(
            screen.getByText("Add your first exercise to get started")
        ).toBeInTheDocument();
    });

    it("renders the action element when provided", () => {
        render(
            <EmptyState
                icon={Dumbbell}
                title="Empty"
                description="Nothing here"
                action={<button>Add Item</button>}
            />
        );

        expect(
            screen.getByRole("button", { name: /add item/i })
        ).toBeInTheDocument();
    });

    it("renders without action when not provided", () => {
        render(
            <EmptyState
                icon={Dumbbell}
                title="Empty"
                description="Nothing here"
            />
        );

        expect(screen.getByText("Empty")).toBeInTheDocument();
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
});
