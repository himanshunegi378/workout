import { describe, expect, it } from "vitest";
import { buildHistoricalMuscleMetricData, calculateMovingAverage, parseAnalyticsDate } from "./muscle-trends";

describe("muscle trend utilities", () => {
    it("keeps empty weeks while bucketing analytics rows into calendar weeks", () => {
        const result = buildHistoricalMuscleMetricData(
            [
                {
                    session_date: "2026-04-12T10:00:00.000Z",
                    total_volume: 1000,
                    total_weight: 100,
                    loaded_sets: 2,
                },
                {
                    session_date: "2026-04-26 18:30:00",
                    total_volume: 3000,
                    total_weight: 150,
                    loaded_sets: 3,
                },
            ],
            { weeks: 4, now: new Date(2026, 4, 1) }
        );

        expect(result.map((week) => week.weekStart)).toEqual([
            "2026-04-05",
            "2026-04-12",
            "2026-04-19",
            "2026-04-26",
        ]);
        expect(result.map((week) => week.volume)).toEqual([0, 1000, 0, 3000]);
    });

    it("calculates set-weighted average load and a three-week moving average", () => {
        const result = buildHistoricalMuscleMetricData(
            [
                {
                    session_date: "2026-04-12",
                    total_volume: 1000,
                    total_weight: 100,
                    loaded_sets: 2,
                },
                {
                    session_date: "2026-04-19",
                    total_volume: 2400,
                    total_weight: 180,
                    loaded_sets: 3,
                },
                {
                    session_date: "2026-04-26",
                    total_volume: 3600,
                    total_weight: 280,
                    loaded_sets: 4,
                },
            ],
            { weeks: 3, now: new Date(2026, 4, 1) }
        );

        expect(result.map((week) => week.avgLoad)).toEqual([50, 60, 70]);
        expect(result.map((week) => week.avgLoadTrend)).toEqual([50, 55, 60]);
        expect(result.map((week) => week.volumeTrend)).toEqual([1000, 1700, 2333.33]);
    });

    it("skips null values in moving averages for no-load weeks", () => {
        expect(calculateMovingAverage([null, 50, null, 70], 3)).toEqual([null, 50, 50, 60]);
    });

    it("parses date-only and timestamp strings without time zone drift", () => {
        expect(parseAnalyticsDate("2026-04-26T23:00:00.000Z")?.toDateString()).toBe(
            new Date(2026, 3, 26).toDateString()
        );
        expect(parseAnalyticsDate("not-a-date")).toBeNull();
    });
});
