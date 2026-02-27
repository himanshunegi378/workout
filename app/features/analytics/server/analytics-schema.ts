// app/features/analytics/server/analytics-schema.ts

export const ANALYTICS_DIMENSIONS = [
    "exercise_name",
    "muscle_group",
    "workout_name",
    "workout_id",
    "workout_group_name",
    "workout_group_id",
    "session_date",
    "week_start"
] as const;

export type AnalyticsDimension = typeof ANALYTICS_DIMENSIONS[number];

export const ANALYTICS_MEASURES = [
    "weight",
    "reps",
    "volume",
] as const;

export type AnalyticsMeasure = typeof ANALYTICS_MEASURES[number];

export const ANALYTICS_AGGREGATIONS = [
    "sum",
    "avg",
    "min",
    "max",
    "count",
] as const;

export type AnalyticsAggregation = typeof ANALYTICS_AGGREGATIONS[number];

export const AGGREGATION_MAP: Record<AnalyticsAggregation, string> = {
    sum: "SUM",
    avg: "AVG",
    count: "COUNT",
    min: "MIN",
    max: "MAX",
};

export const ANALYTICS_FILTER_FIELDS = [
    ...ANALYTICS_DIMENSIONS,
    "is_ad_hoc_exercise",
] as const;

export type AnalyticsFilterField = typeof ANALYTICS_FILTER_FIELDS[number];

export const ANALYTICS_FILTER_OPERATORS = [
    "=",
    "!=",
    ">",
    ">=",
    "<",
    "<=",
    "in",
    "between",
] as const;

export type AnalyticsFilterOperator = typeof ANALYTICS_FILTER_OPERATORS[number];
