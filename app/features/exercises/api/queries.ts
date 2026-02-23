export async function getExercises() {
    const res = await fetch("/api/exercises");
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch exercises");
    }
    return res.json();
}
