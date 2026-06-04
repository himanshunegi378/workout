import { Module } from "@nestjs/common";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { ConfigModule } from "../config/config.module";
import { PrismaModule } from "../prisma/prisma.module";
import { WorkoutsListController } from "./workouts-list.controller";
import { WorkoutsController } from "./workouts.controller";
import { WorkoutsService } from "./workouts.service";

/** Workout template endpoints. */
@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [WorkoutsController, WorkoutsListController],
  providers: [WorkoutsService, BackendAuthGuard],
})
export class WorkoutsModule {}
