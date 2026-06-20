import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../common/auth/current-user-id.decorator";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { AnalyticsService } from "./analytics.service";

/** Preserves analytics and legacy volume routes. */
@Controller()
@UseGuards(BackendAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /** Returns the legacy chronological volume response. */
  @Get("api/log/volume")
  legacyVolume(@CurrentUserId() userId: string) {
    return this.analyticsService.legacyVolume(userId);
  }

  /** Executes a validated custom analytics query. */
  @Post("api/analytics/query")
  @HttpCode(HttpStatus.OK)
  query(@CurrentUserId() userId: string, @Body() body: unknown) {
    return this.analyticsService.query(userId, body);
  }

  /** Returns per-day exercise counts for the consistency heatmap. */
  @Get("api/analytics/activity-heatmap")
  activityHeatmap(@CurrentUserId() userId: string) {
    return this.analyticsService.activityHeatmap(userId);
  }

  /** Returns ACWR fatigue time-series data for the dashboard. */
  @Get("api/analytics/fatigue")
  fatigue(
    @CurrentUserId() userId: string,
    @Query("endDate") endDate?: string,
    @Query("days") days?: string,
  ) {
    return this.analyticsService.fatigue(userId, { endDate, days });
  }

  /** Returns progressive-overload volume changes for a workout template. */
  @Get("api/analytics/session-volume")
  sessionVolume(
    @CurrentUserId() userId: string,
    @Query("workoutId") workoutId?: string,
    @Query("limit") limit?: string,
  ) {
    return this.analyticsService.sessionVolume(userId, { workoutId, limit });
  }
}
