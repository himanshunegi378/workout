import { HttpStatus, Injectable } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { createHmac } from "crypto";
import type { Response } from "express";
import { AUTH_COOKIE_NAME } from "../common/auth/backend-auth.guard";
import { throwLegacyError } from "../common/utils/legacy-http";
import { ConfigService } from "../config/config.service";
import { PrismaService } from "../prisma/prisma.service";

type SignupBody = {
  username?: unknown;
  password?: unknown;
};

const AUTH_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function parseBooleanOverride(value: string | undefined) {
  if (value === undefined) return null;
  return value.trim().toLowerCase() === "true";
}

function encodeBase64UrlJson(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function signJwtPart(data: string, secret: string) {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

/** Implements backend-owned credentials auth and account creation. */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** Creates a user account with exact legacy validation and hashing behavior. */
  async signup(body: unknown) {
    try {
      const { username, password } = (body ?? {}) as SignupBody;

      if (!username || typeof username !== "string" || username.trim().length < 3) {
        throwLegacyError("Username must be at least 3 characters", HttpStatus.BAD_REQUEST);
      }

      if (!password || typeof password !== "string" || password.length < 6) {
        throwLegacyError("Password must be at least 6 characters", HttpStatus.BAD_REQUEST);
      }

      const normalizedUsername = username.trim().toLowerCase();
      const existingUser = await this.prisma.user.findUnique({
        where: { username: normalizedUsername },
      });

      if (existingUser) {
        throwLegacyError("Username already taken", HttpStatus.CONFLICT);
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await this.prisma.user.create({
        data: {
          username: normalizedUsername,
          password_hash: passwordHash,
        },
      });

      const token = await this.createToken(user.id, user.username);
      return { id: user.id, username: user.username, token };
    } catch (error) {
      if (error instanceof Error && "getStatus" in error) {
        throw error;
      }

      console.error("Signup error:", error);
      throwLegacyError("Something went wrong. Please try again.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Authenticates credentials, stores the session cookie, and returns public user data. */
  async login(body: unknown, response: Response) {
    const { username, password } = (body ?? {}) as SignupBody;

    if (!username || typeof username !== "string" || !password || typeof password !== "string") {
      throwLegacyError("Invalid username or password", HttpStatus.UNAUTHORIZED);
    }

    const normalizedUsername = username.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (!user) {
      throwLegacyError("Invalid username or password", HttpStatus.UNAUTHORIZED);
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throwLegacyError("Invalid username or password", HttpStatus.UNAUTHORIZED);
    }

    const token = await this.createToken(user.id, user.username);
    const secure = this.shouldUseSecureCookie();
    response.cookie(AUTH_COOKIE_NAME, token, {
      domain: this.config.getOptional("AUTH_COOKIE_DOMAIN"),
      httpOnly: true,
      maxAge: AUTH_MAX_AGE_SECONDS * 1000,
      path: "/",
      sameSite: "lax",
      secure,
    });

    return { id: user.id, username: user.username, token };
  }

  /** Clears the backend auth cookie. */
  logout(response: Response) {
    const secure = this.shouldUseSecureCookie();
    response.clearCookie(AUTH_COOKIE_NAME, {
      domain: this.config.getOptional("AUTH_COOKIE_DOMAIN"),
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure,
    });

    return { ok: true };
  }

  /** Returns public user data for the currently authenticated backend cookie. */
  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });

    if (!user) {
      throwLegacyError("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  private createToken(userId: string, username: string) {
    const secret = this.config.getRequired("AUTH_SECRET");
    const issuedAt = Math.floor(Date.now() / 1000);
    const header = encodeBase64UrlJson({ alg: "HS256", typ: "JWT" });
    const payload = encodeBase64UrlJson({
      sub: userId,
      username,
      iat: issuedAt,
      exp: issuedAt + AUTH_MAX_AGE_SECONDS,
    });
    const signedPart = `${header}.${payload}`;
    return `${signedPart}.${signJwtPart(signedPart, secret)}`;
  }

  private shouldUseSecureCookie() {
    return parseBooleanOverride(this.config.getOptional("AUTH_COOKIE_SECURE")) ?? process.env.NODE_ENV === "production";
  }
}
