import { Body, Controller, Get, Param, Patch, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { CurrentUserId } from "../common/auth/current-user-id.decorator";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { ProgrammesService } from "./programmes.service";

/** Preserves legacy `/api/programmes` list and create routes. */
@Controller("api/programmes")
@UseGuards(BackendAuthGuard)
export class ProgrammesController {
  constructor(private readonly programmesService: ProgrammesService) {}

  /** Lists programme summaries for the current user. */
  @Get()
  list(@CurrentUserId() userId: string) {
    return this.programmesService.list(userId);
  }

  /** Returns one programme with workout previews for the current user. */
  @Get(":programmeId")
  detail(@CurrentUserId() userId: string, @Param("programmeId") programmeId: string) {
    return this.programmesService.getDetail(userId, programmeId);
  }

  /** Creates a programme with legacy active-programme side effects. */
  @Post()
  async create(@CurrentUserId() userId: string, @Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    const result = await this.programmesService.create(userId, body);
    response.status(result.statusCode);
    return result.body;
  }

  /** Toggles active status while preserving activity-log side effects. */
  @Patch(":programmeId")
  updateActive(@CurrentUserId() userId: string, @Param("programmeId") programmeId: string, @Body() body: unknown) {
    return this.programmesService.updateActive(userId, programmeId, body);
  }
}
