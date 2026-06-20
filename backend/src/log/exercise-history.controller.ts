import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { CurrentUserId } from "../common/auth/current-user-id.decorator";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { ExerciseHistoryService } from "./exercise-history.service";

/** Preserves exercise history routes while logging owns persistence behavior. */
@Controller("api/exercises")
@UseGuards(BackendAuthGuard)
export class ExerciseHistoryController {
  constructor(private readonly historyService: ExerciseHistoryService) {}

  /** Lists historical set logs for one or more exercises. */
  @Get("logs")
  logs(@CurrentUserId() userId: string, @Req() request: Request) {
    return this.historyService.listLogs(userId, getSearchParams(request));
  }

  /** Returns the latest log for a single exercise. */
  @Get(":exerciseId/last-log")
  async lastLog(
    @CurrentUserId() userId: string,
    @Param("exerciseId") exerciseId: string,
    @Res() response: Response,
  ) {
    const latestLog = await this.historyService.getLastLog(userId, exerciseId);
    return response.json(latestLog);
  }
}

function getSearchParams(request: Request) {
  const originalUrl = request.originalUrl ?? request.url;
  return new URL(originalUrl, "http://localhost").searchParams;
}
