import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/app/components/ui/Button";

describe("Button", () => {
    it("renders with default (primary) variant", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("renders children text", () => {
        render(<Button>Save Workout</Button>);
        expect(screen.getByRole("button")).toHaveTextContent("Save Workout");
    });

    it("calls onClick handler when clicked", async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(<Button onClick={handleClick}>Submit</Button>);
        await user.click(screen.getByRole("button", { name: /submit/i }));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(<Button onClick={handleClick} disabled>Submit</Button>);
        await user.click(screen.getByRole("button", { name: /submit/i }));

        expect(handleClick).not.toHaveBeenCalled();
    });

    it("applies the disabled attribute", () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("renders with danger variant", () => {
        render(<Button variant="danger">Delete</Button>);
        expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    it("forwards additional HTML attributes", () => {
        render(<Button type="submit" data-testid="my-btn">Go</Button>);
        expect(screen.getByRole("button", { name: /go/i })).toHaveAttribute("type", "submit");
    });
});
