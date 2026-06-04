import { Global, Module } from "@nestjs/common";
import { ConfigService } from "./config.service";

/** Provides process environment access without changing legacy config names. */
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
