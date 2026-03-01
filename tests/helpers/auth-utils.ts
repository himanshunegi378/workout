import { vi } from "vitest";
import { auth } from "@/auth";

/**
 * Authenticate future route calls as a specific user.
 * 
 * @param userId - The ID of the user to authenticate as.
 */
export function authenticateAs(userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(auth).mockResolvedValue({
        user: { id: userId },
        expires: new Date(Date.now() + 1000 * 60 * 60).toISOString()
    } as any);
}

/**
 * Revoke authentication for future route calls.
 */
export function unauthenticate() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(auth).mockResolvedValue(null as any);
}
