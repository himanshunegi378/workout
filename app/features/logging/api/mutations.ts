interface LogSetData {
    workoutId: string;
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
