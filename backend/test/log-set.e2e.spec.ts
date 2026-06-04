import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LegacyExceptionFilter } from "../src/common/filters/legacy-exception.filter";
import { LoggingModule } from "../src/log/logging.module";
import { PrismaService } from "../src/prisma/prisma.service";

const txMock = {
  exerciseLog: {
    create: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
  },
  sessionExerciseLog: {
    create: vi.fn(),
    count: vi.fn(),
  },
  workoutSession: {
    delete: vi.fn(),
  },
};

const prismaMock = {
  exercise: {
    findFirst: vi.fn(),
  },
  exerciseLog: {
    findUnique: vi.fn(),
    aggregate: vi.fn(),
    update: vi.fn(),
  },
  workoutSession: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  $transaction: vi.fn(),
};

/** Builds a small Nest app for set logging compatibility checks. */
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

describe("/api/log/set", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.exercise.findFirst.mockResolvedValue({ id: "exercise-1" });
    prismaMock.exerciseLog.findUnique.mockResolvedValue(null);
    prismaMock.exerciseLog.aggregate.mockResolvedValue({ _max: { weight: null, reps: null } });
    prismaMock.workoutSession.findFirst.mockResolvedValue(null);
    prismaMock.workoutSession.create.mockResolvedValue({ id: "session-1" });
    txMock.exerciseLog.create.mockResolvedValue({
      id: "log-1",
      user_id: "user-1",
      exerciseId: "exercise-1",
      weight: 100,
      reps: 5,
      rpe: 8,
      set_order_index: 0,
      pr_type: null,
    });
    txMock.sessionExerciseLog.create.mockResolvedValue({ id: "sel_log-1" });
    txMock.exerciseLog.findUnique.mockResolvedValue({
      id: "log-1",
      user_id: "user-1",
      sessionExerciseLog: { workout_session_id: "session-1" },
    });
    txMock.exerciseLog.delete.mockResolvedValue({ id: "log-1" });
    txMock.sessionExerciseLog.count.mockResolvedValue(1);
    txMock.workoutSession.delete.mockResolvedValue({ id: "session-1" });
    prismaMock.$transaction.mockImplementation((callback: (tx: typeof txMock) => unknown) => callback(txMock));
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("POST creates a set, session, and session log with legacy parsing", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/log/set")
      .send({
        id: "log-1",
        workoutId: "workout-1",
        exerciseWithMetadataId: "ewm-1",
        exerciseId: "exercise-1",
        setOrderIndex: 0,
        weight: "100",
        reps: "5",
        rpe: "8",
        date: "2026-05-31T10:30:00.000Z",
      })
      .expect(HttpStatus.CREATED);

    expect(response.body).toMatchObject({ id: "log-1", pr_type: null, pr: null });
    expect(prismaMock.workoutSession.findFirst).toHaveBeenCalledWith({
      where: {
        user_id: "user-1",
        workout_id: "workout-1",
        date: {
          gte: expect.any(Date),
          lt: expect.any(Date),
        },
      },
    });
    expect(txMock.exerciseLog.create).toHaveBeenCalledWith({
      data: {
        id: "log-1",
        user_id: "user-1",
        exerciseId: "exercise-1",
        set_order_index: 0,
        weight: 100,
        reps: 5,
        rpe: 8,
        date: new Date("2026-05-31T10:30:00.000Z"),
        pr_type: null,
      },
    });
    expect(txMock.sessionExerciseLog.create).toHaveBeenCalledWith({
      data: {
        id: "sel_log-1",
        workout_session_id: "session-1",
        exercise_with_metadata_id: "ewm-1",
        user_id: "user-1",
        exercise_log_id: "log-1",
      },
    });
  });

  it("POST returns existing owned client ID replay with 200 and pr alias", async () => {
    prismaMock.exerciseLog.findUnique.mockResolvedValue({
      id: "log-1",
      user_id: "user-1",
      pr_type: "weight",
      sessionExerciseLog: { id: "sel_log-1" },
    });

    const response = await request(app.getHttpServer())
      .post("/api/log/set")
      .send({ id: "log-1", setOrderIndex: 0, reps: "5" })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      id: "log-1",
      user_id: "user-1",
      pr_type: "weight",
      sessionExerciseLog: { id: "sel_log-1" },
      pr: "weight",
    });
    expect(txMock.exerciseLog.create).not.toHaveBeenCalled();
  });

  it("POST validates auth, required fields, exercise scope, and id collisions", async () => {
    process.env.AUTH_TEST_USER_ID = "";
    const unauthorized = await request(app.getHttpServer())
      .post("/api/log/set")
      .send({ setOrderIndex: 0, reps: "5" })
      .expect(HttpStatus.UNAUTHORIZED);
    expect(unauthorized.body).toEqual({ error: "Unauthorized" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    const missing = await request(app.getHttpServer())
      .post("/api/log/set")
      .send({ setOrderIndex: 0 })
      .expect(HttpStatus.BAD_REQUEST);
    expect(missing.body).toEqual({ error: "Missing required fields" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.exercise.findFirst.mockResolvedValueOnce(null);
    const missingExercise = await request(app.getHttpServer())
      .post("/api/log/set")
      .send({ setOrderIndex: 0, reps: "5", exerciseId: "foreign" })
      .expect(HttpStatus.NOT_FOUND);
    expect(missingExercise.body).toEqual({ error: "Exercise not found" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.exerciseLog.findUnique.mockResolvedValueOnce({ id: "log-1", user_id: "other", pr_type: null });
    const forbidden = await request(app.getHttpServer())
      .post("/api/log/set")
      .send({ id: "log-1", setOrderIndex: 0, reps: "5" })
      .expect(HttpStatus.FORBIDDEN);
    expect(forbidden.body).toEqual({ error: "Forbidden" });
  });

  it("POST reuses an ad-hoc day session and records PR updates", async () => {
    prismaMock.workoutSession.findFirst.mockResolvedValue({ id: "session-existing" });
    prismaMock.exerciseLog.aggregate.mockResolvedValue({ _max: { weight: 90, reps: 5 } });
    prismaMock.exerciseLog.update.mockResolvedValue({ id: "log-1", pr_type: "weight" });

    const response = await request(app.getHttpServer())
      .post("/api/log/set")
      .send({ exerciseId: "exercise-1", setOrderIndex: 0, reps: "5", weight: "100" })
      .expect(HttpStatus.CREATED);

    expect(response.body.pr_type).toBe("weight");
    expect(prismaMock.workoutSession.create).not.toHaveBeenCalled();
    expect(prismaMock.workoutSession.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ user_id: "user-1" }),
        orderBy: { workout_id: { sort: "desc", nulls: "last" } },
      }),
    );
    expect(prismaMock.exerciseLog.update).toHaveBeenCalledWith({
      where: { id: "log-1" },
      data: { pr_type: "weight" },
    });
  });

  it("DELETE removes a set and purges an empty session", async () => {
    txMock.sessionExerciseLog.count.mockResolvedValue(0);

    const response = await request(app.getHttpServer())
      .delete("/api/log/set?setId=log-1")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({ message: "Set deleted and empty session purged", sessionPurged: true });
    expect(txMock.exerciseLog.delete).toHaveBeenCalledWith({ where: { id: "log-1" } });
    expect(txMock.workoutSession.delete).toHaveBeenCalledWith({ where: { id: "session-1" } });
  });

  it("DELETE returns legacy validation, not-found, and ownership errors", async () => {
    const missingId = await request(app.getHttpServer()).delete("/api/log/set").expect(HttpStatus.BAD_REQUEST);
    expect(missingId.body).toEqual({ error: "Set ID is required" });

    txMock.exerciseLog.findUnique.mockResolvedValueOnce(null);
    const notFound = await request(app.getHttpServer()).delete("/api/log/set?setId=missing").expect(HttpStatus.NOT_FOUND);
    expect(notFound.body).toEqual({ error: "Set not found" });

    txMock.exerciseLog.findUnique.mockResolvedValueOnce({ id: "log-1", user_id: "other", sessionExerciseLog: null });
    const forbidden = await request(app.getHttpServer()).delete("/api/log/set?setId=log-1").expect(HttpStatus.FORBIDDEN);
    expect(forbidden.body).toEqual({ error: "Unauthorized" });
  });

  it("PATCH updates set values without PR recalculation", async () => {
    prismaMock.exerciseLog.findUnique.mockResolvedValue({ id: "log-1", user_id: "user-1", pr_type: "weight" });
    prismaMock.exerciseLog.update.mockResolvedValue({
      id: "log-1",
      user_id: "user-1",
      weight: 60,
      reps: 8,
      rpe: null,
      pr_type: "weight",
    });

    const response = await request(app.getHttpServer())
      .patch("/api/log/set")
      .send({ setId: "log-1", weight: "60", reps: "8", rpe: "" })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      id: "log-1",
      user_id: "user-1",
      weight: 60,
      reps: 8,
      rpe: null,
      pr_type: "weight",
    });
    expect(prismaMock.exerciseLog.update).toHaveBeenCalledWith({
      where: { id: "log-1" },
      data: { weight: 60, reps: 8, rpe: null },
    });
    expect(prismaMock.exerciseLog.aggregate).not.toHaveBeenCalled();
  });

  it("PATCH returns legacy validation, not-found, and ownership errors", async () => {
    const missing = await request(app.getHttpServer())
      .patch("/api/log/set")
      .send({ setId: "log-1" })
      .expect(HttpStatus.BAD_REQUEST);
    expect(missing.body).toEqual({ error: "Missing required fields" });

    prismaMock.exerciseLog.findUnique.mockResolvedValueOnce(null);
    const notFound = await request(app.getHttpServer())
      .patch("/api/log/set")
      .send({ setId: "missing", reps: "5" })
      .expect(HttpStatus.NOT_FOUND);
    expect(notFound.body).toEqual({ error: "Set not found" });

    prismaMock.exerciseLog.findUnique.mockResolvedValueOnce({ id: "log-1", user_id: "other" });
    const forbidden = await request(app.getHttpServer())
      .patch("/api/log/set")
      .send({ setId: "log-1", reps: "5" })
      .expect(HttpStatus.FORBIDDEN);
    expect(forbidden.body).toEqual({ error: "Unauthorized" });
  });
});
