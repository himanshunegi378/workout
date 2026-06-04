"use client";

import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

export function SignOutButton() {
    const navigate = useNavigate();

    async function handleSignOut() {
        await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => null);
        navigate("/login");
        
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
