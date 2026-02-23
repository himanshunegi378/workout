"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="Sign out"
            title="Sign out"
        >
            <LogOut className="w-5 h-5 text-muted-foreground" />
        </button>
    );
}
