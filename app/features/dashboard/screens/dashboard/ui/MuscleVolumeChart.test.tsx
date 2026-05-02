import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { renderWithProviders, screen, userEvent } from "@/tests/ui/test-utils/render";
import { MuscleVolumeChart } from "./MuscleVolumeChart";
import { useMuscleHistoricalMetrics } from "../../../api/query-hooks/use-muscle-historical-data";

vi.mock("../../../api/query-hooks/use-muscle-historical-data", () => ({
    useMuscleHistoricalMetrics: vi.fn(),
}));

vi.mock("recharts", () => ({
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    ComposedChart: ({ children }: { children: ReactNode }) => <svg>{children}</svg>,
    Area: ({ name }: { name: string }) => <text>Area: {name}</text>,
    Line: ({ name }: { name: string }) => <text>Line: {name}</text>,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    CartesianGrid: () => null,
}));

const mockedUseMuscleHistoricalMetrics = vi.mocked(useMuscleHistoricalMetrics);

describe("MuscleVolumeChart", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("defaults to volume and lets the lifter switch to average load", async () => {
        const user = userEvent.setup();
        mockedUseMuscleHistoricalMetrics.mockReturnValue({
            data: [
                {
                    weekStart: "2026-04-19",
                    label: "Apr 19",
                    volume: 1000,
                    avgLoad: 50,
                    volumeTrend: 1000,
                    avgLoadTrend: 50,
                },
            ],
            isLoading: false,
            error: null,
        } as ReturnType<typeof useMuscleHistoricalMetrics>);

        renderWithProviders(<MuscleVolumeChart muscleGroup="Chest" />);

        expect(screen.getByText("Volume trend (kg)")).toBeInTheDocument();
        expect(screen.getByText("Area: Volume")).toBeInTheDocument();
        expect(screen.getByText("Line: 3-week avg")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /avg load/i }));

        expect(screen.getByText("Avg load trend")).toBeInTheDocument();
        expect(screen.getByText("Strength proxy")).toBeInTheDocument();
        expect(screen.getByText("Area: Avg load")).toBeInTheDocument();
    });

    it("shows a friendly empty state when average load has no weighted sets", async () => {
        const user = userEvent.setup();
        mockedUseMuscleHistoricalMetrics.mockReturnValue({
            data: [
                {
                    weekStart: "2026-04-19",
                    label: "Apr 19",
                    volume: 0,
                    avgLoad: null,
                    volumeTrend: 0,
                    avgLoadTrend: null,
                },
            ],
            isLoading: false,
            error: null,
        } as ReturnType<typeof useMuscleHistoricalMetrics>);

        renderWithProviders(<MuscleVolumeChart muscleGroup="Abs" />);

        await user.click(screen.getByRole("button", { name: /avg load/i }));

        expect(screen.getByText("Load trend waiting")).toBeInTheDocument();
        expect(screen.getByText(/bodyweight work still counts/i)).toBeInTheDocument();
    });
});
