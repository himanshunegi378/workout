import { HttpStatus, Injectable } from "@nestjs/common";
import { Prisma } from "../../../generated/prisma/client";
import { throwLegacyError } from "../common/utils/legacy-http";
import { PrismaService } from "../prisma/prisma.service";
import { AGGREGATION_MAP } from "./analytics-schema";
import { AnalyticsQueryPayload, AnalyticsQueryPayloadSchema } from "./analytics-validation";

type LegacyVolumeSession = {
  date: Date;
  workout: {
    id: string;
    name: string;
  } | null;
  sessionExerciseLogs: Array<{
    exerciseLog: {
      weight: number | null;
      reps: number;
      exercise: {
        name: string;
        muscle_group: string;
      } | null;
    } | null;
    exerciseWithMetadata: {
      exercise: {
        name: string;
        muscle_group: string;
      };
    } | null;
  }>;
};

type LegacyVolumePoint = {
  date: string;
  workoutId: string;
  workoutName: string;
  muscleGroup: string;
  volume: number;
  exercises: Map<string, number>;
};

type DailySetCount = {
  date: string;
  totalSets: number;
};

type FatigueLog = {
  date: Date;
};

type SessionVolumeLog = {
  workout_session_id: string;
  session_date: Date;
  volume: number;
};

/** Owns analytics read models and legacy volume transformations. */
@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Executes a custom analytics query after preserving legacy Zod validation. */
  async query(userId: string, body: unknown) {
    try {
      const result = AnalyticsQueryPayloadSchema.safeParse(body);

      if (!result.success) {
        throwLegacyError("Invalid payload", HttpStatus.BAD_REQUEST, result.error.format());
      }

      const payload = result.data;
      const data = await this.buildAnalyticsQuery(payload, userId);

      return {
        meta: {
          dimensions: payload.dimensions,
          metrics: payload.metrics.map((metric) => metric.alias),
        },
        data,
      };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to query analytics view:", error);
      throwLegacyError("Failed to query analytics", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Builds the legacy chronological volume response from session logs. */
  async legacyVolume(userId: string) {
    try {
      const sessions = await this.prisma.workoutSession.findMany({
        where: { user_id: userId },
        select: {
          date: true,
          workout: {
            select: {
              id: true,
              name: true,
            },
          },
          sessionExerciseLogs: {
            select: {
              exerciseLog: {
                select: {
                  weight: true,
                  reps: true,
                  exercise: {
                    select: {
                      name: true,
                      muscle_group: true,
                    },
                  },
                },
              },
              exerciseWithMetadata: {
                select: {
                  exercise: {
                    select: {
                      name: true,
                      muscle_group: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      }) as LegacyVolumeSession[];

      const dataPointsMap = new Map<string, LegacyVolumePoint>();

      for (const session of sessions) {
        const workoutId = session.workout?.id || "adhoc";
        const workoutName = session.workout?.name || "Ad-hoc Session";
        const dateStr = session.date.toISOString().split("T")[0];

        for (const sessionLog of session.sessionExerciseLogs) {
          const muscleGroup = sessionLog.exerciseLog?.exercise?.muscle_group
            || sessionLog.exerciseWithMetadata?.exercise.muscle_group;
          if (!muscleGroup) continue;

          const exerciseName = sessionLog.exerciseLog?.exercise?.name
            || sessionLog.exerciseWithMetadata?.exercise.name
            || "Unknown Exercise";
          const key = `${dateStr}-${workoutId}-${muscleGroup}`;

          const log = sessionLog.exerciseLog;
          if (!log) continue;

          const weight = log.weight ?? 0;
          const volume = weight * log.reps;
          if (volume === 0) continue;

          if (!dataPointsMap.has(key)) {
            dataPointsMap.set(key, {
              date: dateStr,
              workoutId,
              workoutName,
              muscleGroup,
              volume: 0,
              exercises: new Map<string, number>(),
            });
          }

          const point = dataPointsMap.get(key)!;
          point.volume += volume;

          const currentExVol = point.exercises.get(exerciseName) ?? 0;
          point.exercises.set(exerciseName, currentExVol + volume);
        }
      }

      return Array.from(dataPointsMap.values())
        .map((point) => ({
          ...point,
          exercises: Array.from(point.exercises.entries()).map(([name, volume]) => ({ name, volume })),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to fetch session volume:", error);
      throwLegacyError("Failed to fetch session volume", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Returns unique exercise counts per calendar day for the last year. */
  async activityHeatmap(userId: string) {
    try {
      const query = Prisma.sql`
    SELECT
      session_date::date::text as date,
      COUNT(DISTINCT exercise_id) as count
    FROM exercise_analytics_view
    WHERE user_id = ${userId}
      AND session_date >= CURRENT_DATE - INTERVAL '365 days'
    GROUP BY session_date
    ORDER BY session_date ASC;
  `;

      const rawData = await this.prisma.$queryRaw<Array<{ date: string; count: bigint | number }>>(query);

      return {
        data: rawData.map((row) => ({
          date: row.date,
          count: typeof row.count === "bigint" ? Number(row.count) : row.count,
        })),
      };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to fetch heatmap activity:", error);
      throwLegacyError("Failed to fetch activity data", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Calculates the non-cardio ACWR fatigue time series. */
  async fatigue(userId: string, queryParams: { endDate?: string; days?: string }) {
    try {
      const targetEndDate = queryParams.endDate
        ? startOfLocalDay(new Date(queryParams.endDate))
        : startOfLocalDay(new Date());
      const daysToView = queryParams.days ? parseInt(queryParams.days, 10) : 30;
      const targetStartDate = subLocalDays(targetEndDate, daysToView - 1);
      const calculationStartDate = subLocalDays(targetStartDate, 27);

      const firstLog = await this.prisma.exerciseLog.findFirst({
        where: { user_id: userId },
        orderBy: { date: "asc" },
        select: { date: true },
      });

      const logs = await this.prisma.exerciseLog.findMany({
        where: {
          user_id: userId,
          date: {
            gte: calculationStartDate,
            lte: addLocalDays(targetEndDate, 1),
          },
          OR: [
            { exercise: { muscle_group: { not: "Cardio" } } },
            {
              sessionExerciseLog: {
                exerciseWithMetadata: {
                  exercise: { muscle_group: { not: "Cardio" } },
                },
              },
            },
          ],
        },
        select: {
          date: true,
        },
      }) as FatigueLog[];

      const logMap = new Map<string, number>();
      for (const log of logs) {
        const dateStr = log.date.toISOString().split("T")[0];
        logMap.set(dateStr, (logMap.get(dateStr) || 0) + 1);
      }

      const dailyLogs: DailySetCount[] = Array.from(logMap.entries()).map(([date, totalSets]) => ({
        date,
        totalSets,
      }));
      const firstEverLogDate = firstLog?.date || null;

      return {
        timeSeries: generateACWRTimeSeries(dailyLogs, targetStartDate, targetEndDate, firstEverLogDate),
        hasMoreHistory: firstEverLogDate ? startOfLocalDay(firstEverLogDate) < calculationStartDate : false,
      };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to fetch fatigue data:", error);
      throwLegacyError("Failed to calculate fatigue analytics", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Returns session-level volume deltas and overload status for a workout. */
  async sessionVolume(userId: string, queryParams: { workoutId?: string; limit?: string }) {
    try {
      const { workoutId } = queryParams;
      const limit = queryParams.limit ? parseInt(queryParams.limit, 10) : 15;

      if (!workoutId) {
        throwLegacyError("Missing workoutId parameter", HttpStatus.BAD_REQUEST);
      }

      const logs = await this.prisma.exercise_analytics_view.findMany({
        where: {
          user_id: userId,
          workout_id: workoutId,
          muscle_group: { not: "Cardio" },
        },
        orderBy: {
          session_date: "asc",
        },
      }) as SessionVolumeLog[];

      if (logs.length === 0) {
        return [];
      }

      const sessionMap = new Map<string, { date: Date; volume: number }>();

      for (const log of logs) {
        const actualVolume = log.volume > 0 ? log.volume : 0;

        if (!sessionMap.has(log.workout_session_id)) {
          sessionMap.set(log.workout_session_id, {
            date: log.session_date,
            volume: actualVolume,
          });
        } else {
          const existing = sessionMap.get(log.workout_session_id)!;
          existing.volume += actualVolume;
          if (log.session_date > existing.date) {
            existing.date = log.session_date;
          }
        }
      }

      const sessions = Array.from(sessionMap.entries())
        .map(([id, data]) => ({
          id,
          date: data.date,
          volume: data.volume,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      const result = [];
      let previousVolume: number | null = null;

      for (const current of sessions) {
        let deltaPercentage = 0;
        let status: "optimal" | "warning" | "deload" | "neutral" = "neutral";

        if (previousVolume !== null && previousVolume > 0) {
          deltaPercentage = ((current.volume - previousVolume) / previousVolume) * 100;

          if (deltaPercentage < 0) {
            status = "deload";
          } else if (deltaPercentage <= 5) {
            status = "optimal";
          } else {
            status = "warning";
          }
        } else if (previousVolume === 0 && current.volume > 0) {
          deltaPercentage = 100;
          status = "warning";
        }

        result.push({
          id: current.id,
          date: current.date.toISOString(),
          volume: current.volume,
          deltaPercentage: Number(deltaPercentage.toFixed(1)),
          status,
        });

        previousVolume = current.volume;
      }

      return result.slice(-limit);
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to fetch session volume data:", error);
      throwLegacyError("Failed to calculate session volume", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async buildAnalyticsQuery(payload: AnalyticsQueryPayload, userId: string) {
    const { metrics, dimensions, filters, order_by, limit } = payload;
    const selectParts: string[] = [];

    for (const dimension of dimensions) {
      if (dimension === "week_start") {
        selectParts.push("DATE_TRUNC('week', session_date) AS week_start");
      } else {
        selectParts.push(dimension);
      }
    }

    for (const metric of metrics) {
      const sqlAgg = AGGREGATION_MAP[metric.aggregation];
      selectParts.push(`${sqlAgg}(${metric.field}) AS ${metric.alias}`);
    }

    const selectClause = Prisma.raw(selectParts.join(", "));
    const whereConditions: Prisma.Sql[] = [Prisma.sql`user_id = ${userId}`];

    for (const filter of filters) {
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
            whereConditions.push(Prisma.sql`${Prisma.raw(field)} BETWEEN ${value[0]} AND ${value[1]}`);
          }
          break;
      }
    }

    const whereClause = Prisma.sql`${Prisma.join(whereConditions, " AND ")}`;

    let groupByClause = Prisma.empty;
    if (dimensions.length > 0) {
      const rawDims = dimensions.map((dimension) =>
        dimension === "week_start" ? "DATE_TRUNC('week', session_date)" : dimension);
      groupByClause = Prisma.sql`GROUP BY ${Prisma.raw(rawDims.join(", "))}`;
    }

    let orderByClause = Prisma.empty;
    if (order_by.length > 0) {
      const allowedTargets = new Set<string>([
        ...dimensions,
        ...metrics.map((metric) => metric.alias),
      ]);

      const orderParts = order_by
        .filter((order) => allowedTargets.has(order.field))
        .map((order) => `${order.field} ${order.direction.toUpperCase()}`);

      if (orderParts.length > 0) {
        orderByClause = Prisma.sql`ORDER BY ${Prisma.raw(orderParts.join(", "))}`;
      }
    }

    const limitClause = Prisma.sql`LIMIT ${limit}`;
    const query = Prisma.sql`
    SELECT ${selectClause}
    FROM exercise_analytics_view
    WHERE ${whereClause}
    ${groupByClause}
    ${orderByClause}
    ${limitClause}
  `;

    const rawData = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(query);

    return rawData.map((row) => {
      const serialized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) {
        serialized[key] = typeof value === "bigint" ? Number(value) : value;
      }
      return serialized;
    });
  }
}

function startOfLocalDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addLocalDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function subLocalDays(date: Date, days: number) {
  return addLocalDays(date, -days);
}

function differenceInLocalDays(left: Date, right: Date) {
  const leftStart = startOfLocalDay(left).getTime();
  const rightStart = startOfLocalDay(right).getTime();
  return Math.round((leftStart - rightStart) / 86_400_000);
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function generateACWRTimeSeries(
  dailyLogs: DailySetCount[],
  targetStartDate: Date,
  targetEndDate: Date,
  firstEverLogDate: Date | null,
) {
  const logMap = new Map<string, number>();
  for (const log of dailyLogs) {
    logMap.set(log.date, log.totalSets);
  }

  const calculationStartDate = subLocalDays(targetStartDate, 27);
  const window7: number[] = [];
  const window28: number[] = [];
  const results: Array<{
    date: string;
    acuteLoad: number;
    chronicLoad: number;
    ratio: number;
    isCalibrating: boolean;
  }> = [];
  const average = (values: number[]) =>
    values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  const totalDaysToProcess = differenceInLocalDays(targetEndDate, calculationStartDate) + 1;

  for (let i = 0; i < totalDaysToProcess; i++) {
    const currentDate = addLocalDays(calculationStartDate, i);
    const dateStr = formatLocalDate(currentDate);
    const setsToday = logMap.get(dateStr) ?? 0;

    window7.push(setsToday);
    window28.push(setsToday);

    if (window7.length > 7) window7.shift();
    if (window28.length > 28) window28.shift();

    if (i >= 27) {
      const acuteLoad = average(window7);
      const chronicLoad = average(window28);
      const ratio = chronicLoad > 0 ? acuteLoad / chronicLoad : 0;
      let isCalibrating = true;

      if (firstEverLogDate) {
        const daysSinceFirstLog = differenceInLocalDays(currentDate, startOfLocalDay(firstEverLogDate));
        isCalibrating = daysSinceFirstLog < 28;
      }

      results.push({
        date: dateStr,
        acuteLoad: Number(acuteLoad.toFixed(2)),
        chronicLoad: Number(chronicLoad.toFixed(2)),
        ratio: Number(ratio.toFixed(2)),
        isCalibrating,
      });
    }
  }

  return results;
}
