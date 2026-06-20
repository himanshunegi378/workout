import { HttpException, HttpStatus } from "@nestjs/common";

/** Throws a JSON error compatible with the legacy Next.js route handlers. */
export function throwLegacyError(error: string, status: HttpStatus, details?: unknown): never {
  throw new HttpException(details === undefined ? { error } : { error, details }, status);
}
