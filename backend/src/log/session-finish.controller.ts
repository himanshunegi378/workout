import { Controller, Param, Patch, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../common/auth/current-user-id.decorator";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { SessionsService } from "./sessions.service";

/** Preserves the legacy workout-session finish route. */
@Controller("api/workout-sessions")
@UseGuards(BackendAuthGuard)
export class SessionFinishController {
  constructor(private readonly sessionsService: SessionsService) {}

  /** Finishes a session or discards it if no sets were logged. */
  @Patch(":sessionId/finish")
  finish(@CurrentUserId() userId: string, @Param("sessionId") sessionId: string) {
    return this.sessionsService.finish(userId, sessionId);
  }
}
