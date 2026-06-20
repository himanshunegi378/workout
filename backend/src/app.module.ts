import { Module } from "@nestjs/common";
import { AnalyticsModule } from "./analytics/analytics.module";
import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./common/health.controller";
import { ConfigModule } from "./config/config.module";
import { ExercisesModule } from "./exercises/exercises.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { LoggingModule } from "./log/logging.module";
import { ProgrammesModule } from "./programmes/programmes.module";
import { PrismaModule } from "./prisma/prisma.module";
import { WorkoutsModule } from "./workouts/workouts.module";

/** Root backend module for shared migration infrastructure. */
@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    ExercisesModule,
    LoggingModule,
    ProgrammesModule,
    WorkoutsModule,
    AnalyticsModule,
    FeedbackModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
