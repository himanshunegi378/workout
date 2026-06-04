import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LegacyExceptionFilter } from "../src/common/filters/legacy-exception.filter";
import { PrismaService } from "../src/prisma/prisma.service";
import { ProgrammesModule } from "../src/programmes/programmes.module";

const txMock = {
  programme: {
    findFirst: vi.fn(),
    updateMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  programmeActivityLog: {
    updateMany: vi.fn(),
    create: vi.fn(),
  },
};

const prismaMock = {
  programme: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
  },
  $transaction: vi.fn((callback: (tx: typeof txMock) => unknown) => callback(txMock)),
};

/** Builds a small Nest app for programme endpoint compatibility checks. */
async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [ProgrammesModule],
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

describe("/api/programmes", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("GET returns programme summaries for the authenticated user", async () => {
    const programmes = [{ id: "p1", name: "Alpha", description: null, is_active: false, workouts: [{ id: "w1" }] }];
    prismaMock.programme.findMany.mockResolvedValue(programmes);

    const response = await request(app.getHttpServer()).get("/api/programmes").expect(HttpStatus.OK);

    expect(response.body).toEqual(programmes);
    expect(prismaMock.programme.findMany).toHaveBeenCalledWith({
      where: { user_id: "user-1" },
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
  });

  it("GET returns the legacy auth failure", async () => {
    process.env.AUTH_TEST_USER_ID = "";

    const response = await request(app.getHttpServer()).get("/api/programmes").expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  it("GET /:programmeId returns programme detail with workout previews", async () => {
    const detail = {
      id: "p1",
      name: "PPL",
      is_active: true,
      workouts: [
        {
          id: "w1",
          name: "Push",
          order_index: 0,
          exercisesWithMetadata: [{ exercise: { name: "Bench Press" } }],
          _count: { exercisesWithMetadata: 1 },
        },
      ],
    };
    prismaMock.programme.findFirst.mockResolvedValue(detail);

    const response = await request(app.getHttpServer()).get("/api/programmes/p1").expect(HttpStatus.OK);

    expect(response.body).toEqual(detail);
    expect(prismaMock.programme.findFirst).toHaveBeenCalledWith({
      where: { id: "p1", user_id: "user-1" },
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
  });

  it("GET /:programmeId returns not found for missing programmes", async () => {
    prismaMock.programme.findFirst.mockResolvedValue(null);

    const response = await request(app.getHttpServer()).get("/api/programmes/missing").expect(HttpStatus.NOT_FOUND);

    expect(response.body).toEqual({ error: "Programme not found" });
  });

  it("POST creates an inactive programme with legacy fields", async () => {
    const created = { id: "p1", name: "PPL", description: null, user_id: "user-1", is_active: false };
    prismaMock.programme.findUnique.mockResolvedValue(null);
    txMock.programme.create.mockResolvedValue(created);

    const response = await request(app.getHttpServer())
      .post("/api/programmes")
      .send({ id: "p1", name: "  PPL  ", description: "" })
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual(created);
    expect(txMock.programme.updateMany).not.toHaveBeenCalled();
    expect(txMock.programmeActivityLog.updateMany).not.toHaveBeenCalled();
    expect(txMock.programme.create).toHaveBeenCalledWith({
      data: {
        id: "p1",
        name: "PPL",
        description: null,
        user_id: "user-1",
        is_active: false,
      },
    });
  });

  it("POST creates an active programme and performs activation side effects", async () => {
    const created = { id: "p-active", name: "Strength", description: "Blocks", user_id: "user-1", is_active: true };
    prismaMock.programme.findUnique.mockResolvedValue(null);
    txMock.programme.create.mockResolvedValue(created);

    const response = await request(app.getHttpServer())
      .post("/api/programmes")
      .send({ id: "p-active", name: "Strength", description: "Blocks", is_active: "yes" })
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual(created);
    expect(txMock.programme.updateMany).toHaveBeenCalledWith({
      where: { user_id: "user-1", is_active: true },
      data: { is_active: false },
    });
    expect(txMock.programmeActivityLog.updateMany).toHaveBeenCalledWith({
      where: { user_id: "user-1", end_time: null },
      data: { end_time: expect.any(Date) },
    });
    expect(txMock.programme.create).toHaveBeenCalledWith({
      data: {
        id: "p-active",
        name: "Strength",
        description: "Blocks",
        user_id: "user-1",
        is_active: true,
      },
    });
    expect(txMock.programmeActivityLog.create).toHaveBeenCalledWith({
      data: {
        programme_id: "p-active",
        user_id: "user-1",
        start_time: expect.any(Date),
      },
    });
  });

  it("POST preserves validation and idempotency responses", async () => {
    const missingName = await request(app.getHttpServer())
      .post("/api/programmes")
      .send({ description: "No name" })
      .expect(HttpStatus.BAD_REQUEST);
    expect(missingName.body).toEqual({ error: "Programme name is required" });

    const existing = { id: "p1", name: "Existing", description: null, user_id: "user-1", is_active: false };
    prismaMock.programme.findUnique.mockResolvedValueOnce(existing);
    const replay = await request(app.getHttpServer())
      .post("/api/programmes")
      .send({ id: "p1", name: "Existing", is_active: true })
      .expect(HttpStatus.OK);
    expect(replay.body).toEqual(existing);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("POST rejects foreign client ID collisions", async () => {
    prismaMock.programme.findUnique.mockResolvedValue({ id: "p1", user_id: "other-user" });

    const response = await request(app.getHttpServer())
      .post("/api/programmes")
      .send({ id: "p1", name: "PPL" })
      .expect(HttpStatus.FORBIDDEN);

    expect(response.body).toEqual({ error: "Forbidden" });
  });

  it("PATCH /:programmeId rejects non-boolean is_active values", async () => {
    const response = await request(app.getHttpServer())
      .patch("/api/programmes/p1")
      .send({ is_active: "true" })
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({ error: "Invalid is_active status" });
  });

  it("PATCH /:programmeId activates a programme with legacy side effects", async () => {
    const updated = { id: "p1", name: "PPL", user_id: "user-1", is_active: true };
    txMock.programme.findFirst.mockResolvedValue({ id: "p1", user_id: "user-1", is_active: false });
    txMock.programme.update.mockResolvedValue(updated);

    const response = await request(app.getHttpServer())
      .patch("/api/programmes/p1")
      .send({ is_active: true })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(updated);
    expect(txMock.programme.updateMany).toHaveBeenCalledWith({
      where: { user_id: "user-1", id: { not: "p1" }, is_active: true },
      data: { is_active: false },
    });
    expect(txMock.programmeActivityLog.updateMany).toHaveBeenCalledWith({
      where: { user_id: "user-1", end_time: null },
      data: { end_time: expect.any(Date) },
    });
    expect(txMock.programmeActivityLog.create).toHaveBeenCalledWith({
      data: {
        programme_id: "p1",
        user_id: "user-1",
        start_time: expect.any(Date),
      },
    });
    expect(txMock.programme.update).toHaveBeenCalledWith({
      where: { id: "p1" },
      data: { is_active: true },
    });
  });

  it("PATCH /:programmeId deactivates an active programme and closes its log", async () => {
    const updated = { id: "p1", name: "PPL", user_id: "user-1", is_active: false };
    txMock.programme.findFirst.mockResolvedValue({ id: "p1", user_id: "user-1", is_active: true });
    txMock.programme.update.mockResolvedValue(updated);

    const response = await request(app.getHttpServer())
      .patch("/api/programmes/p1")
      .send({ is_active: false })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(updated);
    expect(txMock.programmeActivityLog.updateMany).toHaveBeenCalledWith({
      where: { programme_id: "p1", user_id: "user-1", end_time: null },
      data: { end_time: expect.any(Date) },
    });
    expect(txMock.programmeActivityLog.create).not.toHaveBeenCalled();
  });

  it("PATCH /:programmeId returns not found for missing programmes", async () => {
    txMock.programme.findFirst.mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .patch("/api/programmes/missing")
      .send({ is_active: true })
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body).toEqual({ error: "Programme not found" });
  });
});
