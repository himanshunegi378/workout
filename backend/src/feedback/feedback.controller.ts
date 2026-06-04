import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../common/auth/current-user-id.decorator";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { FeedbackService } from "./feedback.service";

/** Preserves feedback history and submission routes. */
@Controller("api/feedback")
@UseGuards(BackendAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /** Returns previous feedback for the authenticated user. */
  @Get()
  list(@CurrentUserId() userId: string) {
    return this.feedbackService.list(userId);
  }

  /** Creates a feedback entry for the authenticated user. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  submit(@CurrentUserId() userId: string, @Body() body: unknown) {
    return this.feedbackService.submit(userId, body);
  }
}
