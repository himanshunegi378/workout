import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LegacyExceptionFilter } from "../src/common/filters/legacy-exception.filter";
import { LoggingModule } from "../src/log/logging.module";
import { PrismaService } from "../src/prisma/prisma.service";

const prismaMock = {
  exercise: {
    findFirst: vi.fn(),
  },
  exerciseLog: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
  },
};

/** Builds a small Nest app for exercise history compatibility checks. */
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

describe("exercise history endpoints", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("GET /api/exercises/:exerciseId/last-log returns latest selected log", async () => {
    prismaMock.exercise.findFirst.mockResolvedValue({ id: "exercise-1", user_id: "user-1" });
    prismaMock.exerciseLog.findFirst.mockResolvedValue({ id: "log-1", weight: 90, reps: 8, rpe: null });

    const response = await request(app.getHttpServer())
      .get("/api/exercises/exercise-1/last-log")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({ id: "log-1", weight: 90, reps: 8, rpe: null });
    expect(prismaMock.exercise.findFirst).toHaveBeenCalledWith({
      where: {
        id: "exercise-1",
        OR: [{ user_id: "user-1" }, { is_global: true }],
      },
    });
    expect(prismaMock.exerciseLog.findFirst).toHaveBeenCalledWith({
      where: {
        user_id: "user-1",
        OR: [
          { exerciseId: "exercise-1" },
          {
            sessionExerciseLog: {
              exerciseWithMetadata: {
                exercise_id: "exercise-1",
              },
            },
          },
        ],
      },
      orderBy: { date: "desc" },
      select: { id: true, weight: true, reps: true, rpe: true },
    });
  });

  it("GET /api/exercises/:exerciseId/last-log returns null when no logs exist", async () => {
    prismaMock.exercise.findFirst.mockResolvedValue({ id: "exercise-1", user_id: "user-1" });
    prismaMock.exerciseLog.findFirst.mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .get("/api/exercises/exercise-1/last-log")
      .expect(HttpStatus.OK);

    expect(response.body).toBeNull();
  });

  it("GET /api/exercises/:exerciseId/last-log returns legacy auth and not-found errors", async () => {
    process.env.AUTH_TEST_USER_ID = "";

    const unauthorized = await request(app.getHttpServer())
      .get("/api/exercises/exercise-1/last-log")
      .expect(HttpStatus.UNAUTHORIZED);

    expect(unauthorized.body).toEqual({ error: "Unauthorized" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.exercise.findFirst.mockResolvedValue(null);

    const notFound = await request(app.getHttpServer())
      .get("/api/exercises/exercise-1/last-log")
      .expect(HttpStatus.NOT_FOUND);

    expect(notFound.body).toEqual({ error: "Exercise not found" });
  });

  it("GET /api/exercises/logs parses IDs, dates, and returns flattened logs", async () => {
    const sessionDate = new Date("2026-05-31T08:00:00.000Z");
    const startTime = new Date("2026-05-31T07:45:00.000Z");
    prismaMock.exerciseLog.findMany.mockResolvedValue([
      {
        id: "planned-log",
        exerciseId: null,
        weight: 100,
        reps: 5,
        rpe: 9,
        set_order_index: 0,
        pr_type: "WEIGHT_PR",
        date: new Date("2026-05-31T08:05:00.000Z"),
        sessionExerciseLog: {
          workoutSession: { date: sessionDate, start_time: startTime },
          exerciseWithMetadata: {
            exercise_id: "exercise-2",
            reps_min: 5,
            reps_max: 5,
            sets_min: 3,
            sets_max: 3,
            tempo: "3-1-1-0",
            rest_min: 180,
            rest_max: 240,
          },
        },
      },
      {
        id: "adhoc-log",
        exerciseId: "exercise-1",
        weight: 20,
        reps: 12,
        rpe: null,
        set_order_index: 1,
        pr_type: null,
        date: new Date("2026-05-30T08:05:00.000Z"),
        sessionExerciseLog: null,
      },
    ]);

    const response = await request(app.getHttpServer())
      .get("/api/exercises/logs?exerciseId=exercise-2,exercise-1&exerciseIds=exercise-2&from=2026-05-01&to=2026-05-31")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual([
      {
        id: "planned-log",
        exerciseId: "exercise-2",
        weight: 100,
        reps: 5,
        rpe: 9,
        set_order_index: 0,
        pr_type: "WEIGHT_PR",
        workoutSession: { date: sessionDate.toISOString(), start_time: startTime.toISOString() },
        exerciseWithMetadata: {
          reps_min: 5,
          reps_max: 5,
          sets_min: 3,
          sets_max: 3,
          tempo: "3-1-1-0",
          rest_min: 180,
          rest_max: 240,
        },
      },
      {
        id: "adhoc-log",
        exerciseId: "exercise-1",
        weight: 20,
        reps: 12,
        rpe: null,
        set_order_index: 1,
        pr_type: null,
        workoutSession: { date: "2026-05-30T08:05:00.000Z", start_time: null },
        exerciseWithMetadata: null,
      },
    ]);
    expect(prismaMock.exerciseLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          user_id: "user-1",
          AND: expect.arrayContaining([
            expect.objectContaining({
              OR: expect.arrayContaining([
                { exerciseId: { in: ["exercise-1", "exercise-2"] } },
              ]),
            }),
          ]),
        }),
      }),
    );
  });

  it("GET /api/exercises/logs returns legacy query validation errors", async () => {
    const missingId = await request(app.getHttpServer()).get("/api/exercises/logs").expect(HttpStatus.BAD_REQUEST);
    expect(missingId.body).toEqual({ error: "Missing exerciseId query parameter" });

    const invalidFrom = await request(app.getHttpServer())
      .get("/api/exercises/logs?exerciseId=exercise-1&from=not-a-date")
      .expect(HttpStatus.BAD_REQUEST);
    expect(invalidFrom.body).toEqual({ error: "Invalid `from` query parameter" });

    const invalidRange = await request(app.getHttpServer())
      .get("/api/exercises/logs?exerciseId=exercise-1&from=2026-06-01&to=2026-05-01")
      .expect(HttpStatus.BAD_REQUEST);
    expect(invalidRange.body).toEqual({ error: "`from` must be before or equal to `to`" });
  });
});
