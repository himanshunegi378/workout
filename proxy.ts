export { auth as proxy } from "@/auth";

export const config = {
    matcher: [
        // Protect everything EXCEPT these paths:
        // - /login, /signup (auth pages)
        // - /api/auth/* (NextAuth endpoints)
        // - /_next/static, /_next/image, /favicon.ico (static assets)
        "/((?!login|signup|api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};
