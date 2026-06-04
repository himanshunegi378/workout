import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "workout_auth";

export function proxy(request: NextRequest) {
    if (!request.cookies.has(AUTH_COOKIE_NAME)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Protect everything EXCEPT these paths:
        // - /login, /signup (auth pages)
        // - /api/auth/* (backend auth endpoints)
        // - /_next/static, /_next/image, /favicon.ico (static assets)
        "/((?!login|signup|api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};
