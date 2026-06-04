import { Controller, Get } from "@nestjs/common";

/** Lightweight readiness endpoint for backend deployment checks. */
@Controller("health")
export class HealthController {
  /** Confirms the NestJS process is serving requests. */
  @Get()
  getHealth() {
    return { status: "ok" };
  }
}
