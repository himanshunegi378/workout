/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

/**
 * Creates a mock NextRequest for testing API routes.
 */
export function createMockRequest(url: string, options: RequestInit = {}) {
    return new NextRequest(new URL(url, "http://localhost:3000"), options as any);
}

/**
 * Helper to parse JSON from a NextResponse.
 */
export async function getJsonResponse(response: Response) {
    return await response.json();
}

/**
 * Creates a mock NextRequest with a JSON body.
 */
export function jsonReq(url: string, method: string, body: Record<string, unknown>) {
    return createMockRequest(url, {
        method,
        body: JSON.stringify(body),
    });
}

/**
 * Helper for async Next.js route params (e.g. { params: Promise.resolve({ id: '123' }) }).
 */
export function makeParams<T extends Record<string, string>>(p: T) {
    return { params: Promise.resolve(p) };
}
