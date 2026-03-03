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
