import { HttpStatus, Injectable } from "@nestjs/common";
import { MuscleGroup } from "../../../generated/prisma/client";
import { throwLegacyError } from "../common/utils/legacy-http";
import { PrismaService } from "../prisma/prisma.service";

type CreateExerciseBody = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  muscle_group?: unknown;
};

/** Owns exercise library persistence while matching the legacy route behavior. */
@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Returns global exercises and the user's custom exercises in legacy sort order. */
  async listForUser(userId: string) {
    try {
      return await this.prisma.exercise.findMany({
        where: {
          OR: [{ user_id: userId }, { is_global: true }],
        },
        orderBy: [{ muscle_group: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          description: true,
          muscle_group: true,
        },
      });
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
      throwLegacyError("Failed to fetch exercises", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Creates a user-scoped exercise, including client-ID idempotency checks. */
  async createCustomExercise(userId: string, body: unknown) {
    try {
      const { id, name, description, muscle_group } = (body ?? {}) as CreateExerciseBody;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        throwLegacyError("Exercise name is required", HttpStatus.BAD_REQUEST);
      }

      if (id) {
        const existing = await this.prisma.exercise.findUnique({
          where: { id: id as string },
        });

        if (existing) {
          if (existing.is_global || existing.user_id !== userId) {
            throwLegacyError("Forbidden", HttpStatus.FORBIDDEN);
          }
          return { body: existing, statusCode: HttpStatus.OK };
        }
      }

      if (!muscle_group || !Object.values(MuscleGroup).includes(muscle_group as MuscleGroup)) {
        throwLegacyError("Valid muscle group is required", HttpStatus.BAD_REQUEST);
      }

      const exercise = await this.prisma.exercise.create({
        data: {
          id: (id as string) || undefined,
          name: name.trim(),
          description: (description as string) || null,
          muscle_group: muscle_group as MuscleGroup,
          user_id: userId,
          is_global: false,
        },
      });

      return { body: exercise, statusCode: HttpStatus.CREATED };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to create exercise:", error);
      throwLegacyError("Failed to create exercise", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
