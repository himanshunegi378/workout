import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";

type LegacyErrorBody = {
  error?: string;
  message?: string | string[];
  details?: unknown;
};

/** Formats Nest exceptions as the legacy `{ error }` API shape by default. */
@Catch()
export class LegacyExceptionFilter implements ExceptionFilter {
  /** Converts thrown exceptions to compatibility-preserving JSON responses. */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.path || request.url || "";

    // Identify if the exception is a body-parser JSON parsing error.
    // Express body-parser throws SyntaxError with status 400.
    // NestJS wraps it in a BadRequestException (HttpException with status 400).
    let isBodyParserError = false;
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const msg = typeof exceptionResponse === "object" && exceptionResponse !== null
        ? JSON.stringify(exceptionResponse)
        : String(exceptionResponse);

      if (status === 400 && (msg.includes("JSON") || msg.includes("Unexpected token") || msg.includes("Unexpected end"))) {
        isBodyParserError = true;
      }
    } else if (
      exception instanceof SyntaxError &&
      "status" in exception &&
      (exception as { status?: unknown }).status === 400
    ) {
      isBodyParserError = true;
    }

    if (isBodyParserError) {
      if (path.includes("/api/auth/signup")) {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: "Something went wrong. Please try again.",
        });
        return;
      }
      if (path.includes("/api/exercises")) {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: "Failed to create exercise",
        });
        return;
      }
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const body =
        typeof exceptionResponse === "object" && exceptionResponse !== null
          ? (exceptionResponse as LegacyErrorBody)
          : { error: String(exceptionResponse) };

      response.status(status).json(this.toLegacyBody(body, exception.message));
      return;
    }

    console.error("Unhandled backend error:", exception);
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }

  private toLegacyBody(body: LegacyErrorBody, fallbackMessage: string) {
    if (body.error) {
      return body.details === undefined ? { error: body.error } : { error: body.error, details: body.details };
    }

    const message = Array.isArray(body.message) ? body.message[0] : body.message;
    return { error: message ?? fallbackMessage };
  }
}
