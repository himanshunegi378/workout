import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

/** Shares one Prisma service across backend modules. */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
