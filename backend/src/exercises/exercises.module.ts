import { Module } from "@nestjs/common";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { ConfigModule } from "../config/config.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ExercisesController } from "./exercises.controller";
import { ExercisesService } from "./exercises.service";

/** Exercise library module for global and user-owned custom movements. */
@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [ExercisesController],
  providers: [ExercisesService, BackendAuthGuard],
})
export class ExercisesModule {}
