import { auth } from "@/auth";
import Link from "next/link";
import { MessageSquareMore } from "lucide-react";
import { Avatar } from "./ui/Avatar";
import { ThemeToggle } from "./ui/ThemeToggle";
import { ClearQueryCacheRow } from "./ui/ClearQueryCacheRow";
import { SignOutButton } from "@/app/components/SignOutButton";

/**
 * The primary container for the user settings and profile screen.
 * 
 * Context:
 * This server component aggregates user identification (via `auth()`), 
 * appearance preferences (theme toggling), and account management 
 * (sign-out functionality).
 * 
 * Why:
 * - Centralized Configuration: Provides a single location for users to 
 *   manage their global experience within the application.
 * - Dynamic Personalization: Reacts to session data to display the correct 
 *   user identity and profile initials.
 */
export async function SettingsContent() {
    const session = await auth();
    const username = session?.user?.name || "User";
    const initial = username.charAt(0).toUpperCase();

    return (
        <div className="flex flex-col gap-8">
            <section className="flex flex-col items-center gap-4 py-8">
                <Avatar initial={initial} />
                <h2 className="text-xl font-display font-semibold">{username}</h2>
            </section>

            <section className="bg-card rounded-2xl p-4 border border-border flex flex-col gap-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Appearance</h3>
                <ThemeToggle />
            </section>

            <section className="bg-card rounded-2xl p-4 border border-border">
                <Link
                    href="/settings/feedback"
                    className="flex items-center justify-between gap-4 rounded-xl transition-colors hover:bg-muted/40 p-1 -m-1"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                            <MessageSquareMore className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium">Feedback</span>
                            <span className="text-sm text-muted-foreground">Share a suggestion or report an issue</span>
                        </div>
                    </div>
                    <span className="text-sm font-medium text-accent">Open</span>
                </Link>
            </section>

            <ClearQueryCacheRow />

            <section className="bg-card rounded-2xl p-4 border border-border flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="font-medium">Sign Out</span>
                    <span className="text-sm text-muted-foreground">Log out of your account</span>
                </div>
                <SignOutButton />
            </section>
        </div>
    );
}
