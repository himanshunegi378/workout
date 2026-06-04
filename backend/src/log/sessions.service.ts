import { HttpStatus, Injectable } from "@nestjs/common";
import { throwLegacyError } from "../common/utils/legacy-http";
import { PrismaService } from "../prisma/prisma.service";

type SessionWithLogs = {
  id: string;
  date: Date;
  start_time: Date | null;
  end_time: Date | null;
  workout: {
    name: string;
    programme: { name: string };
  } | null;
  sessionExerciseLogs: Array<{
    id: string;
    exercise_with_metadata_id: string | null;
    exerciseLog: {
      exercise: unknown | null;
    } | null;
    exerciseWithMetadata: {
      exercise: unknown | null;
    } | null;
  }>;
};

/** Owns session timeline reads for workout history. */
@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lists sessions with legacy cursor and optional grouping behavior. */
  async list(userId: string, searchParams: URLSearchParams) {
    try {
      const grouped = searchParams.get("grouped") === "true";
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const fromDate = searchParams.get("from");

      const whereClause: { user_id: string; date?: { lt: Date } } = {
        user_id: userId,
      };

      if (fromDate) {
        whereClause.date = { lt: new Date(fromDate) };
      }

      const sessions = await this.prisma.workoutSession.findMany({
        where: whereClause,
        orderBy: { date: "desc" },
        take: limit,
        select: {
          id: true,
          date: true,
          start_time: true,
          end_time: true,
          workout: {
            select: {
              name: true,
              programme: {
                select: { name: true },
              },
            },
          },
          sessionExerciseLogs: {
            select: {
              id: true,
              exercise_with_metadata_id: true,
              exerciseLog: {
                select: {
                  id: true,
                  weight: true,
                  reps: true,
                  rpe: true,
                  set_order_index: true,
                  pr_type: true,
                  user_id: true,
                  date: true,
                  exerciseId: true,
                  exercise: {
                    select: {
                      id: true,
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
                      id: true,
                      name: true,
                      muscle_group: true,
                    },
                  },
                },
              },
            },
          },
        },
      }) as SessionWithLogs[];

      const pagination = {
        from: sessions.length > 0 ? sessions[0].date.toISOString() : null,
        to: sessions.length > 0 ? sessions[sessions.length - 1].date.toISOString() : null,
        hasMore: sessions.length === limit,
      };

      if (grouped) {
        return { data: this.groupByDate(sessions), pagination };
      }

      return { data: sessions, pagination };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Error fetching sessions:", error);
      throwLegacyError("Failed to fetch sessions", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Finishes a non-empty session or discards an empty one. */
  async finish(userId: string, sessionId: string) {
    try {
      const sessionWithLogs = await this.prisma.workoutSession.findUnique({
        where: { id: sessionId, user_id: userId },
        select: {
          _count: {
            select: { sessionExerciseLogs: true },
          },
        },
      });

      if (!sessionWithLogs) {
        throwLegacyError("Session not found", HttpStatus.NOT_FOUND);
      }

      if (sessionWithLogs._count.sessionExerciseLogs === 0) {
        await this.prisma.workoutSession.delete({
          where: { id: sessionId },
        });

        return {
          message: "Session discarded (zero sets logged)",
          discarded: true,
        };
      }

      const updatedSession = await this.prisma.workoutSession.update({
        where: { id: sessionId },
        data: { end_time: new Date() },
      });

      return {
        ...updatedSession,
        discarded: false,
      };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("[FINISH_SESSION_API_ERROR]:", error);
      throwLegacyError("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private groupByDate(sessions: SessionWithLogs[]) {
    const map = new Map<string, { label: string; sessions: SessionWithLogs[] }>();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toISOString().split("T")[0];
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    for (const session of sessions) {
      const hasLogs = session.sessionExerciseLogs.some((sel) =>
        sel.exerciseWithMetadata?.exercise || sel.exerciseLog?.exercise);
      if (!hasLogs) continue;

      const date = new Date(session.date);
      const key = date.toISOString().split("T")[0];

      let label: string;
      if (key === todayStr) {
        label = "Today";
      } else if (key === yesterdayStr) {
        label = "Yesterday";
      } else {
        label = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }

      if (!map.has(key)) {
        map.set(key, { label, sessions: [] });
      }
      map.get(key)!.sessions.push(session);
    }

    return Array.from(map.values());
  }
}
