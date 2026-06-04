import { Module } from "@nestjs/common";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { ConfigModule } from "../config/config.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ProgrammesController } from "./programmes.controller";
import { ProgrammesService } from "./programmes.service";

/** Programme list and creation endpoints. */
@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [ProgrammesController],
  providers: [ProgrammesService, BackendAuthGuard],
})
export class ProgrammesModule {}
