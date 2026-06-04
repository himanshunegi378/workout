import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

type RequestWithUserId = Request & {
  userId?: string;
};

/** Reads the authenticated user ID attached by the legacy auth guard. */
export const CurrentUserId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUserId>();
  return request.userId;
});
