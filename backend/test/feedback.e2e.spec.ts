import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LegacyExceptionFilter } from "../src/common/filters/legacy-exception.filter";
import { FeedbackModule } from "../src/feedback/feedback.module";
import { PrismaService } from "../src/prisma/prisma.service";

const prismaMock = {
  feedback: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
};

/** Builds a small Nest app for feedback compatibility checks. */
async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [FeedbackModule],
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

describe("GET /api/feedback", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.feedback.findMany.mockResolvedValue([]);
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("returns legacy unauthorized response", async () => {
    process.env.AUTH_TEST_USER_ID = "";

    const response = await request(app.getHttpServer())
      .get("/api/feedback")
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual({ error: "Unauthorized" });
    expect(prismaMock.feedback.findMany).not.toHaveBeenCalled();
  });

  it("returns user-scoped feedback ordered newest first with selected fields", async () => {
    prismaMock.feedback.findMany.mockResolvedValue([
      {
        id: "fb-new",
        description: "Newest feedback",
        status: "Planned",
        created_at: new Date("2026-05-31T12:00:00.000Z"),
        updated_at: new Date("2026-05-31T12:30:00.000Z"),
      },
    ]);

    const response = await request(app.getHttpServer())
      .get("/api/feedback")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual([
      {
        id: "fb-new",
        description: "Newest feedback",
        status: "Planned",
        created_at: "2026-05-31T12:00:00.000Z",
        updated_at: "2026-05-31T12:30:00.000Z",
      },
    ]);
    expect(prismaMock.feedback.findMany).toHaveBeenCalledWith({
      where: { user_id: "user-1" },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        description: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });
  });
});

describe("POST /api/feedback", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_TEST_USER_ID = "user-1";
    prismaMock.feedback.create.mockResolvedValue({
      id: "fb-1",
      status: "Submitted",
      created_at: new Date("2026-05-31T12:25:00.000Z"),
    });
    app = await createTestApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  it("returns legacy unauthorized response before validating the body", async () => {
    process.env.AUTH_TEST_USER_ID = "";

    const response = await request(app.getHttpServer())
      .post("/api/feedback")
      .send({})
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual({ error: "Unauthorized" });
    expect(prismaMock.feedback.create).not.toHaveBeenCalled();
  });

  it("creates trimmed feedback and ignores client-provided status", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/feedback")
      .send({
        description: "   Add a rest timer shortcut on the log screen.   ",
        status: "Completed",
      })
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual({
      id: "fb-1",
      status: "Submitted",
      created_at: "2026-05-31T12:25:00.000Z",
    });
    expect(prismaMock.feedback.create).toHaveBeenCalledWith({
      data: {
        description: "Add a rest timer shortcut on the log screen.",
        user_id: "user-1",
      },
      select: {
        id: true,
        status: true,
        created_at: true,
      },
    });
  });

  it("returns legacy Zod details for invalid payloads", async () => {
    const missing = await request(app.getHttpServer())
      .post("/api/feedback")
      .send({})
      .expect(HttpStatus.BAD_REQUEST);

    expect(missing.body.error).toBe("Invalid payload");
    expect(missing.body.details.description?._errors).toContain("Invalid input: expected string, received undefined");

    const tooShort = await request(app.getHttpServer())
      .post("/api/feedback")
      .send({ description: "hey" })
      .expect(HttpStatus.BAD_REQUEST);

    expect(tooShort.body.details.description?._errors).toContain("Feedback must be at least 5 characters");
    expect(prismaMock.feedback.create).not.toHaveBeenCalled();
  });
});
