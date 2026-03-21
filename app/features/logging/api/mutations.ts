/**
 * Data required to log or mark a set as completed.
 * Includes unique identifiers for offline first capabilities.
 */
interface LogSetData {
    id?: string; // Client-generated UUID for offline-first sync
    workoutId?: string;
    exerciseWithMetadataId?: string;
    exerciseId?: string;
    setOrderIndex: number;
    weight: string;
    reps: string;
    rpe?: string;
}

/**
 * Sends a request to log a specific set.
 * If no ID is provided in data, one is generated automatically to ensure uniqueness.
 * 
 * @param {LogSetData} data - The set data to log.
 * @returns {Promise<any>} The parsed JSON response from the server.
 * @throws {Error} If the server responds with an error or the request fails.
 */
export async function logSet(data: LogSetData) {
    // Generate an ID if not provided, ensuring every mutation attempt is unique
    const payload = {
        ...data,
        id: data.id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7))
    };

    const res = await fetch("/api/log/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "Failed to log set");
    }

    return res.json();
}

/**
 * Sends a request to delete a previously logged set by its unique ID.
 * 
 * @param {string} setId - The unique identifier of the set to delete.
 * @returns {Promise<any>} The parsed JSON response from the server.
 * @throws {Error} If the server responds with an error or the request fails.
 */
export async function deleteLogSet(setId: string) {
    const res = await fetch(`/api/log/set?setId=${setId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "Failed to delete set");
    }

    return res.json();
}

/**
 * Sends a request to update the weight, reps, or RPE of an existing logged set.
 * 
 * @param {Object} data - The data to update.
 * @param {string} data.setId - The unique identifier of the set to update.
 * @param {string} data.weight - The updated weight value.
 * @param {string} data.reps - The updated number of repetitions.
 * @param {string} [data.rpe] - The updated RPE (Rate of Perceived Exertion).
 * @returns {Promise<any>} The parsed JSON response from the server.
 * @throws {Error} If the server responds with an error or the request fails.
 */
export async function updateLogSet(data: { setId: string; weight: string; reps: string; rpe?: string }) {
    const res = await fetch("/api/log/set", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "Failed to update set");
    }

    return res.json();
}
