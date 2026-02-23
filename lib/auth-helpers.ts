import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Get the current user's ID from the session.
 * Redirects to /login if not authenticated.
 * Use in Server Components and Server Actions.
 */
export async function requireUserId(): Promise<string> {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }
    return session.user.id;
}

/**
 * Get the current user's ID from the session.
 * Returns null if not authenticated (for API routes that return 401).
 */
export async function getUserId(): Promise<string | null> {
    const session = await auth();
    return session?.user?.id ?? null;
}
