import { Body, Controller, Get, Param, Patch, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { CurrentUserId } from "../common/auth/current-user-id.decorator";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { WorkoutsService } from "./workouts.service";

/** Preserves legacy workout-template routes. */
@Controller("api/programmes/:programmeId/workouts")
@UseGuards(BackendAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  /** Returns workout structure, today's session, and previous-session logs. */
  @Get(":workoutId/details")
  detail(
    @CurrentUserId() userId: string,
    @Param("programmeId") programmeId: string,
    @Param("workoutId") workoutId: string,
  ) {
    return this.workoutsService.getWorkoutDetails(userId, programmeId, workoutId);
  }

  /** Links an exercise prescription to a workout template. */
  @Post(":workoutId/exercises")
  async addExercise(
    @CurrentUserId() userId: string,
    @Param("programmeId") programmeId: string,
    @Param("workoutId") workoutId: string,
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.workoutsService.addExercise(userId, programmeId, workoutId, body);
    response.status(result.statusCode);
    return result.body;
  }

  /** Updates exercise metadata while preserving logged workout history. */
  @Patch(":workoutId/exercises/:metadataId")
  updateMetadata(
    @CurrentUserId() userId: string,
    @Param("workoutId") workoutId: string,
    @Param("metadataId") metadataId: string,
    @Body() body: unknown,
  ) {
    return this.workoutsService.updateMetadata(userId, workoutId, metadataId, body);
  }

  /** Creates a workout inside a user-owned programme. */
  @Post()
  async createForProgramme(
    @CurrentUserId() userId: string,
    @Param("programmeId") programmeId: string,
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.workoutsService.createForProgramme(userId, programmeId, body);
    response.status(result.statusCode);
    return result.body;
  }
}
