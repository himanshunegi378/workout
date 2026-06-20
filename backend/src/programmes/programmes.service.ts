import { HttpStatus, Injectable } from "@nestjs/common";
import { throwLegacyError } from "../common/utils/legacy-http";
import { PrismaService } from "../prisma/prisma.service";

type CreateProgrammeBody = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  is_active?: unknown;
};

type UpdateProgrammeBody = {
  is_active?: unknown;
};

/** Owns programme summary and creation persistence. */
@Injectable()
export class ProgrammesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lists programme summaries for a user in legacy name order. */
  async list(userId: string) {
    try {
      return await this.prisma.programme.findMany({
        where: { user_id: userId },
        select: {
          id: true,
          name: true,
          description: true,
          is_active: true,
          workouts: {
            select: { id: true },
          },
        },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      console.error("Failed to fetch programmes:", error);
      throwLegacyError("Failed to fetch programmes", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Returns programme detail with active exercise previews. */
  async getDetail(userId: string, programmeId: string) {
    try {
      const programme = await this.prisma.programme.findFirst({
        where: { id: programmeId, user_id: userId },
        relationLoadStrategy: "join",
        select: {
          id: true,
          name: true,
          is_active: true,
          workouts: {
            orderBy: { order_index: "asc" },
            select: {
              id: true,
              name: true,
              order_index: true,
              exercisesWithMetadata: {
                where: { is_hidden: false },
                orderBy: { order_index: "asc" },
                take: 3,
                select: {
                  exercise: { select: { name: true } },
                },
              },
              _count: {
                select: {
                  exercisesWithMetadata: {
                    where: { is_hidden: false },
                  },
                },
              },
            },
          },
        },
      });

      if (!programme) {
        throwLegacyError("Programme not found", HttpStatus.NOT_FOUND);
      }

      return programme;
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("[GET_PROGRAMME_API_ERROR]:", error);
      throwLegacyError("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Creates a programme while preserving idempotency and activation side effects. */
  async create(userId: string, body: unknown) {
    try {
      const { id, name, description, is_active } = (body ?? {}) as CreateProgrammeBody;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        throwLegacyError("Programme name is required", HttpStatus.BAD_REQUEST);
      }

      if (id) {
        const existing = await this.prisma.programme.findUnique({
          where: { id: id as string },
        });

        if (existing) {
          if (existing.user_id !== userId) {
            throwLegacyError("Forbidden", HttpStatus.FORBIDDEN);
          }
          return { body: existing, statusCode: HttpStatus.OK };
        }
      }

      const programme = await this.prisma.$transaction(async (tx) => {
        if (is_active) {
          await tx.programme.updateMany({
            where: { user_id: userId, is_active: true },
            data: { is_active: false },
          });

          await tx.programmeActivityLog.updateMany({
            where: { user_id: userId, end_time: null },
            data: { end_time: new Date() },
          });
        }

        const newProgramme = await tx.programme.create({
          data: {
            id: (id as string) || undefined,
            name: name.trim(),
            description: (description as string) || null,
            user_id: userId,
            is_active: !!is_active,
          },
        });

        if (is_active) {
          await tx.programmeActivityLog.create({
            data: {
              programme_id: newProgramme.id,
              user_id: userId,
              start_time: new Date(),
            },
          });
        }

        return newProgramme;
      });

      return { body: programme, statusCode: HttpStatus.CREATED };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to create programme:", error);
      throwLegacyError("Failed to create programme", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Updates programme active state and related activity logs. */
  async updateActive(userId: string, programmeId: string, body: unknown) {
    try {
      const { is_active } = (body ?? {}) as UpdateProgrammeBody;

      if (typeof is_active !== "boolean") {
        throwLegacyError("Invalid is_active status", HttpStatus.BAD_REQUEST);
      }

      return await this.prisma.$transaction(async (tx) => {
        const existing = await tx.programme.findFirst({
          where: { id: programmeId, user_id: userId },
        });

        if (!existing) {
          throw new Error("Programme not found");
        }

        if (is_active) {
          await tx.programme.updateMany({
            where: { user_id: userId, id: { not: programmeId }, is_active: true },
            data: { is_active: false },
          });

          await tx.programmeActivityLog.updateMany({
            where: { user_id: userId, end_time: null },
            data: { end_time: new Date() },
          });

          await tx.programmeActivityLog.create({
            data: {
              programme_id: programmeId,
              user_id: userId,
              start_time: new Date(),
            },
          });
        } else if (existing.is_active) {
          await tx.programmeActivityLog.updateMany({
            where: { programme_id: programmeId, user_id: userId, end_time: null },
            data: { end_time: new Date() },
          });
        }

        return tx.programme.update({
          where: { id: programmeId },
          data: { is_active },
        });
      });
    } catch (error) {
      console.error("[PATCH_PROGRAMME_API_ERROR]:", error);
      if (error instanceof Error && error.message === "Programme not found") {
        throwLegacyError("Programme not found", HttpStatus.NOT_FOUND);
      }
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }
      throwLegacyError("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
