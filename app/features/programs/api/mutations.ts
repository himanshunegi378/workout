interface CreateProgramData {
    id?: string;
    name: string;
    description: string | null;
}

/**
 * Persistence layer for creating a new training programme.
 * 
 * Context:
 * Performs the low-level fetch request to the POST /api/programmes endpoint. 
 * Includes basic error parsing to extract backend validation errors.
 */
export async function createProgram(data: CreateProgramData) {
    const payload = {
        ...data,
        id: data.id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7))
    };

    const res = await fetch("/api/programmes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create programme");
    }

    return res.json();
}
