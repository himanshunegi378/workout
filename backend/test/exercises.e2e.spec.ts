import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LegacyExceptionFilter } from "../src/common/filters/legacy-exception.filter";
import { ExercisesModule } from "../src/exercises/exercises.module";
import { PrismaService } from "../src/prisma/prisma.service";

const prismaMock = {
  exercise: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

/** Builds a small Nest app for exercise endpoint compatibility checks. */
async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [ExercisesModule],
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

describe("/api/exercises", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("GET returns global and user exercises with the legacy selected fields", async () => {
    const exercises = [
      { id: "1", name: "Lat Pulldown", description: null, muscle_group: "Back" },
      { id: "2", name: "Bench Press", description: "Flat bench", muscle_group: "Chest" },
    ];
    prismaMock.exercise.findMany.mockResolvedValue(exercises);

    const response = await request(app.getHttpServer()).get("/api/exercises").expect(HttpStatus.OK);

    expect(response.body).toEqual(exercises);
    expect(prismaMock.exercise.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ user_id: "user-1" }, { is_global: true }],
      },
      orderBy: [{ muscle_group: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        description: true,
        muscle_group: true,
      },
    });
  });

  it("GET returns the legacy unauthenticated response", async () => {
    process.env.AUTH_TEST_USER_ID = "";

    const response = await request(app.getHttpServer()).get("/api/exercises").expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  it("POST creates a custom exercise with legacy persistence fields", async () => {
    const created = {
      id: "client-id",
      name: "Bench Press",
      description: null,
      muscle_group: "Chest",
      user_id: "user-1",
      is_global: false,
    };
    prismaMock.exercise.findUnique.mockResolvedValue(null);
    prismaMock.exercise.create.mockResolvedValue(created);

    const response = await request(app.getHttpServer())
      .post("/api/exercises")
      .send({ id: "client-id", name: "  Bench Press  ", description: "", muscle_group: "Chest", ignored: true })
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual(created);
    expect(prismaMock.exercise.findUnique).toHaveBeenCalledWith({ where: { id: "client-id" } });
    expect(prismaMock.exercise.create).toHaveBeenCalledWith({
      data: {
        id: "client-id",
        name: "Bench Press",
        description: null,
        muscle_group: "Chest",
        user_id: "user-1",
        is_global: false,
      },
    });
  });

  it("POST returns validation errors with legacy messages", async () => {
    const missingName = await request(app.getHttpServer())
      .post("/api/exercises")
      .send({ muscle_group: "Chest" })
      .expect(HttpStatus.BAD_REQUEST);

    expect(missingName.body).toEqual({ error: "Exercise name is required" });

    const invalidMuscleGroup = await request(app.getHttpServer())
      .post("/api/exercises")
      .send({ name: "Curl", muscle_group: "Invalid" })
      .expect(HttpStatus.BAD_REQUEST);

    expect(invalidMuscleGroup.body).toEqual({ error: "Valid muscle group is required" });
  });

  it("POST preserves client-id idempotency semantics", async () => {
    const existing = {
      id: "client-id",
      name: "Curl",
      description: null,
      muscle_group: "Biceps",
      user_id: "user-1",
      is_global: false,
    };
    prismaMock.exercise.findUnique.mockResolvedValue(existing);

    const response = await request(app.getHttpServer())
      .post("/api/exercises")
      .send({ id: "client-id", name: "Curl" })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(existing);
    expect(prismaMock.exercise.create).not.toHaveBeenCalled();
  });

  it("POST rejects global or foreign id collisions", async () => {
    prismaMock.exercise.findUnique.mockResolvedValue({
      id: "client-id",
      name: "Global Curl",
      user_id: null,
      is_global: true,
    });

    const response = await request(app.getHttpServer())
      .post("/api/exercises")
      .send({ id: "client-id", name: "Curl", muscle_group: "Biceps" })
      .expect(HttpStatus.FORBIDDEN);

    expect(response.body).toEqual({ error: "Forbidden" });
  });

  it("POST returns legacy error on malformed JSON body", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/exercises")
      .set("Content-Type", "application/json")
      .send("{ malformed json")
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);

    expect(response.body).toEqual({ error: "Failed to create exercise" });
  });
});
