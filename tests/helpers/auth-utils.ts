/**
 * Authenticate future route calls as a specific user.
 * 
 * @param userId - The ID of the user to authenticate as.
 */
export function authenticateAs(userId: string) {
    process.env.AUTH_TEST_USER_ID = userId;
}

/**
 * Revoke authentication for future route calls.
 */
export function unauthenticate() {
    process.env.AUTH_TEST_USER_ID = "";
}
