interface CreateWorkoutData {
    id?: string;
    name: string;
    description?: string | null;
}

export async function createWorkout(programmeId: string, data: CreateWorkoutData) {
    const payload = {
        ...data,
        id: data.id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7))
    };

    const res = await fetch(`/api/programmes/${programmeId}/workouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create workout");
    }

    return res.json();
}
