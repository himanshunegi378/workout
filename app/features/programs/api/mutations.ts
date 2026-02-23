interface CreateProgramData {
    name: string;
    description: string | null;
}

export async function createProgram(data: CreateProgramData) {
    const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create workout program");
    }

    return res.json();
}
