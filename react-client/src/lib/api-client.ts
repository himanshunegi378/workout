type QueryParamValue = string | number | boolean | null | undefined;

const TEST_BACKEND_API_URL = "http://backend.test";

function trimTrailingSlash(value: string) {
    return value.replace(/\/+$/, "");
}

/**
 * Resolves the browser-visible backend API origin used by frontend requests.
 */
export function getBackendApiBaseUrl() {
    const configuredUrl = import.meta.env.VITE_BACKEND_API_URL;

    if (configuredUrl) {
        return trimTrailingSlash(configuredUrl);
    }

    if (import.meta.env.MODE === "test") {
        return TEST_BACKEND_API_URL;
    }

    throw new Error("VITE_BACKEND_API_URL is required for frontend API calls");
}

/**
 * Builds a backend API URL while preserving existing query parameter behavior.
 */
export function apiUrl(path: string, query?: Record<string, QueryParamValue | QueryParamValue[]>) {
    if (!path.startsWith("/")) {
        throw new Error("API paths must start with /");
    }

    const url = new URL(path, getBackendApiBaseUrl());

    if (query) {
        for (const [key, value] of Object.entries(query)) {
            const values = Array.isArray(value) ? value : [value];

            for (const item of values) {
                if (item !== undefined && item !== null) {
                    url.searchParams.append(key, String(item));
                }
            }
        }
    }

    return url;
}

/**
 * Fetches from the backend API with cookies included for backend-owned auth.
 */
export function apiFetch(path: string, init?: RequestInit) {
    return fetch(apiUrl(path).toString(), {
        ...init,
        credentials: "include",
    });
}

/**
 * Reads the existing `{ error }` response shape used by migrated backend routes.
 */
export async function readApiError(response: Response, fallback: string) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    return payload?.error || fallback;
}
