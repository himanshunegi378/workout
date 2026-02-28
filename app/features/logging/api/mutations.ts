interface LogSetData {
    workoutId?: string;
    exerciseWithMetadataId?: string;
    exerciseId?: string;
    setOrderIndex: number;
    weight: string;
    reps: string;
}

export async function logSet(data: LogSetData) {
    const res = await fetch("/api/log/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

export async function updateLogSet(data: { setId: string; weight: string; reps: string }) {
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
