import { Module } from "@nestjs/common";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { ConfigModule } from "../config/config.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ExerciseHistoryController } from "./exercise-history.controller";
import { ExerciseHistoryService } from "./exercise-history.service";
import { LogSetController } from "./log-set.controller";
import { LogSetService } from "./log-set.service";
import { SessionFinishController } from "./session-finish.controller";
import { SessionsController } from "./sessions.controller";
import { SessionsService } from "./sessions.service";

/** Logging-owned exercise history endpoints. */
@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [ExerciseHistoryController, LogSetController, SessionsController, SessionFinishController],
  providers: [ExerciseHistoryService, LogSetService, SessionsService, BackendAuthGuard],
})
export class LoggingModule {}
