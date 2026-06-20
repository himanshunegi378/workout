import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LegacyExceptionFilter } from "../src/common/filters/legacy-exception.filter";
import { PrismaService } from "../src/prisma/prisma.service";
import { WorkoutsModule } from "../src/workouts/workouts.module";

const prismaMock = {
  programme: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
  },
  workout: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  workoutSession: {
    findFirst: vi.fn(),
  },
  exercise: {
    findFirst: vi.fn(),
  },
  exerciseWithMetadata: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    aggregate: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  $transaction: vi.fn(),
};

/** Builds a small Nest app for workout endpoint compatibility checks. */
async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [WorkoutsModule],
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

describe("POST /api/programmes/:programmeId/workouts", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.programme.findFirst.mockResolvedValue({
      id: "programme-1",
      user_id: "user-1",
      _count: { workouts: 2 },
    });
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("creates a workout with programme count as order_index", async () => {
    const created = {
      id: "workout-1",
      name: "Push",
      description: null,
      programme_id: "programme-1",
      order_index: 2,
    };
    prismaMock.workout.findUnique.mockResolvedValue(null);
    prismaMock.workout.create.mockResolvedValue(created);

    const response = await request(app.getHttpServer())
      .post("/api/programmes/programme-1/workouts")
      .send({ id: "workout-1", name: "  Push  ", description: "" })
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual(created);
    expect(prismaMock.programme.findFirst).toHaveBeenCalledWith({
      where: { id: "programme-1", user_id: "user-1" },
      include: {
        _count: {
          select: { workouts: true },
        },
      },
    });
    expect(prismaMock.workout.create).toHaveBeenCalledWith({
      data: {
        id: "workout-1",
        name: "Push",
        description: null,
        programme_id: "programme-1",
        order_index: 2,
      },
    });
  });

  it("returns legacy auth, not-found, and validation errors", async () => {
    process.env.AUTH_TEST_USER_ID = "";
    const unauthorized = await request(app.getHttpServer())
      .post("/api/programmes/programme-1/workouts")
      .send({ name: "Push" })
      .expect(HttpStatus.UNAUTHORIZED);
    expect(unauthorized.body).toEqual({ error: "Unauthorized" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.programme.findFirst.mockResolvedValueOnce(null);
    const notFound = await request(app.getHttpServer())
      .post("/api/programmes/missing/workouts")
      .send({ name: "Push" })
      .expect(HttpStatus.NOT_FOUND);
    expect(notFound.body).toEqual({ error: "Programme not found" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    const missingName = await request(app.getHttpServer())
      .post("/api/programmes/programme-1/workouts")
      .send({})
      .expect(HttpStatus.BAD_REQUEST);
    expect(missingName.body).toEqual({ error: "Workout name is required" });
  });

  it("returns owned existing workout for idempotent replay", async () => {
    const existing = {
      id: "workout-1",
      name: "Existing",
      description: null,
      programme_id: "programme-2",
      order_index: 0,
    };
    prismaMock.workout.findUnique.mockResolvedValue(existing);
    prismaMock.programme.findUnique.mockResolvedValue({ id: "programme-2", user_id: "user-1" });

    const response = await request(app.getHttpServer())
      .post("/api/programmes/programme-1/workouts")
      .send({ id: "workout-1", name: "Existing" })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(existing);
    expect(prismaMock.workout.create).not.toHaveBeenCalled();
  });

  it("rejects foreign existing workout ID collisions", async () => {
    prismaMock.workout.findUnique.mockResolvedValue({
      id: "workout-1",
      programme_id: "foreign-programme",
    });
    prismaMock.programme.findUnique.mockResolvedValue({ id: "foreign-programme", user_id: "other-user" });

    const response = await request(app.getHttpServer())
      .post("/api/programmes/programme-1/workouts")
      .send({ id: "workout-1", name: "Push" })
      .expect(HttpStatus.FORBIDDEN);

    expect(response.body).toEqual({ error: "Forbidden" });
  });
});

describe("GET /api/workouts", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("lists user workouts with programme names ordered by programme and order index", async () => {
    const workouts = [
      { id: "workout-1", name: "Day A", programme: { name: "Alpha" } },
      { id: "workout-2", name: "Day B", programme: { name: "Beta" } },
    ];
    prismaMock.workout.findMany.mockResolvedValue(workouts);

    const response = await request(app.getHttpServer())
      .get("/api/workouts")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(workouts);
    expect(prismaMock.workout.findMany).toHaveBeenCalledWith({
      where: {
        programme: { user_id: "user-1" },
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
  });

  it("adds active programme filter only when active exactly equals true", async () => {
    prismaMock.workout.findMany.mockResolvedValue([]);

    await request(app.getHttpServer())
      .get("/api/workouts?active=true")
      .expect(HttpStatus.OK);

    expect(prismaMock.workout.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: {
          programme: { user_id: "user-1", is_active: true },
        },
      }),
    );

    await request(app.getHttpServer())
      .get("/api/workouts?active=1")
      .expect(HttpStatus.OK);

    expect(prismaMock.workout.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: {
          programme: { user_id: "user-1" },
        },
      }),
    );
  });

  it("returns the legacy unauthorized response", async () => {
    process.env.AUTH_TEST_USER_ID = "";

    const response = await request(app.getHttpServer())
      .get("/api/workouts")
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual({ error: "Unauthorized" });
    expect(prismaMock.workout.findMany).not.toHaveBeenCalled();
  });
});

describe("GET /api/programmes/:programmeId/workouts/:workoutId/details", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("returns workout details, today's session, and previous logs by exercise", async () => {
    const activeSession = {
      id: "session-today",
      sessionExerciseLogs: [
        {
          id: "sel-1",
          exercise_with_metadata_id: "ewm-1",
          exerciseLog: {
            id: "log-today",
            exerciseId: "exercise-1",
            weight: 90,
            reps: 8,
            rpe: null,
            set_order_index: 0,
            user_id: "user-1",
            date: new Date("2026-05-31T10:00:00Z"),
            pr_type: null,
          },
        },
      ],
    };
    const workoutData = {
      id: "workout-1",
      name: "Push",
      exercisesWithMetadata: [
        {
          id: "ewm-1",
          exercise_id: "exercise-1",
          sets_min: 3,
          sets_max: 4,
          reps_min: 8,
          reps_max: 12,
          rest_min: 60,
          rest_max: 90,
          tempo: "3-1-2-0",
          exercise: {
            id: "exercise-1",
            name: "Bench",
            muscle_group: "Chest",
            exerciseLogs: [
              {
                id: "older-set-2",
                weight: 80,
                reps: 9,
                rpe: 8,
                set_order_index: 1,
                sessionExerciseLog: { workout_session_id: "previous-session" },
              },
              {
                id: "older-set-1",
                weight: 80,
                reps: 10,
                rpe: 8,
                set_order_index: 0,
                sessionExerciseLog: { workout_session_id: "previous-session" },
              },
              {
                id: "different-session",
                weight: 75,
                reps: 10,
                rpe: null,
                set_order_index: 0,
                sessionExerciseLog: { workout_session_id: "older-session" },
              },
            ],
          },
        },
      ],
      workoutSessions: [activeSession],
    };
    prismaMock.workout.findFirst.mockResolvedValue(workoutData);

    const response = await request(app.getHttpServer())
      .get("/api/programmes/programme-1/workouts/workout-1/details")
      .expect(HttpStatus.OK);

    expect(response.body.workout.id).toBe("workout-1");
    expect(response.body.session.id).toBe("session-today");
    expect(response.body.previousLogsByExercise).toEqual({
      "exercise-1": [
        { id: "older-set-1", weight: 80, reps: 10, rpe: 8, set_order_index: 0 },
        { id: "older-set-2", weight: 80, reps: 9, rpe: 8, set_order_index: 1 },
      ],
    });
    expect(response.body.workout.exercisesWithMetadata[0].exercise.exerciseLogs).toHaveLength(3);
    expect(prismaMock.workout.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "workout-1",
          programme: { id: "programme-1", user_id: "user-1" },
        },
        relationLoadStrategy: "join",
      }),
    );
  });

  it("returns null session and empty previous logs when no session/logs exist", async () => {
    prismaMock.workout.findFirst.mockResolvedValue({
      id: "workout-1",
      name: "Push",
      exercisesWithMetadata: [],
      workoutSessions: [],
    });

    const response = await request(app.getHttpServer())
      .get("/api/programmes/programme-1/workouts/workout-1/details")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      workout: { id: "workout-1", name: "Push", exercisesWithMetadata: [] },
      session: null,
      previousLogsByExercise: {},
    });
  });

  it("returns legacy auth and not-found errors", async () => {
    process.env.AUTH_TEST_USER_ID = "";
    const unauthorized = await request(app.getHttpServer())
      .get("/api/programmes/programme-1/workouts/workout-1/details")
      .expect(HttpStatus.UNAUTHORIZED);
    expect(unauthorized.body).toEqual({ error: "Unauthorized" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.workout.findFirst.mockResolvedValue(null);
    const notFound = await request(app.getHttpServer())
      .get("/api/programmes/programme-1/workouts/missing/details")
      .expect(HttpStatus.NOT_FOUND);
    expect(notFound.body).toEqual({ error: "Workout not found" });
  });
});

describe("POST /api/programmes/:programmeId/workouts/:workoutId/exercises", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.workout.findFirst.mockResolvedValue({
      id: "workout-1",
      programme_id: "programme-1",
      _count: { exercisesWithMetadata: 1 },
    });
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("creates exercise metadata with max order_index plus one", async () => {
    const created = {
      id: "ewm-1",
      exercise_id: "exercise-1",
      workout_id: "workout-1",
      sets_min: 3,
      sets_max: 4,
      reps_min: 8,
      reps_max: 12,
      rest_min: 60,
      rest_max: 90,
      tempo: "3-1-2-0",
      order_index: 3,
    };
    prismaMock.exerciseWithMetadata.findUnique.mockResolvedValue(null);
    prismaMock.exercise.findFirst.mockResolvedValue({ id: "exercise-1" });
    prismaMock.exerciseWithMetadata.aggregate.mockResolvedValue({ _max: { order_index: 2 } });
    prismaMock.exerciseWithMetadata.create.mockResolvedValue(created);

    const response = await request(app.getHttpServer())
      .post("/api/programmes/programme-1/workouts/workout-1/exercises")
      .send({
        id: "ewm-1",
        exercise_id: "exercise-1",
        sets_min: 3,
        sets_max: 4,
        reps_min: 8,
        reps_max: 12,
        rest_min: 60,
        rest_max: 90,
        tempo: "3-1-2-0",
      })
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual(created);
    expect(prismaMock.workout.findFirst).toHaveBeenCalledWith({
      where: {
        id: "workout-1",
        programme: { id: "programme-1", user_id: "user-1" },
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
    expect(prismaMock.exerciseWithMetadata.aggregate).toHaveBeenCalledWith({
      where: { workout_id: "workout-1" },
      _max: { order_index: true },
    });
    expect(prismaMock.exerciseWithMetadata.create).toHaveBeenCalledWith({
      data: {
        id: "ewm-1",
        exercise_id: "exercise-1",
        workout_id: "workout-1",
        sets_min: 3,
        sets_max: 4,
        reps_min: 8,
        reps_max: 12,
        rest_min: 60,
        rest_max: 90,
        tempo: "3-1-2-0",
        order_index: 3,
      },
    });
  });

  it("returns legacy auth, workout, and exercise validation errors", async () => {
    process.env.AUTH_TEST_USER_ID = "";
    const unauthorized = await request(app.getHttpServer())
      .post("/api/programmes/programme-1/workouts/workout-1/exercises")
      .send({ exercise_id: "exercise-1" })
      .expect(HttpStatus.UNAUTHORIZED);
    expect(unauthorized.body).toEqual({ error: "Unauthorized" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.workout.findFirst.mockResolvedValueOnce(null);
    const missingWorkout = await request(app.getHttpServer())
      .post("/api/programmes/programme-1/workouts/missing/exercises")
      .send({ exercise_id: "exercise-1" })
      .expect(HttpStatus.NOT_FOUND);
    expect(missingWorkout.body).toEqual({ error: "Workout not found" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    const missingExerciseId = await request(app.getHttpServer())
      .post("/api/programmes/programme-1/workouts/workout-1/exercises")
      .send({ reps_min: 8 })
      .expect(HttpStatus.BAD_REQUEST);
    expect(missingExerciseId.body).toEqual({ error: "Exercise is required" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.exercise.findFirst.mockResolvedValueOnce(null);
    const missingExercise = await request(app.getHttpServer())
      .post("/api/programmes/programme-1/workouts/workout-1/exercises")
      .send({ exercise_id: "foreign-exercise" })
      .expect(HttpStatus.NOT_FOUND);
    expect(missingExercise.body).toEqual({ error: "Exercise not found" });
  });

  it("returns existing metadata for owned idempotent replay before exercise validation", async () => {
    const existing = { id: "ewm-1", workout_id: "other-workout", exercise_id: "exercise-1" };
    prismaMock.exerciseWithMetadata.findUnique.mockResolvedValue(existing);
    prismaMock.workout.findFirst
      .mockResolvedValueOnce({ id: "workout-1", _count: { exercisesWithMetadata: 0 } })
      .mockResolvedValueOnce({ id: "other-workout" });

    const response = await request(app.getHttpServer())
      .post("/api/programmes/programme-1/workouts/workout-1/exercises")
      .send({ id: "ewm-1" })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(existing);
    expect(prismaMock.exercise.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.exerciseWithMetadata.create).not.toHaveBeenCalled();
  });

  it("rejects foreign metadata id collisions", async () => {
    prismaMock.exerciseWithMetadata.findUnique.mockResolvedValue({ id: "ewm-1", workout_id: "foreign-workout" });
    prismaMock.workout.findFirst
      .mockResolvedValueOnce({ id: "workout-1", _count: { exercisesWithMetadata: 0 } })
      .mockResolvedValueOnce(null);

    const response = await request(app.getHttpServer())
      .post("/api/programmes/programme-1/workouts/workout-1/exercises")
      .send({ id: "ewm-1", exercise_id: "exercise-1" })
      .expect(HttpStatus.FORBIDDEN);

    expect(response.body).toEqual({ error: "Forbidden" });
  });
});

describe("PATCH /api/programmes/:programmeId/workouts/:workoutId/exercises/:metadataId", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.exerciseWithMetadata.findFirst.mockResolvedValue({
      id: "ewm-1",
      exercise_id: "exercise-1",
      workout_id: "workout-1",
      sets_min: 3,
      sets_max: 4,
      reps_min: 8,
      reps_max: 12,
      rest_min: 60,
      rest_max: 90,
      tempo: "3-1-2-0",
      order_index: 0,
      is_hidden: false,
    });
    prismaMock.workoutSession.findFirst.mockResolvedValue(null);
    prismaMock.$transaction.mockImplementation((operations: Array<Promise<unknown>>) => Promise.all(operations));
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("updates metadata in place and ignores unknown fields when no user session exists", async () => {
    const updated = {
      id: "ewm-1",
      exercise_id: "exercise-2",
      workout_id: "workout-1",
      reps_min: 6,
      reps_max: 10,
      tempo: "2-0-2-0",
      is_hidden: false,
    };
    prismaMock.exerciseWithMetadata.update.mockResolvedValue(updated);

    const response = await request(app.getHttpServer())
      .patch("/api/programmes/ignored-programme/workouts/workout-1/exercises/ewm-1")
      .send({
        exercise_id: "exercise-2",
        reps_min: 6,
        reps_max: 10,
        tempo: "2-0-2-0",
        ignored: "field",
      })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(updated);
    expect(prismaMock.exerciseWithMetadata.findFirst).toHaveBeenCalledWith({
      where: { id: "ewm-1", workout_id: "workout-1" },
    });
    expect(prismaMock.workoutSession.findFirst).toHaveBeenCalledWith({
      where: { workout_id: "workout-1", user_id: "user-1" },
    });
    expect(prismaMock.exerciseWithMetadata.update).toHaveBeenCalledWith({
      where: { id: "ewm-1" },
      data: {
        exercise_id: "exercise-2",
        reps_min: 6,
        reps_max: 10,
        tempo: "2-0-2-0",
      },
    });
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("creates replacement metadata and hides the old row when a user session exists", async () => {
    prismaMock.workoutSession.findFirst.mockResolvedValue({ id: "session-1" });
    const replacement = {
      id: "ewm-2",
      exercise_id: "exercise-1",
      workout_id: "workout-1",
      sets_min: 3,
      sets_max: 4,
      reps_min: 5,
      reps_max: 12,
      rest_min: 60,
      rest_max: 90,
      tempo: "3-1-2-0",
      order_index: 0,
      is_hidden: false,
    };
    prismaMock.exerciseWithMetadata.create.mockResolvedValue(replacement);
    prismaMock.exerciseWithMetadata.update.mockResolvedValue({ id: "ewm-1", is_hidden: true });

    const response = await request(app.getHttpServer())
      .patch("/api/programmes/any-programme/workouts/workout-1/exercises/ewm-1")
      .send({ reps_min: 5, tempo: null })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(replacement);
    expect(prismaMock.exerciseWithMetadata.create).toHaveBeenCalledWith({
      data: {
        exercise_id: "exercise-1",
        workout_id: "workout-1",
        sets_min: 3,
        sets_max: 4,
        reps_min: 5,
        reps_max: 12,
        rest_min: 60,
        rest_max: 90,
        tempo: "3-1-2-0",
        order_index: 0,
      },
    });
    expect(prismaMock.exerciseWithMetadata.update).toHaveBeenCalledWith({
      where: { id: "ewm-1" },
      data: { is_hidden: true },
    });
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
  });

  it("returns legacy auth and missing metadata errors", async () => {
    process.env.AUTH_TEST_USER_ID = "";
    const unauthorized = await request(app.getHttpServer())
      .patch("/api/programmes/programme-1/workouts/workout-1/exercises/ewm-1")
      .send({ reps_min: 6 })
      .expect(HttpStatus.UNAUTHORIZED);
    expect(unauthorized.body).toEqual({ error: "Unauthorized" });

    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.exerciseWithMetadata.findFirst.mockResolvedValueOnce(null);
    const missing = await request(app.getHttpServer())
      .patch("/api/programmes/programme-1/workouts/workout-1/exercises/missing")
      .send({ reps_min: 6 })
      .expect(HttpStatus.NOT_FOUND);
    expect(missing.body).toEqual({ error: "Exercise metadata not found" });
  });

  it("passes null through on in-place updates and allows hidden metadata matches", async () => {
    prismaMock.exerciseWithMetadata.findFirst.mockResolvedValueOnce({
      id: "hidden-ewm",
      exercise_id: "exercise-1",
      workout_id: "workout-1",
      sets_min: 3,
      sets_max: 4,
      reps_min: 8,
      reps_max: 12,
      rest_min: 60,
      rest_max: 90,
      tempo: "3-1-2-0",
      order_index: 0,
      is_hidden: true,
    });
    prismaMock.exerciseWithMetadata.update.mockResolvedValue({
      id: "hidden-ewm",
      tempo: null,
      is_hidden: true,
    });

    const response = await request(app.getHttpServer())
      .patch("/api/programmes/programme-1/workouts/workout-1/exercises/hidden-ewm")
      .send({ tempo: null })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({ id: "hidden-ewm", tempo: null, is_hidden: true });
    expect(prismaMock.exerciseWithMetadata.update).toHaveBeenCalledWith({
      where: { id: "hidden-ewm" },
      data: { tempo: null },
    });
  });
});
