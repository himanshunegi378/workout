import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageShell } from "@/app/components/ui/PageShell";
import { PageHeader, usePageHeaderActions } from "@/app/features/page-header";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));

function ActionRegistrar() {
    const headerActions = usePageHeaderActions();

    if (!headerActions) {
        return null;
    }

    return (
        <button type="button" onClick={() => headerActions.addAction(<button type="button">Injected Timer</button>)}>
            Register Action
        </button>
    );
}

describe("PageHeaderActions", () => {
    it("renders injected actions alongside the direct header action", async () => {
        const user = userEvent.setup();

        render(
            <PageShell
                header={<PageHeader title="Workout" action={<button type="button">Add Exercise</button>} />}
            >
                <ActionRegistrar />
            </PageShell>
        );

        await user.click(screen.getByRole("button", { name: /register action/i }));

        expect(screen.getByRole("button", { name: /add exercise/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /injected timer/i })).toBeInTheDocument();
    });
});
