import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthModule } from "../src/auth/auth.module";
import { LegacyExceptionFilter } from "../src/common/filters/legacy-exception.filter";
import { PrismaService } from "../src/prisma/prisma.service";

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn().mockResolvedValue("hashed-password"),
  },
}));

const prismaMock = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

/** Builds a small Nest app for compatibility checks against the signup route. */
async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AuthModule],
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

describe("POST /api/auth/signup", () => {
  let app: INestApplication;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.AUTH_SECRET = "test-auth-secret";
    process.env.AUTH_TEST_USER_ID = "";
    app = await createTestApp();
  });

  afterEach(async () => {
    delete process.env.AUTH_TEST_USER_ID;
    await app?.close();
  });

  it("creates a user and returns only id and username", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: "u1",
      username: "newuser",
      password_hash: "hashed-password",
    });

    const response = await request(app.getHttpServer())
      .post("/api/auth/signup")
      .send({ username: "NewUser", password: "password123", ignored: true })
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual({ id: "u1", username: "newuser" });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { username: "newuser" },
    });
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: { username: "newuser", password_hash: "hashed-password" },
    });
  });

  it("returns the legacy username validation error", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/auth/signup")
      .send({ username: "ab", password: "password123" })
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({ error: "Username must be at least 3 characters" });
  });

  it("returns the legacy password validation error", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/auth/signup")
      .send({ username: "newuser", password: "12345" })
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({ error: "Password must be at least 6 characters" });
  });

  it("returns conflict for duplicate normalized usernames", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "u1", username: "taken" });

    const response = await request(app.getHttpServer())
      .post("/api/auth/signup")
      .send({ username: " Taken ", password: "password123" })
      .expect(HttpStatus.CONFLICT);

    expect(response.body).toEqual({ error: "Username already taken" });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { username: "taken" },
    });
  });

  it("returns legacy error on malformed JSON body", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/auth/signup")
      .set("Content-Type", "application/json")
      .send("{ malformed json")
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);

    expect(response.body).toEqual({ error: "Something went wrong. Please try again." });
  });

  it("logs in with normalized credentials and sets an auth cookie", async () => {
    const bcrypt = await import("bcryptjs");
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      username: "newuser",
      password_hash: "hashed-password",
    });
    vi.mocked(bcrypt.default.compare).mockResolvedValue(true as never);

    const response = await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ username: " NewUser ", password: "password123" })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({ id: "u1", username: "newuser" });
    expect(response.headers["set-cookie"]?.[0]).toContain("workout_auth=");
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { username: "newuser" },
    });
    expect(bcrypt.default.compare).toHaveBeenCalledWith("password123", "hashed-password");
  });

  it("returns a generic login error for bad credentials", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ username: "missing", password: "password123" })
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual({ error: "Invalid username or password" });
  });

  it("returns the current user for a valid backend auth cookie", async () => {
    const bcrypt = await import("bcryptjs");
    prismaMock.user.findUnique
      .mockResolvedValueOnce({
        id: "u1",
        username: "newuser",
        password_hash: "hashed-password",
      })
      .mockResolvedValueOnce({
        id: "u1",
        username: "newuser",
      });
    vi.mocked(bcrypt.default.compare).mockResolvedValue(true as never);

    const loginResponse = await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ username: "newuser", password: "password123" })
      .expect(HttpStatus.OK);

    const response = await request(app.getHttpServer())
      .get("/api/auth/me")
      .set("Cookie", loginResponse.headers["set-cookie"])
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({ id: "u1", username: "newuser" });
  });

  it("returns unauthorized for missing or invalid auth cookies", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/auth/me")
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  it("clears the auth cookie on logout", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/auth/logout")
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({ ok: true });
    expect(response.headers["set-cookie"]?.[0]).toContain("workout_auth=");
    expect(response.headers["set-cookie"]?.[0]).toContain("Expires=Thu, 01 Jan 1970");
  });
});
