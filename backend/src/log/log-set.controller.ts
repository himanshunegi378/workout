import { Body, Controller, Delete, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { CurrentUserId } from "../common/auth/current-user-id.decorator";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { LogSetService } from "./log-set.service";

/** Owns legacy set logging, mutation, and deletion routes. */
@Controller("api/log/set")
@UseGuards(BackendAuthGuard)
export class LogSetController {
  constructor(private readonly logSetService: LogSetService) {}

  /** Logs a set and links it to the user's day session. */
  @Post()
  async create(
    @CurrentUserId() userId: string,
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.logSetService.create(userId, body);
    response.status(result.statusCode);
    return result.body;
  }

  /** Deletes a set and purges the session if it becomes empty. */
  @Delete()
  delete(@CurrentUserId() userId: string, @Req() request: Request) {
    return this.logSetService.delete(userId, getSearchParams(request));
  }

  /** Updates logged set performance values. */
  @Patch()
  update(@CurrentUserId() userId: string, @Body() body: unknown) {
    return this.logSetService.update(userId, body);
  }
}

function getSearchParams(request: Request) {
  const originalUrl = request.originalUrl ?? request.url;
  return new URL(originalUrl, "http://localhost").searchParams;
}
