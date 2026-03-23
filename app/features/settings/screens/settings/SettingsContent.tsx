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
        <div className="space-y-8">
            <section className="flex items-center gap-4 py-4">
                <Avatar initial={initial} />
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Profile</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">{username}</h2>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Appearance</h3>
                </div>
                <ThemeToggle />
            </section>

            <section className="space-y-3">
                <Link
                    href="/settings/feedback"
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:bg-muted/20 focus-visible:bg-muted/20"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-accent">
                            <MessageSquareMore className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block font-medium text-foreground">Feedback</span>
                            <span className="block text-sm text-muted-foreground">Share a suggestion or report an issue</span>
                        </div>
                    </div>
                </Link>

                <ClearQueryCacheRow />

                <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4">
                    <div className="min-w-0">
                        <span className="block font-medium text-foreground">Sign Out</span>
                        <span className="block text-sm text-muted-foreground">Log out of your account</span>
                    </div>
                    <SignOutButton />
                </div>
            </section>
        </div>
    );
}
