export const ANALYTICS_DIMENSIONS = [
  "exercise_name",
  "muscle_group",
  "workout_name",
  "workout_id",
  "programme_name",
  "programme_id",
  "session_date",
  "week_start",
] as const;

export const ANALYTICS_MEASURES = [
  "weight",
  "reps",
  "volume",
] as const;

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
  "weight",
  "is_ad_hoc_exercise",
] as const;

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
