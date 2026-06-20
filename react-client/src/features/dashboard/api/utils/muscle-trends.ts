import { format, isSameWeek, startOfWeek, subWeeks } from "date-fns";
import type { HistoricalMuscleMetricData } from "../../types";

export interface MuscleMetricSourceRow {
    session_date: string | Date;
    total_volume: string | number | null;
    total_weight: string | number | null;
    loaded_sets: string | number | null;
}

interface BuildHistoricalMuscleMetricOptions {
    weeks?: number;
    now?: Date;
}

type WeeklyBucket = HistoricalMuscleMetricData & {
    weekDate: Date;
    loadedWeightTotal: number;
    loadedSetCount: number;
};

/**
 * Creates weekly muscle metrics from sparse analytics rows while preserving empty training weeks.
 */
export function buildHistoricalMuscleMetricData(
    rows: MuscleMetricSourceRow[],
    options: BuildHistoricalMuscleMetricOptions = {}
): HistoricalMuscleMetricData[] {
    const weeks = options.weeks ?? 8;
    const now = options.now ?? new Date();

    const buckets: WeeklyBucket[] = Array.from({ length: weeks }, (_, index) => {
        const weekDate = subWeeks(startOfWeek(now, { weekStartsOn: 0 }), (weeks - 1) - index);
        const isCurrentWeek = isSameWeek(weekDate, now, { weekStartsOn: 0 });

        return {
            weekDate,
            weekStart: format(weekDate, "yyyy-MM-dd"),
            label: isCurrentWeek ? "Current" : format(weekDate, "MMM d"),
            volume: 0,
            avgLoad: null,
            volumeTrend: 0,
            avgLoadTrend: null,
            loadedWeightTotal: 0,
            loadedSetCount: 0,
        };
    });

    for (const row of rows) {
        const rowDate = parseAnalyticsDate(row.session_date);
        if (!rowDate) continue;

        const bucket = buckets.find((candidate) => isSameWeek(candidate.weekDate, rowDate, { weekStartsOn: 0 }));
        if (!bucket) continue;

        bucket.volume += toNumber(row.total_volume);
        bucket.loadedWeightTotal += toNumber(row.total_weight);
        bucket.loadedSetCount += toNumber(row.loaded_sets);
    }

    const metrics = buckets.map((bucket) => ({
        weekStart: bucket.weekStart,
        label: bucket.label,
        volume: roundMetric(bucket.volume),
        avgLoad: bucket.loadedSetCount > 0
            ? roundMetric(bucket.loadedWeightTotal / bucket.loadedSetCount)
            : null,
        volumeTrend: 0,
        avgLoadTrend: null,
    }));

    const volumeTrend = calculateMovingAverage(metrics.map((bucket) => bucket.volume), 3);
    const avgLoadTrend = calculateMovingAverage(metrics.map((bucket) => bucket.avgLoad), 3);

    return metrics.map((bucket, index) => ({
        ...bucket,
        volumeTrend: volumeTrend[index] ?? 0,
        avgLoadTrend: avgLoadTrend[index] ?? null,
    }));
}

/**
 * Calculates a moving average that treats null as "no meaningful logged value".
 */
export function calculateMovingAverage(values: Array<number | null>, windowSize = 3): Array<number | null> {
    return values.map((_, index) => {
        const windowStart = Math.max(0, index - windowSize + 1);
        const windowValues = values
            .slice(windowStart, index + 1)
            .filter((value): value is number => value !== null);

        if (windowValues.length === 0) return null;

        const average = windowValues.reduce((sum, value) => sum + value, 0) / windowValues.length;
        return roundMetric(average);
    });
}

/**
 * Parses API dates without letting date-only strings shift weeks across time zones.
 */
export function parseAnalyticsDate(value: string | Date): Date | null {
    if (value instanceof Date) return value;

    const datePart = value.split(" ")[0]?.split("T")[0];
    const [year, month, day] = datePart?.split("-").map(Number) ?? [];
    if (!year || !month || !day) return null;

    return new Date(year, month - 1, day);
}

/**
 * Normalizes database aggregate values that may arrive as strings.
 */
function toNumber(value: string | number | null): number {
    const numericValue = Number(value ?? 0);
    return Number.isFinite(numericValue) ? numericValue : 0;
}

/**
 * Keeps chart labels stable without hiding meaningful fractional load.
 */
function roundMetric(value: number): number {
    return Number(value.toFixed(2));
}
