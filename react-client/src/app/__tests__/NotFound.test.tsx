import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { NotFound } from "../NotFound";
import "@testing-library/jest-dom";

describe("NotFound Component", () => {
    it("renders empty state with correct title and action link", () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );

        // Check if title is present
        expect(screen.getByText("Not found")).toBeInTheDocument();

        // Check if description is present
        expect(
            screen.getByText("The page or workout record could not be found.")
        ).toBeInTheDocument();

        // Check if link to programs is rendered
        const link = screen.getByRole("link", { name: /go to programs/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/");
    });
});
