import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../common/auth/current-user-id.decorator";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { WorkoutsService } from "./workouts.service";

/** Preserves the legacy dashboard workout picker route. */
@Controller("api/workouts")
@UseGuards(BackendAuthGuard)
export class WorkoutsListController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  /** Lists workouts for the current user, optionally limited to active programmes. */
  @Get()
  list(@CurrentUserId() userId: string, @Query("active") active?: string) {
    return this.workoutsService.listForUser(userId, active === "true");
  }
}
