import { Module } from "@nestjs/common";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { ConfigModule } from "../config/config.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

/** Authentication module for migrated public auth endpoints. */
@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, BackendAuthGuard],
})
export class AuthModule {}
