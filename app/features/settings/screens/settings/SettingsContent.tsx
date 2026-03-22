import { auth } from "@/auth";
import { Avatar } from "./ui/Avatar";
import { ThemeToggle } from "./ui/ThemeToggle";
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
