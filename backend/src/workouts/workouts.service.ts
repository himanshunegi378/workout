import { HttpStatus, Injectable } from "@nestjs/common";
import { throwLegacyError } from "../common/utils/legacy-http";
import { PrismaService } from "../prisma/prisma.service";

type CreateWorkoutBody = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
};

type AddExerciseBody = {
  id?: unknown;
  exercise_id?: unknown;
  sets_min?: unknown;
  sets_max?: unknown;
  reps_min?: unknown;
  reps_max?: unknown;
  rest_min?: unknown;
  rest_max?: unknown;
  tempo?: unknown;
};

type UpdateMetadataBody = {
  exercise_id?: unknown;
  sets_min?: unknown;
  sets_max?: unknown;
  reps_min?: unknown;
  reps_max?: unknown;
  rest_min?: unknown;
  rest_max?: unknown;
  tempo?: unknown;
};

type HistoricalExerciseLog = {
  id: string;
  weight: number | null;
  reps: number;
  rpe: number | null;
  set_order_index: number;
  sessionExerciseLog: {
    workout_session_id: string;
  } | null;
};

/** Owns workout template persistence. */
@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lists user-owned workouts for dashboard selectors. */
  async listForUser(userId: string, onlyActive: boolean) {
    try {
      const programmeFilter: { user_id: string; is_active?: boolean } = {
        user_id: userId,
      };

      if (onlyActive) {
        programmeFilter.is_active = true;
      }

      return await this.prisma.workout.findMany({
        where: {
          programme: programmeFilter,
        },
        select: {
          id: true,
          name: true,
          programme: {
            select: { name: true },
          },
        },
        orderBy: [
          { programme: { name: "asc" } },
          { order_index: "asc" },
        ],
      });
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to fetch workouts:", error);
      throwLegacyError("Failed to fetch workouts", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Returns workout details with today's session and previous session logs. */
  async getWorkoutDetails(userId: string, programmeId: string, workoutId: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const workoutData = await this.prisma.workout.findFirst({
        where: {
          id: workoutId,
          programme: { id: programmeId, user_id: userId },
        },
        relationLoadStrategy: "join",
        select: {
          id: true,
          name: true,
          exercisesWithMetadata: {
            where: { is_hidden: false },
            orderBy: { order_index: "asc" },
            select: {
              id: true,
              exercise_id: true,
              sets_min: true,
              sets_max: true,
              reps_min: true,
              reps_max: true,
              rest_min: true,
              rest_max: true,
              tempo: true,
              exercise: {
                select: {
                  id: true,
                  name: true,
                  muscle_group: true,
                  exerciseLogs: {
                    where: {
                      user_id: userId,
                      date: { lt: today },
                    },
                    orderBy: [{ date: "desc" }, { set_order_index: "asc" }],
                    take: 15,
                    select: {
                      id: true,
                      weight: true,
                      reps: true,
                      rpe: true,
                      set_order_index: true,
                      date: true,
                      user_id: true,
                      pr_type: true,
                      exerciseId: true,
                      sessionExerciseLog: {
                        select: { workout_session_id: true },
                      },
                    },
                  },
                },
              },
            },
          },
          workoutSessions: {
            where: {
              user_id: userId,
              date: { gte: today, lt: tomorrow },
            },
            take: 1,
            select: {
              id: true,
              sessionExerciseLogs: {
                select: {
                  id: true,
                  exercise_with_metadata_id: true,
                  exerciseLog: {
                    select: {
                      id: true,
                      exerciseId: true,
                      weight: true,
                      reps: true,
                      rpe: true,
                      set_order_index: true,
                      user_id: true,
                      date: true,
                      pr_type: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!workoutData) {
        throwLegacyError("Workout not found", HttpStatus.NOT_FOUND);
      }

      const { workoutSessions, ...workout } = workoutData;
      const activeSession = workoutSessions[0] || null;
      const previousLogsByExercise: Record<string, Array<{
        id: string;
        weight: number | null;
        reps: number;
        rpe: number | null;
        set_order_index: number;
      }>> = {};

      workout.exercisesWithMetadata.forEach((ewm) => {
        const logs = (ewm.exercise?.exerciseLogs || []) as HistoricalExerciseLog[];
        if (logs.length > 0) {
          const lastSessionId = logs[0].sessionExerciseLog?.workout_session_id;

          if (lastSessionId) {
            previousLogsByExercise[ewm.exercise_id] = logs
              .filter((log) => log.sessionExerciseLog?.workout_session_id === lastSessionId)
              .map((log) => ({
                id: log.id,
                weight: log.weight,
                reps: log.reps,
                rpe: log.rpe,
                set_order_index: log.set_order_index,
              }))
              .sort((a, b) => a.set_order_index - b.set_order_index);
          }
        }
      });

      return {
        workout,
        session: activeSession,
        previousLogsByExercise,
      };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("[GET_WORKOUT_DETAILS_API_ERROR]:", error);
      throwLegacyError("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Adds exercise metadata to a workout with legacy idempotency behavior. */
  async addExercise(userId: string, programmeId: string, workoutId: string, body: unknown) {
    try {
      const workout = await this.prisma.workout.findFirst({
        where: {
          id: workoutId,
          programme: { id: programmeId, user_id: userId },
        },
        include: {
          _count: {
            select: {
              exercisesWithMetadata: {
                where: { is_hidden: false },
              },
            },
          },
        },
      });

      if (!workout) {
        throwLegacyError("Workout not found", HttpStatus.NOT_FOUND);
      }

      const { id, exercise_id, sets_min, sets_max, reps_min, reps_max, rest_min, rest_max, tempo } =
        (body ?? {}) as AddExerciseBody;

      if (id) {
        const existing = await this.prisma.exerciseWithMetadata.findUnique({
          where: { id: id as string },
        });

        if (existing) {
          const workoutVerify = await this.prisma.workout.findFirst({
            where: { id: existing.workout_id, programme: { user_id: userId } },
          });

          if (!workoutVerify) {
            throwLegacyError("Forbidden", HttpStatus.FORBIDDEN);
          }

          return { body: existing, statusCode: HttpStatus.OK };
        }
      }

      if (!exercise_id) {
        throwLegacyError("Exercise is required", HttpStatus.BAD_REQUEST);
      }

      const exercise = await this.prisma.exercise.findFirst({
        where: {
          id: exercise_id as string,
          OR: [{ user_id: userId }, { is_global: true }],
        },
        select: { id: true },
      });

      if (!exercise) {
        throwLegacyError("Exercise not found", HttpStatus.NOT_FOUND);
      }

      const aggregate = await this.prisma.exerciseWithMetadata.aggregate({
        where: { workout_id: workoutId },
        _max: { order_index: true },
      });
      const orderIndex = (aggregate._max.order_index ?? -1) + 1;

      const exerciseWithMetadata = await this.prisma.exerciseWithMetadata.create({
        data: {
          id: (id as string) || undefined,
          exercise_id: exercise_id as string,
          workout_id: workoutId,
          sets_min: sets_min as number,
          sets_max: sets_max as number,
          reps_min: reps_min as number,
          reps_max: reps_max as number,
          rest_min: rest_min as number,
          rest_max: rest_max as number,
          tempo: tempo as string,
          order_index: orderIndex,
        },
      });

      return { body: exerciseWithMetadata, statusCode: HttpStatus.CREATED };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to link exercise to workout:", error);
      throwLegacyError("Failed to link exercise", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Updates exercise metadata with the legacy history-preserving clone path. */
  async updateMetadata(userId: string, workoutId: string, metadataId: string, body: unknown) {
    try {
      const { exercise_id, sets_min, sets_max, reps_min, reps_max, rest_min, rest_max, tempo } =
        (body ?? {}) as UpdateMetadataBody;

      const existingEwm = await this.prisma.exerciseWithMetadata.findFirst({
        where: {
          id: metadataId,
          workout_id: workoutId,
        },
      });

      if (!existingEwm) {
        throwLegacyError("Exercise metadata not found", HttpStatus.NOT_FOUND);
      }

      const existingSession = await this.prisma.workoutSession.findFirst({
        where: { workout_id: workoutId, user_id: userId },
      });

      if (existingSession) {
        const [result] = await this.prisma.$transaction([
          this.prisma.exerciseWithMetadata.create({
            data: {
              exercise_id: (exercise_id ?? existingEwm.exercise_id) as string,
              workout_id: workoutId,
              sets_min: (sets_min ?? existingEwm.sets_min) as number,
              sets_max: (sets_max ?? existingEwm.sets_max) as number,
              reps_min: (reps_min ?? existingEwm.reps_min) as number,
              reps_max: (reps_max ?? existingEwm.reps_max) as number,
              rest_min: (rest_min ?? existingEwm.rest_min) as number,
              rest_max: (rest_max ?? existingEwm.rest_max) as number,
              tempo: (tempo ?? existingEwm.tempo) as string,
              order_index: existingEwm.order_index,
            },
          }),
          this.prisma.exerciseWithMetadata.update({
            where: { id: metadataId },
            data: { is_hidden: true },
          }),
        ]);

        return result;
      }

      const updateData: Record<string, unknown> = {};
      if (exercise_id !== undefined) updateData.exercise_id = exercise_id;
      if (sets_min !== undefined) updateData.sets_min = sets_min;
      if (sets_max !== undefined) updateData.sets_max = sets_max;
      if (reps_min !== undefined) updateData.reps_min = reps_min;
      if (reps_max !== undefined) updateData.reps_max = reps_max;
      if (rest_min !== undefined) updateData.rest_min = rest_min;
      if (rest_max !== undefined) updateData.rest_max = rest_max;
      if (tempo !== undefined) updateData.tempo = tempo;

      return this.prisma.exerciseWithMetadata.update({
        where: { id: metadataId },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to edit exercise metadata:", error);
      throwLegacyError("Failed to edit exercise metadata", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Creates a workout with legacy programme ownership and order-index behavior. */
  async createForProgramme(userId: string, programmeId: string, body: unknown) {
    try {
      const programme = await this.prisma.programme.findFirst({
        where: { id: programmeId, user_id: userId },
        include: {
          _count: {
            select: { workouts: true },
          },
        },
      });

      if (!programme) {
        throwLegacyError("Programme not found", HttpStatus.NOT_FOUND);
      }

      const { id, name, description } = (body ?? {}) as CreateWorkoutBody;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        throwLegacyError("Workout name is required", HttpStatus.BAD_REQUEST);
      }

      if (id) {
        const existing = await this.prisma.workout.findUnique({
          where: { id: id as string },
        });

        if (existing) {
          const existingProgramme = await this.prisma.programme.findUnique({
            where: { id: existing.programme_id },
          });

          if (!existingProgramme || existingProgramme.user_id !== userId) {
            throwLegacyError("Forbidden", HttpStatus.FORBIDDEN);
          }

          return { body: existing, statusCode: HttpStatus.OK };
        }
      }

      const workout = await this.prisma.workout.create({
        data: {
          id: (id as string) || undefined,
          name: name.trim(),
          description: (description as string) || null,
          programme_id: programmeId,
          order_index: programme._count.workouts,
        },
      });

      return { body: workout, statusCode: HttpStatus.CREATED };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to create workout:", error);
      throwLegacyError("Failed to create workout", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
