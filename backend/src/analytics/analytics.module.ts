import { Module } from "@nestjs/common";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { ConfigModule } from "../config/config.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";

/** Analytics endpoints and legacy reporting routes. */
@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, BackendAuthGuard],
})
export class AnalyticsModule {}
