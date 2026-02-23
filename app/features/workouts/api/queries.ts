export async function getWorkouts(groupId: string) {
    const res = await fetch(`/api/groups/${groupId}/workouts`);
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch workouts");
    }
    return res.json();
}

export async function getWorkoutById(groupId: string, workoutId: string) {
    const res = await fetch(`/api/groups/${groupId}/workouts/${workoutId}`);
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch workout");
    }
    return res.json();
}
