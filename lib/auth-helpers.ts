import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiUrl } from "./api-client";

type CurrentUser = {
    id: string;
    username: string;
};

/**
 * Reads the backend-owned auth session from the current request cookies.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
    const cookieStore = await cookies();
    const response = await fetch(apiUrl("/api/auth/me").toString(), {
        cache: "no-store",
        credentials: "include",
        headers: {
            cookie: cookieStore.toString(),
        },
    });

    if (!response.ok) {
        return null;
    }

    return response.json() as Promise<CurrentUser>;
}

/**
 * Get the current user's ID from the session.
 * Redirects to /login if not authenticated.
 * Use in Server Components and Server Actions.
 */
export async function requireUserId(): Promise<string> {
    const user = await getCurrentUser();
    if (!user?.id) {
        redirect("/login");
    }
    return user.id;
}

/**
 * Get the current user's ID from the session.
 * Returns null if not authenticated (for API routes that return 401).
 */
export async function getUserId(): Promise<string | null> {
    const user = await getCurrentUser();
    return user?.id ?? null;
}
