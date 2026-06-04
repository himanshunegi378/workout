import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { CurrentUserId } from "../common/auth/current-user-id.decorator";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { ExercisesService } from "./exercises.service";

/** Preserves the legacy `/api/exercises` API surface. */
@Controller("api/exercises")
@UseGuards(BackendAuthGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  /** Lists global exercises plus custom exercises for the current user. */
  @Get()
  list(@CurrentUserId() userId: string) {
    return this.exercisesService.listForUser(userId);
  }

  /** Creates a custom exercise with legacy idempotency semantics. */
  @Post()
  async create(@CurrentUserId() userId: string, @Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    const result = await this.exercisesService.createCustomExercise(userId, body);
    response.status(result.statusCode);
    return result.body;
  }
}
