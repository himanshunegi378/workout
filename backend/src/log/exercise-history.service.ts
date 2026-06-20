import { HttpStatus, Injectable } from "@nestjs/common";
import { throwLegacyError } from "../common/utils/legacy-http";
import { PrismaService } from "../prisma/prisma.service";

type DateRange = {
  from: Date | null;
  to: Date | null;
};

type RawHistoryLog = {
  id: string;
  exerciseId: string | null;
  weight: number | null;
  reps: number;
  rpe: number | null;
  set_order_index: number;
  pr_type: string | null;
  date: Date;
  sessionExerciseLog: {
    workoutSession: {
      date: Date;
      start_time: Date | null;
    };
    exerciseWithMetadata: {
      exercise_id: string;
      reps_min: number;
      reps_max: number;
      sets_min: number;
      sets_max: number;
      tempo: string;
      rest_min: number;
      rest_max: number;
    } | null;
  } | null;
};

/** Owns exercise history reads for planned and ad-hoc set logs. */
@Injectable()
export class ExerciseHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  /** Returns the latest user-owned log for a visible exercise. */
  async getLastLog(userId: string, exerciseId: string) {
    try {
      const exercise = await this.prisma.exercise.findFirst({
        where: {
          id: exerciseId,
          OR: [{ user_id: userId }, { is_global: true }],
        },
      });

      if (!exercise) {
        throwLegacyError("Exercise not found", HttpStatus.NOT_FOUND);
      }

      const latestLog = await this.prisma.exerciseLog.findFirst({
        where: {
          user_id: userId,
          OR: [
            { exerciseId },
            {
              sessionExerciseLog: {
                exerciseWithMetadata: {
                  exercise_id: exerciseId,
                },
              },
            },
          ],
        },
        orderBy: {
          date: "desc",
        },
        select: {
          id: true,
          weight: true,
          reps: true,
          rpe: true,
        },
      });

      return latestLog || null;
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to fetch last log:", error);
      throwLegacyError("Failed to fetch top log", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Returns flattened exercise history logs matching the legacy public shape. */
  async listLogs(userId: string, searchParams: URLSearchParams) {
    try {
      const dateRange = this.getDateRange(searchParams);
      const exerciseIds = this.getExerciseIds(searchParams);

      if (exerciseIds.length === 0) {
        throwLegacyError("Missing exerciseId query parameter", HttpStatus.BAD_REQUEST);
      }

      const logs = (await this.prisma.exerciseLog.findMany({
        where: {
          user_id: userId,
          AND: [
            {
              OR: [
                { exerciseId: { in: exerciseIds } },
                {
                  sessionExerciseLog: {
                    exerciseWithMetadata: {
                      exercise_id: { in: exerciseIds },
                    },
                  },
                },
              ],
            },
            ...this.getDateFilterClauses(dateRange),
          ],
        },
        orderBy: [
          { sessionExerciseLog: { workoutSession: { date: "desc" } } },
          { date: "asc" },
        ],
        select: {
          id: true,
          exerciseId: true,
          weight: true,
          reps: true,
          rpe: true,
          set_order_index: true,
          pr_type: true,
          date: true,
          sessionExerciseLog: {
            select: {
              workoutSession: {
                select: {
                  date: true,
                  start_time: true,
                },
              },
              exerciseWithMetadata: {
                select: {
                  exercise_id: true,
                  reps_min: true,
                  reps_max: true,
                  sets_min: true,
                  sets_max: true,
                  tempo: true,
                  rest_min: true,
                  rest_max: true,
                },
              },
            },
          },
        },
      })) as RawHistoryLog[];

      return logs.map((log) => ({
        id: log.id,
        exerciseId: log.exerciseId ?? log.sessionExerciseLog?.exerciseWithMetadata?.exercise_id ?? null,
        weight: log.weight,
        reps: log.reps,
        rpe: log.rpe,
        set_order_index: log.set_order_index,
        pr_type: log.pr_type,
        workoutSession: log.sessionExerciseLog?.workoutSession
          ? {
              date: log.sessionExerciseLog.workoutSession.date.toISOString(),
              start_time: log.sessionExerciseLog.workoutSession.start_time?.toISOString() ?? null,
            }
          : {
              date: log.date.toISOString(),
              start_time: null,
            },
        exerciseWithMetadata: log.sessionExerciseLog?.exerciseWithMetadata
          ? {
              reps_min: log.sessionExerciseLog.exerciseWithMetadata.reps_min,
              reps_max: log.sessionExerciseLog.exerciseWithMetadata.reps_max,
              sets_min: log.sessionExerciseLog.exerciseWithMetadata.sets_min,
              sets_max: log.sessionExerciseLog.exerciseWithMetadata.sets_max,
              tempo: log.sessionExerciseLog.exerciseWithMetadata.tempo,
              rest_min: log.sessionExerciseLog.exerciseWithMetadata.rest_min,
              rest_max: log.sessionExerciseLog.exerciseWithMetadata.rest_max,
            }
          : null,
      }));
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Error fetching exercise logs:", error);
      throwLegacyError("Failed to fetch exercise logs", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private getExerciseIds(searchParams: URLSearchParams) {
    return [...new Set([...searchParams.getAll("exerciseId"), ...searchParams.getAll("exerciseIds")]
      .flatMap((value) => value.split(","))
      .map((value) => value.trim())
      .filter(Boolean))]
      .sort();
  }

  private getDateRange(searchParams: URLSearchParams): DateRange {
    const from = this.parseIsoDate(searchParams.get("from"), "from");
    const to = this.parseIsoDate(searchParams.get("to"), "to");

    if (from && to && from > to) {
      throwLegacyError("`from` must be before or equal to `to`", HttpStatus.BAD_REQUEST);
    }

    return { from, to };
  }

  private parseIsoDate(value: string | null, paramName: "from" | "to") {
    if (!value) return null;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throwLegacyError(`Invalid \`${paramName}\` query parameter`, HttpStatus.BAD_REQUEST);
    }

    return parsed;
  }

  private getDateFilterClauses(dateRange: DateRange) {
    if (!dateRange.from && !dateRange.to) {
      return [];
    }

    const sessionDate = {
      ...(dateRange.from ? { gte: dateRange.from } : {}),
      ...(dateRange.to ? { lte: dateRange.to } : {}),
    };
    const adHocDate = {
      ...(dateRange.from ? { gte: dateRange.from } : {}),
      ...(dateRange.to ? { lte: dateRange.to } : {}),
    };

    return [
      {
        OR: [
          {
            sessionExerciseLog: {
              is: {
                workoutSession: {
                  date: sessionDate,
                },
              },
            },
          },
          {
            AND: [{ sessionExerciseLog: { is: null } }, { date: adHocDate }],
          },
        ],
      },
    ];
  }
}
