export async function getPrograms() {
    const res = await fetch("/api/groups");
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch programs");
    }
    return res.json();
}

export async function getProgramById(id: string) {
    const res = await fetch(`/api/groups/${id}`);
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch program");
    }
    return res.json();
}
