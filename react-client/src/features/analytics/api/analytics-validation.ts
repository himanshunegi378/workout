// app/features/analytics/server/analytics-validation.ts

import { z } from "zod";
import {
    ANALYTICS_AGGREGATIONS,
    ANALYTICS_DIMENSIONS,
    ANALYTICS_FILTER_FIELDS,
    ANALYTICS_FILTER_OPERATORS,
    ANALYTICS_MEASURES,
} from "./analytics-schema";

const MetricSchema = z.object({
    field: z.enum(ANALYTICS_MEASURES),
    aggregation: z.enum(ANALYTICS_AGGREGATIONS),
    alias: z.string().regex(/^[a-zA-Z0-9_]+$/, "Alias must contain only alphanumeric characters and underscores"),
});

const FilterSchema = z.object({
    field: z.enum(ANALYTICS_FILTER_FIELDS),
    operator: z.enum(ANALYTICS_FILTER_OPERATORS),
    value: z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.union([z.string(), z.number()]))
    ]),
});

const OrderBySchema = z.object({
    field: z.string().regex(/^[a-zA-Z0-9_]+$/, "Order by field must be a valid alias or dimension"),
    direction: z.enum(["asc", "desc"]).default("asc"),
});

export const AnalyticsQueryPayloadSchema = z.object({
    metrics: z.array(MetricSchema).min(1, "At least one metric is required"),
    dimensions: z.array(z.enum(ANALYTICS_DIMENSIONS)).default([]),
    filters: z.array(FilterSchema).default([]),
    order_by: z.array(OrderBySchema).default([]),
    limit: z.number().int().positive().max(1000).default(50),
});

export type AnalyticsQueryPayload = z.infer<typeof AnalyticsQueryPayloadSchema>;
