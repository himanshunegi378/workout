import { NextRequest } from "next/server";

/**
 * Creates a mock NextRequest for testing API routes.
 */
export function createMockRequest(url: string, options: RequestInit = {}) {
    return new NextRequest(new URL(url, "http://localhost:3000"), options);
}

/**
 * Helper to parse JSON from a NextResponse.
 */
export async function getJsonResponse(response: Response) {
    return await response.json();
}
