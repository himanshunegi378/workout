// app/features/analytics/server/analytics-service.ts
import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import type { AnalyticsQueryPayload } from "./analytics-validation";
import { AGGREGATION_MAP } from "./analytics-schema";

export async function buildAnalyticsQuery(
    payload: AnalyticsQueryPayload,
    userId: string
) {
    const { metrics, dimensions, filters, order_by, limit } = payload;

    // 1. SELECT Clause
    const selectParts: string[] = [];

    // Dimensions
    for (const dim of dimensions) {
        if (dim === "week_start") {
            selectParts.push(`DATE_TRUNC('week', session_date) AS week_start`);
        } else {
            selectParts.push(dim);
        }
    }

    // Metrics
    for (const metric of metrics) {
        // e.g. SUM(volume) AS total_volume
        const sqlAgg = AGGREGATION_MAP[metric.aggregation];
        selectParts.push(
            `${sqlAgg}(${metric.field}) AS ${metric.alias}`
        );
    }

    const selectClause = Prisma.raw(selectParts.join(", "));

    // 2. WHERE Clause
    // Always enforce user isolation
    const whereConditions: Prisma.Sql[] = [Prisma.sql`user_id = ${userId}`];

    for (const filter of filters) {
        // Security: field and operator were strictly validated by Zod
        const { field, operator, value } = filter;

        switch (operator) {
            case "=":
                whereConditions.push(Prisma.sql`${Prisma.raw(field)} = ${value}`);
                break;
            case "!=":
                whereConditions.push(Prisma.sql`${Prisma.raw(field)} != ${value}`);
                break;
            case ">":
                whereConditions.push(Prisma.sql`${Prisma.raw(field)} > ${value}`);
                break;
            case ">=":
                whereConditions.push(Prisma.sql`${Prisma.raw(field)} >= ${value}`);
                break;
            case "<":
                whereConditions.push(Prisma.sql`${Prisma.raw(field)} < ${value}`);
                break;
            case "<=":
                whereConditions.push(Prisma.sql`${Prisma.raw(field)} <= ${value}`);
                break;
            case "in":
                if (Array.isArray(value) && value.length > 0) {
                    whereConditions.push(Prisma.sql`${Prisma.raw(field)} IN (${Prisma.join(value)})`);
                }
                break;
            case "between":
                if (Array.isArray(value) && value.length === 2) {
                    whereConditions.push(
                        Prisma.sql`${Prisma.raw(field)} BETWEEN ${value[0]} AND ${value[1]}`
                    );
                }
                break;
        }
    }

    const whereClause = Prisma.sql`${Prisma.join(whereConditions, " AND ")}`;

    // 3. GROUP BY Clause
    let groupByClause = Prisma.empty;
    if (dimensions.length > 0) {
        const rawDims = dimensions.map(d => (d === "week_start" ? "DATE_TRUNC('week', session_date)" : d));
        groupByClause = Prisma.sql`GROUP BY ${Prisma.raw(rawDims.join(", "))}`;
    }

    // 4. ORDER BY Clause
    let orderByClause = Prisma.empty;
    if (order_by.length > 0) {
        const allowedTargets = new Set<string>([
            ...dimensions,
            ...metrics.map(m => m.alias)
        ]);

        const orderParts = order_by
            .filter(o => allowedTargets.has(o.field))
            .map((o) => `${o.field} ${o.direction.toUpperCase()}`);

        if (orderParts.length > 0) {
            orderByClause = Prisma.sql`ORDER BY ${Prisma.raw(orderParts.join(", "))}`;
        }
    }

    // 5. LIMIT Clause
    const limitClause = Prisma.sql`LIMIT ${limit}`;

    // 6. Final Query Assembly
    const query = Prisma.sql`
    SELECT ${selectClause}
    FROM exercise_analytics_view
    WHERE ${whereClause}
    ${groupByClause}
    ${orderByClause}
    ${limitClause}
  `;

    // console.log("Executing Query:", query);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawData = await prisma.$queryRaw<any[]>(query);

    // Convert BigInts to Numbers so Next.js JSON stringification does not crash
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawData.map((row: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const serialized: any = {};
        for (const [key, value] of Object.entries(row)) {
            serialized[key] = typeof value === 'bigint' ? Number(value) : value;
        }
        return serialized;
    });
}
