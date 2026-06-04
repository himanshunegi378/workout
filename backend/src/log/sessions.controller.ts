import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { CurrentUserId } from "../common/auth/current-user-id.decorator";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { SessionsService } from "./sessions.service";

/** Preserves the legacy workout session timeline route. */
@Controller("api/log/sessions")
@UseGuards(BackendAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  /** Lists logged sessions with optional cursor pagination and date grouping. */
  @Get()
  list(@CurrentUserId() userId: string, @Req() request: Request) {
    return this.sessionsService.list(userId, getSearchParams(request));
  }

}

function getSearchParams(request: Request) {
  const originalUrl = request.originalUrl ?? request.url;
  return new URL(originalUrl, "http://localhost").searchParams;
}
