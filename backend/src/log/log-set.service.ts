import { HttpStatus, Injectable } from "@nestjs/common";
import { throwLegacyError } from "../common/utils/legacy-http";
import { PrismaService } from "../prisma/prisma.service";
import { detectPR } from "./pr-utils";

type CreateLogSetBody = {
  id?: unknown;
  workoutId?: unknown;
  exerciseWithMetadataId?: unknown;
  exerciseId?: unknown;
  setOrderIndex?: unknown;
  weight?: unknown;
  reps?: unknown;
  rpe?: unknown;
  date?: unknown;
};

type UpdateLogSetBody = {
  setId?: unknown;
  weight?: unknown;
  reps?: unknown;
  rpe?: unknown;
};

type ExerciseLogWithPrType = {
  id: string;
  user_id: string;
  pr_type: string | null;
};

/** Owns set logging writes and session cleanup side effects. */
@Injectable()
export class LogSetService {
  constructor(private readonly prisma: PrismaService) {}

  /** Creates a set log with legacy offline idempotency and PR detection. */
  async create(userId: string, body: unknown) {
    try {
      const { id, workoutId, exerciseWithMetadataId, exerciseId, setOrderIndex, weight, reps, rpe, date } =
        (body ?? {}) as CreateLogSetBody;

      if (setOrderIndex === undefined || !reps) {
        throwLegacyError("Missing required fields", HttpStatus.BAD_REQUEST);
      }

      if (id) {
        const existingLog = await this.prisma.exerciseLog.findUnique({
          where: { id: id as string },
          include: { sessionExerciseLog: true },
        });

        if (existingLog) {
          if (existingLog.user_id !== userId) {
            throwLegacyError("Forbidden", HttpStatus.FORBIDDEN);
          }

          return { body: { ...existingLog, pr: existingLog.pr_type }, statusCode: HttpStatus.OK };
        }
      }

      if (exerciseId) {
        const exercise = await this.prisma.exercise.findFirst({
          where: {
            id: exerciseId as string,
            OR: [{ user_id: userId }, { is_global: true }],
          },
          select: { id: true },
        });

        if (!exercise) {
          throwLegacyError("Exercise not found", HttpStatus.NOT_FOUND);
        }
      }

      const targetDate = date ? new Date(date as string) : new Date();
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      let session;
      if (workoutId) {
        session = await this.prisma.workoutSession.findFirst({
          where: {
            user_id: userId,
            workout_id: workoutId as string,
            date: { gte: startOfDay, lt: endOfDay },
          },
        });
      } else {
        session = await this.prisma.workoutSession.findFirst({
          where: {
            user_id: userId,
            date: { gte: startOfDay, lt: endOfDay },
          },
          orderBy: { workout_id: { sort: "desc", nulls: "last" } },
        });
      }

      if (!session) {
        session = await this.prisma.workoutSession.create({
          data: {
            user_id: userId,
            workout_id: (workoutId as string) || null,
            start_time: targetDate,
            date: targetDate,
          },
        });
      }

      const sessionId = session.id;
      const exerciseLog = await this.prisma.$transaction(async (tx) => {
        const el = await tx.exerciseLog.create({
          data: {
            id: (id as string) || undefined,
            user_id: userId,
            exerciseId: (exerciseId as string) || null,
            set_order_index: setOrderIndex as number,
            weight: weight ? parseFloat(weight as string) : null,
            reps: parseInt(reps as string),
            rpe: rpe ? parseFloat(rpe as string) : null,
            date: targetDate,
            pr_type: null,
          },
        });

        await tx.sessionExerciseLog.create({
          data: {
            id: `sel_${el.id}`,
            workout_session_id: sessionId,
            exercise_with_metadata_id: (exerciseWithMetadataId as string) || null,
            user_id: userId,
            exercise_log_id: el.id,
          },
        });

        return el;
      });

      let prType: string | null = null;
      if (exerciseId) {
        const historicalBest = await this.prisma.exerciseLog.aggregate({
          _max: { weight: true, reps: true },
          where: {
            user_id: userId,
            id: { not: exerciseLog.id },
            OR: [
              { exerciseId: exerciseId as string },
              {
                sessionExerciseLog: {
                  exerciseWithMetadata: {
                    exercise_id: exerciseId as string,
                  },
                },
              },
            ],
          },
        });

        prType = detectPR({
          weight: exerciseLog.weight,
          reps: exerciseLog.reps,
          bestWeight: historicalBest._max.weight ?? null,
          bestReps: historicalBest._max.reps ?? null,
        });

        if (prType) {
          await this.prisma.exerciseLog.update({
            where: { id: exerciseLog.id },
            data: { pr_type: prType },
          });
        }
      }

      return { body: { ...exerciseLog, pr_type: prType, pr: prType }, statusCode: HttpStatus.CREATED };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to log set:", error);
      throwLegacyError(error instanceof Error ? error.message : "Failed to log set", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Deletes a set and removes its session when it has no remaining logs. */
  async delete(userId: string, searchParams: URLSearchParams) {
    try {
      const setId = searchParams.get("setId");

      if (!setId) {
        throwLegacyError("Set ID is required", HttpStatus.BAD_REQUEST);
      }

      const result = await this.prisma.$transaction(async (tx) => {
        const set = await tx.exerciseLog.findUnique({
          where: { id: setId },
          include: { sessionExerciseLog: true },
        }) as (ExerciseLogWithPrType & {
          sessionExerciseLog: { workout_session_id: string } | null;
        }) | null;

        if (!set) {
          throw new Error("Set not found");
        }

        if (set.user_id !== userId) {
          throw new Error("Unauthorized");
        }

        const sessionId = set.sessionExerciseLog?.workout_session_id;

        await tx.exerciseLog.delete({
          where: { id: setId },
        });

        if (sessionId) {
          const remainingSets = await tx.sessionExerciseLog.count({
            where: { workout_session_id: sessionId },
          });

          if (remainingSets === 0) {
            await tx.workoutSession.delete({
              where: { id: sessionId },
            });
            return { message: "Set deleted and empty session purged", sessionPurged: true };
          }
        }

        return { message: "Set deleted successfully", sessionPurged: false };
      });

      return result;
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to delete set:", error);
      const status = error instanceof Error && error.message === "Set not found"
        ? HttpStatus.NOT_FOUND
        : error instanceof Error && error.message === "Unauthorized"
          ? HttpStatus.FORBIDDEN
          : HttpStatus.INTERNAL_SERVER_ERROR;
      throwLegacyError(error instanceof Error ? error.message : "Failed to delete set", status);
    }
  }

  /** Updates a set's performance data without recalculating PR state. */
  async update(userId: string, body: unknown) {
    try {
      const { setId, weight, reps, rpe } = (body ?? {}) as UpdateLogSetBody;

      if (!setId || reps === undefined) {
        throwLegacyError("Missing required fields", HttpStatus.BAD_REQUEST);
      }

      const set = await this.prisma.exerciseLog.findUnique({
        where: { id: setId as string },
      });

      if (!set) {
        throwLegacyError("Set not found", HttpStatus.NOT_FOUND);
      }

      if (set.user_id !== userId) {
        throwLegacyError("Unauthorized", HttpStatus.FORBIDDEN);
      }

      return await this.prisma.exerciseLog.update({
        where: { id: setId as string },
        data: {
          weight: weight ? parseFloat(weight as string) : null,
          reps: parseInt(reps as string),
          rpe: rpe ? parseFloat(rpe as string) : null,
        },
      });
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to update set:", error);
      throwLegacyError(error instanceof Error ? error.message : "Failed to update set", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
