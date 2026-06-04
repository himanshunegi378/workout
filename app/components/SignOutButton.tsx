"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

export function SignOutButton() {
    const router = useRouter();

    async function handleSignOut() {
        await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => null);
        router.push("/login");
        router.refresh();
    }

    return (
        <button
            onClick={handleSignOut}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="Sign out"
            title="Sign out"
        >
            <LogOut className="w-5 h-5 text-muted-foreground" />
        </button>
    );
}
