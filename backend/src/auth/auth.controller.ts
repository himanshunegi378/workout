import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { CurrentUserId } from "../common/auth/current-user-id.decorator";
import { BackendAuthGuard } from "../common/auth/backend-auth.guard";
import { AuthService } from "./auth.service";

/** Handles backend-owned credentials auth endpoints. */
@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Creates a credentials user with the legacy signup contract. */
  @Post("signup")
  @HttpCode(201)
  signup(@Body() body: unknown) {
    return this.authService.signup(body);
  }

  /** Authenticates credentials and issues the backend session cookie. */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(body, response);
  }

  /** Clears the backend session cookie. */
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  /** Returns the currently authenticated user. */
  @Get("me")
  @UseGuards(BackendAuthGuard)
  me(@CurrentUserId() userId: string) {
    return this.authService.me(userId);
  }
}
