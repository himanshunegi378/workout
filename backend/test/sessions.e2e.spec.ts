import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LegacyExceptionFilter } from "../src/common/filters/legacy-exception.filter";
import { LoggingModule } from "../src/log/logging.module";
import { PrismaService } from "../src/prisma/prisma.service";

const prismaMock = {
  workoutSession: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
};

/** Builds a small Nest app for session timeline compatibility checks. */
async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [LoggingModule],
  })
    .overrideProvider(PrismaService)
    .useValue(prismaMock)
    .compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalFilters(new LegacyExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  );
  await app.init();
  return app;
}

describe("GET /api/log/sessions", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("returns sessions with pagination and the legacy Prisma query", async () => {
    const sessionDate = new Date("2026-05-31T10:00:00.000Z");
    prismaMock.workoutSession.findMany.mockResolvedValue([
      {
        id: "session-1",
        date: sessionDate,
        start_time: sessionDate,
        end_time: null,
        workout: { name: "Push", programme: { name: "PPL" } },
        sessionExerciseLogs: [],
      },
    ]);

    const response = await request(app.getHttpServer())
      .get("/api/log/sessions?limit=1&from=2026-06-01T00:00:00.000Z")
      .expect(HttpStatus.OK);

    expect(response.body.pagination).toEqual({
      from: sessionDate.toISOString(),
      to: sessionDate.toISOString(),
      hasMore: true,
    });
    expect(response.body.data).toHaveLength(1);
    expect(prismaMock.workoutSession.findMany).toHaveBeenCalledWith({
      where: {
        user_id: "user-1",
        date: { lt: new Date("2026-06-01T00:00:00.000Z") },
      },
      orderBy: { date: "desc" },
      take: 1,
      select: expect.objectContaining({
        id: true,
        date: true,
        start_time: true,
        end_time: true,
      }),
    });
  });

  it("returns empty pagination when no sessions exist", async () => {
    prismaMock.workoutSession.findMany.mockResolvedValue([]);

    const response = await request(app.getHttpServer())
      .get("/api/log/sessions")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      data: [],
      pagination: { from: null, to: null, hasMore: false },
    });
  });

  it("groups by date and filters sessions without valid exercise relations", async () => {
    const today = new Date();
    prismaMock.workoutSession.findMany.mockResolvedValue([
      {
        id: "with-exercise",
        date: today,
        start_time: today,
        end_time: null,
        workout: null,
        sessionExerciseLogs: [
          {
            id: "sel-1",
            exercise_with_metadata_id: null,
            exerciseLog: { exercise: { id: "exercise-1", name: "Squat", muscle_group: "Legs" } },
            exerciseWithMetadata: null,
          },
        ],
      },
      {
        id: "without-exercise",
        date: today,
        start_time: today,
        end_time: null,
        workout: null,
        sessionExerciseLogs: [{ id: "sel-2", exerciseLog: null, exerciseWithMetadata: null }],
      },
    ]);

    const response = await request(app.getHttpServer())
      .get("/api/log/sessions?grouped=true")
      .expect(HttpStatus.OK);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].label).toBe("Today");
    expect(response.body.data[0].sessions).toHaveLength(1);
    expect(response.body.data[0].sessions[0].id).toBe("with-exercise");
    expect(response.body.pagination.hasMore).toBe(false);
  });

  it("returns the legacy unauthorized response", async () => {
    process.env.AUTH_TEST_USER_ID = "";

    const response = await request(app.getHttpServer())
      .get("/api/log/sessions")
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual({ error: "Unauthorized" });
    expect(prismaMock.workoutSession.findMany).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/workout-sessions/:sessionId/finish", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("discards an empty owned session", async () => {
    prismaMock.workoutSession.findUnique.mockResolvedValue({
      _count: { sessionExerciseLogs: 0 },
    });
    prismaMock.workoutSession.delete.mockResolvedValue({ id: "session-1" });

    const response = await request(app.getHttpServer())
      .patch("/api/workout-sessions/session-1/finish")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      message: "Session discarded (zero sets logged)",
      discarded: true,
    });
    expect(prismaMock.workoutSession.findUnique).toHaveBeenCalledWith({
      where: { id: "session-1", user_id: "user-1" },
      select: {
        _count: {
          select: { sessionExerciseLogs: true },
        },
      },
    });
    expect(prismaMock.workoutSession.delete).toHaveBeenCalledWith({
      where: { id: "session-1" },
    });
    expect(prismaMock.workoutSession.update).not.toHaveBeenCalled();
  });

  it("sets end_time for a non-empty owned session", async () => {
    const updated = {
      id: "session-1",
      user_id: "user-1",
      workout_id: "workout-1",
      start_time: new Date("2026-05-31T09:00:00.000Z"),
      end_time: new Date("2026-05-31T10:00:00.000Z"),
      date: new Date("2026-05-31T09:00:00.000Z"),
    };
    prismaMock.workoutSession.findUnique.mockResolvedValue({
      _count: { sessionExerciseLogs: 2 },
    });
    prismaMock.workoutSession.update.mockResolvedValue(updated);

    const response = await request(app.getHttpServer())
      .patch("/api/workout-sessions/session-1/finish")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      ...JSON.parse(JSON.stringify(updated)),
      discarded: false,
    });
    expect(prismaMock.workoutSession.update).toHaveBeenCalledWith({
      where: { id: "session-1" },
      data: { end_time: expect.any(Date) },
    });
    expect(prismaMock.workoutSession.delete).not.toHaveBeenCalled();
  });

  it("returns legacy auth and not-found errors", async () => {
    process.env.AUTH_TEST_USER_ID = "";
    const unauthorized = await request(app.getHttpServer())
      .patch("/api/workout-sessions/session-1/finish")
      .expect(HttpStatus.UNAUTHORIZED);
    expect(unauthorized.body).toEqual({ error: "Unauthorized" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.workoutSession.findUnique.mockResolvedValueOnce(null);
    const notFound = await request(app.getHttpServer())
      .patch("/api/workout-sessions/missing/finish")
      .expect(HttpStatus.NOT_FOUND);
    expect(notFound.body).toEqual({ error: "Session not found" });
  });
});
