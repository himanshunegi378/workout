import { Module } from "@nestjs/common";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { ConfigModule } from "../config/config.module";
import { PrismaModule } from "../prisma/prisma.module";
import { FeedbackController } from "./feedback.controller";
import { FeedbackService } from "./feedback.service";

/** Wires feedback controllers and persistence services. */
@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [FeedbackController],
  providers: [FeedbackService, BackendAuthGuard],
})
export class FeedbackModule {}
