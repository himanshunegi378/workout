import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsModule } from "../src/analytics/analytics.module";
import { LegacyExceptionFilter } from "../src/common/filters/legacy-exception.filter";
import { PrismaService } from "../src/prisma/prisma.service";

const prismaMock = {
  exerciseLog: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
  },
  workoutSession: {
    findMany: vi.fn(),
  },
  exercise_analytics_view: {
    findMany: vi.fn(),
  },
  $queryRaw: vi.fn(),
};

/** Builds a small Nest app for analytics compatibility checks. */
async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AnalyticsModule],
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

describe("GET /api/log/volume", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("returns legacy unauthorized response", async () => {
    process.env.AUTH_TEST_USER_ID = "";

    const response = await request(app.getHttpServer())
      .get("/api/log/volume")
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual({ error: "Unauthorized" });
    expect(prismaMock.workoutSession.findMany).not.toHaveBeenCalled();
  });

  it("returns chronological volume points grouped by date, workout, and muscle", async () => {
    prismaMock.workoutSession.findMany.mockResolvedValue([
      {
        date: new Date("2026-05-30T12:00:00.000Z"),
        workout: null,
        sessionExerciseLogs: [
          {
            exerciseLog: {
              weight: 50,
              reps: 10,
              exercise: { name: "Goblet Squat", muscle_group: "Legs" },
            },
            exerciseWithMetadata: null,
          },
        ],
      },
      {
        date: new Date("2026-05-31T12:00:00.000Z"),
        workout: { id: "workout-1", name: "Push" },
        sessionExerciseLogs: [
          {
            exerciseLog: {
              weight: 100,
              reps: 5,
              exercise: null,
            },
            exerciseWithMetadata: {
              exercise: { name: "Bench", muscle_group: "Chest" },
            },
          },
          {
            exerciseLog: {
              weight: 40,
              reps: 10,
              exercise: { name: "Dumbbell Press", muscle_group: "Chest" },
            },
            exerciseWithMetadata: null,
          },
          {
            exerciseLog: {
              weight: 0,
              reps: 10,
              exercise: { name: "Zero", muscle_group: "Chest" },
            },
            exerciseWithMetadata: null,
          },
        ],
      },
    ]);

    const response = await request(app.getHttpServer())
      .get("/api/log/volume")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual([
      {
        date: "2026-05-30",
        workoutId: "adhoc",
        workoutName: "Ad-hoc Session",
        muscleGroup: "Legs",
        volume: 500,
        exercises: [{ name: "Goblet Squat", volume: 500 }],
      },
      {
        date: "2026-05-31",
        workoutId: "workout-1",
        workoutName: "Push",
        muscleGroup: "Chest",
        volume: 900,
        exercises: [
          { name: "Bench", volume: 500 },
          { name: "Dumbbell Press", volume: 400 },
        ],
      },
    ]);
    expect(prismaMock.workoutSession.findMany).toHaveBeenCalledWith({
      where: { user_id: "user-1" },
      select: expect.objectContaining({
        date: true,
        workout: {
          select: {
            id: true,
            name: true,
          },
        },
      }),
      orderBy: { date: "asc" },
    });
  });
});

describe("POST /api/analytics/query", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.$queryRaw.mockResolvedValue([
      { muscle_group: "Chest", total_volume: 1000n },
    ]);
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("returns meta and serialized data for a valid analytics query", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/analytics/query")
      .send({
        metrics: [{ field: "volume", aggregation: "sum", alias: "total_volume" }],
        dimensions: ["muscle_group"],
        filters: [{ field: "session_date", operator: ">=", value: "2026-05-01" }],
        order_by: [{ field: "total_volume", direction: "desc" }],
      })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      meta: {
        dimensions: ["muscle_group"],
        metrics: ["total_volume"],
      },
      data: [{ muscle_group: "Chest", total_volume: 1000 }],
    });
    expect(prismaMock.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it("applies legacy Zod defaults to optional fields", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/analytics/query")
      .send({
        metrics: [{ field: "reps", aggregation: "count", alias: "sets" }],
      })
      .expect(HttpStatus.OK);

    expect(response.body.meta).toEqual({
      dimensions: [],
      metrics: ["sets"],
    });
  });

  it("returns legacy auth and validation errors with details", async () => {
    process.env.AUTH_TEST_USER_ID = "";
    const unauthorized = await request(app.getHttpServer())
      .post("/api/analytics/query")
      .send({ metrics: [{ field: "volume", aggregation: "sum", alias: "total" }] })
      .expect(HttpStatus.UNAUTHORIZED);
    expect(unauthorized.body).toEqual({ error: "Unauthorized" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    const invalid = await request(app.getHttpServer())
      .post("/api/analytics/query")
      .send({ metrics: [{ field: "volume", aggregation: "median", alias: "total" }] })
      .expect(HttpStatus.BAD_REQUEST);

    expect(invalid.body.error).toBe("Invalid payload");
    expect(invalid.body.details).toBeDefined();
    expect(prismaMock.$queryRaw).not.toHaveBeenCalled();
  });
});

describe("GET /api/analytics/activity-heatmap", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.$queryRaw.mockResolvedValue([
      { date: "2026-05-28", count: 4n },
      { date: "2026-05-30", count: 6n },
    ]);
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("returns legacy unauthorized response", async () => {
    process.env.AUTH_TEST_USER_ID = "";

    const response = await request(app.getHttpServer())
      .get("/api/analytics/activity-heatmap")
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual({ error: "Unauthorized" });
    expect(prismaMock.$queryRaw).not.toHaveBeenCalled();
  });

  it("returns date strings and serialized exercise counts", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/analytics/activity-heatmap")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      data: [
        { date: "2026-05-28", count: 4 },
        { date: "2026-05-30", count: 6 },
      ],
    });
    expect(prismaMock.$queryRaw).toHaveBeenCalledTimes(1);
  });
});

describe("GET /api/analytics/fatigue", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.exerciseLog.findFirst.mockResolvedValue(null);
    prismaMock.exerciseLog.findMany.mockResolvedValue([]);
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("returns legacy unauthorized response", async () => {
    process.env.AUTH_TEST_USER_ID = "";

    const response = await request(app.getHttpServer())
      .get("/api/analytics/fatigue")
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual({ error: "Unauthorized" });
    expect(prismaMock.exerciseLog.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.exerciseLog.findMany).not.toHaveBeenCalled();
  });

  it("returns a 30-day calibrating series by default", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/analytics/fatigue")
      .expect(HttpStatus.OK);

    expect(response.body.timeSeries).toHaveLength(30);
    expect(response.body.hasMoreHistory).toBe(false);
    expect(response.body.timeSeries[0]).toMatchObject({
      date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      acuteLoad: 0,
      chronicLoad: 0,
      ratio: 0,
      isCalibrating: true,
    });
    expect(prismaMock.exerciseLog.findFirst).toHaveBeenCalledWith({
      where: { user_id: "user-1" },
      orderBy: { date: "asc" },
      select: { date: true },
    });
  });

  it("applies query params and excludes cardio logs from the source query", async () => {
    prismaMock.exerciseLog.findFirst.mockResolvedValue({ date: new Date("2026-04-01T12:00:00.000Z") });
    prismaMock.exerciseLog.findMany.mockResolvedValue([
      { date: new Date("2026-05-30T12:00:00.000Z") },
      { date: new Date("2026-05-30T13:00:00.000Z") },
    ]);

    const response = await request(app.getHttpServer())
      .get("/api/analytics/fatigue?endDate=2026-05-30T15:30:00.000Z&days=7")
      .expect(HttpStatus.OK);

    const todayEntry = response.body.timeSeries.find((point: { date: string }) => point.date === "2026-05-30");
    expect(response.body.timeSeries).toHaveLength(7);
    expect(response.body.hasMoreHistory).toBe(true);
    expect(todayEntry).toMatchObject({
      acuteLoad: expect.any(Number),
      chronicLoad: expect.any(Number),
      ratio: expect.any(Number),
      isCalibrating: false,
    });
    expect(todayEntry.acuteLoad).toBeGreaterThan(0);
    expect(prismaMock.exerciseLog.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        user_id: "user-1",
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
      }),
      select: { date: true },
    }));
  });
});

describe("GET /api/analytics/session-volume", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.exercise_analytics_view.findMany.mockResolvedValue([]);
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("returns legacy unauthorized and missing workout errors", async () => {
    process.env.AUTH_TEST_USER_ID = "";

    const unauthorized = await request(app.getHttpServer())
      .get("/api/analytics/session-volume?workoutId=workout-1")
      .expect(HttpStatus.UNAUTHORIZED);
    expect(unauthorized.body).toEqual({ error: "Unauthorized" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    const missingWorkout = await request(app.getHttpServer())
      .get("/api/analytics/session-volume")
      .expect(HttpStatus.BAD_REQUEST);
    expect(missingWorkout.body).toEqual({ error: "Missing workoutId parameter" });
  });

  it("returns an empty array when no analytics logs exist", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/analytics/session-volume?workoutId=workout-1")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual([]);
    expect(prismaMock.exercise_analytics_view.findMany).toHaveBeenCalledWith({
      where: {
        user_id: "user-1",
        workout_id: "workout-1",
        muscle_group: { not: "Cardio" },
      },
      orderBy: {
        session_date: "asc",
      },
    });
  });

  it("groups logs by session, rounds deltas, applies statuses, and limits recent results", async () => {
    prismaMock.exercise_analytics_view.findMany.mockResolvedValue([
      {
        workout_session_id: "s1",
        session_date: new Date("2026-05-01T12:00:00.000Z"),
        volume: 1000,
      },
      {
        workout_session_id: "s2",
        session_date: new Date("2026-05-08T12:00:00.000Z"),
        volume: 1020,
      },
      {
        workout_session_id: "s2",
        session_date: new Date("2026-05-08T13:00:00.000Z"),
        volume: 30,
      },
      {
        workout_session_id: "s3",
        session_date: new Date("2026-05-15T12:00:00.000Z"),
        volume: 1200,
      },
      {
        workout_session_id: "s4",
        session_date: new Date("2026-05-22T12:00:00.000Z"),
        volume: 900,
      },
    ]);

    const response = await request(app.getHttpServer())
      .get("/api/analytics/session-volume?workoutId=workout-1&limit=3")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual([
      {
        id: "s2",
        date: "2026-05-08T13:00:00.000Z",
        volume: 1050,
        deltaPercentage: 5,
        status: "optimal",
      },
      {
        id: "s3",
        date: "2026-05-15T12:00:00.000Z",
        volume: 1200,
        deltaPercentage: 14.3,
        status: "warning",
      },
      {
        id: "s4",
        date: "2026-05-22T12:00:00.000Z",
        volume: 900,
        deltaPercentage: -25,
        status: "deload",
      },
    ]);
  });
});
