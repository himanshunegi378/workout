interface CreateWorkoutData {
    name: string;
    description?: string | null;
}

export async function createWorkout(programmeId: string, data: CreateWorkoutData) {
    const res = await fetch(`/api/programmes/${programmeId}/workouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create workout");
    }

    return res.json();
}
