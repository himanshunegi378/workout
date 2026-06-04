import { HttpStatus, Injectable } from "@nestjs/common";
import { throwLegacyError } from "../common/utils/legacy-http";
import { PrismaService } from "../prisma/prisma.service";
import { FeedbackPayloadSchema } from "./feedback-validation";

/** Owns user-scoped feedback history and submissions. */
@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lists feedback submitted by the authenticated user. */
  async list(userId: string) {
    try {
      return await this.prisma.feedback.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          description: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to fetch feedback:", error);
      throwLegacyError("Failed to fetch feedback", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Stores a new feedback entry with the legacy Zod payload contract. */
  async submit(userId: string, body: unknown) {
    try {
      const result = FeedbackPayloadSchema.safeParse(body);

      if (!result.success) {
        throwLegacyError("Invalid payload", HttpStatus.BAD_REQUEST, result.error.format());
      }

      return await this.prisma.feedback.create({
        data: {
          description: result.data.description,
          user_id: userId,
        },
        select: {
          id: true,
          status: true,
          created_at: true,
        },
      });
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Failed to create feedback:", error);
      throwLegacyError("Failed to submit feedback", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
