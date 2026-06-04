import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "../../../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ConfigService } from "../config/config.service";

/** Prisma client configured with the same PgBouncer adapter as the Next.js app. */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: ConfigService) {
    super({
      adapter: new PrismaPg({
        connectionString: config.getRequired("DATABASE_URL"),
      }),
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }

  /** Opens the database connection when the Nest module starts. */
  async onModuleInit() {
    await this.$connect();
  }

  /** Closes the database connection during shutdown. */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
