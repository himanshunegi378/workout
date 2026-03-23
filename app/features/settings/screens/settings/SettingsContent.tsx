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
        <div className="space-y-10">
            <section className="flex items-center gap-4 border-b border-border/60 pb-6">
                <Avatar initial={initial} />
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/85">Profile</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">{username}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground/90">
                        Keep your theme, feedback, and account tools in one place.
                    </p>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/85">Appearance</h3>
                </div>
                <ThemeToggle />
            </section>

            <section className="space-y-1 border-t border-border/60 pt-2">
                <Link
                    href="/settings/feedback"
                    className="group flex items-center justify-between gap-4 rounded-2xl py-4 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/70 text-accent">
                            <MessageSquareMore className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block font-medium text-foreground">Feedback</span>
                            <span className="block text-sm text-foreground/85">Share a suggestion or report an issue</span>
                        </div>
                    </div>
                </Link>

                <ClearQueryCacheRow />
                <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-4">
                    <div className="min-w-0">
                        <span className="block font-medium text-foreground">Sign Out</span>
                        <span className="block text-sm text-foreground/85">Log out of your account</span>
                    </div>
                    <SignOutButton />
                </div>
            </section>
        </div>
    );
}
