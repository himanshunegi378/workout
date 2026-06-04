import { Injectable } from "@nestjs/common";
import "dotenv/config";

/** Reads backend configuration from the same environment used by Next.js. */
@Injectable()
export class ConfigService {
  /** Port used by the standalone NestJS server. */
  get port() {
    return Number(process.env.PORT ?? 4000);
  }

  /** Returns an environment variable or throws when a required value is absent. */
  getRequired(name: string) {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
  }

  /** Returns an optional environment variable without applying defaults. */
  getOptional(name: string) {
    return process.env[name];
  }
}
