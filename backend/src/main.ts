import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { LegacyExceptionFilter } from "./common/filters/legacy-exception.filter";
import { ConfigService } from "./config/config.service";

/** Bootstraps the NestJS API while preserving legacy JSON error contracts. */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const corsOrigin = config.getOptional("CORS_ORIGIN");

  app.enableCors({
    credentials: true,
    origin: corsOrigin ? corsOrigin.split(",").map((origin) => origin.trim()) : true,
  });
  app.useGlobalFilters(new LegacyExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  );

  await app.listen(config.port);
}

void bootstrap();
