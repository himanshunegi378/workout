import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "crypto";
import type { Request } from "express";
import { ConfigService } from "../../config/config.service";
import { throwLegacyError } from "../utils/legacy-http";

export const AUTH_COOKIE_NAME = "workout_auth";

type BackendAuthToken = {
  sub?: unknown;
  username?: unknown;
};

type RequestWithUserId = Request & {
  userId?: string;
};

function parseCookies(cookieHeader: string | undefined) {
  const cookies = new Map<string, string>();
  if (!cookieHeader) return cookies;

  for (const pair of cookieHeader.split(";")) {
    const separatorIndex = pair.indexOf("=");
    if (separatorIndex === -1) continue;

    const name = pair.slice(0, separatorIndex).trim();
    const value = pair.slice(separatorIndex + 1).trim();
    if (name) {
      cookies.set(name, decodeURIComponent(value));
    }
  }

  return cookies;
}

function decodeBase64UrlJson<T>(value: string) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
}

function signJwtPart(data: string, secret: string) {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

/** Validates the backend-owned auth JWT cookie. */
@Injectable()
export class BackendAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  /** Attaches the session user ID or returns the legacy unauthorized response. */
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUserId>();
    const testUserId = this.getTestUserId();
    if (testUserId) {
      request.userId = testUserId;
      return true;
    }

    let rawToken: string | undefined = undefined;

    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      rawToken = authHeader.substring(7);
    } else {
      const cookies = parseCookies(request.headers.cookie);
      rawToken = cookies.get(AUTH_COOKIE_NAME);
    }

    const secret = this.config.getRequired("AUTH_SECRET");
    const token = rawToken ? await this.verifyToken(rawToken, secret) : null;
    const userId = typeof token?.sub === "string" ? token.sub : null;

    if (!userId) {
      throwLegacyError("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    request.userId = userId;
    return true;
  }

  private getTestUserId() {
    if (process.env.NODE_ENV !== "test") return null;
    const userId = process.env.AUTH_TEST_USER_ID;
    return userId && userId.trim().length > 0 ? userId : null;
  }

  private verifyToken(rawToken: string, secret: string) {
    try {
      const [encodedHeader, encodedPayload, signature] = rawToken.split(".");
      if (!encodedHeader || !encodedPayload || !signature) return null;

      const signedPart = `${encodedHeader}.${encodedPayload}`;
      const expectedSignature = signJwtPart(signedPart, secret);
      if (
        signature.length !== expectedSignature.length ||
        !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
      ) {
        return null;
      }

      const payload = decodeBase64UrlJson<BackendAuthToken & { exp?: unknown }>(encodedPayload);
      const expiresAtSeconds = typeof payload.exp === "number" ? payload.exp : 0;
      if (expiresAtSeconds <= Math.floor(Date.now() / 1000)) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }
}
