import { auth } from "@/auth";
import { Avatar } from "./ui/Avatar";
import { ThemeToggle } from "./ui/ThemeToggle";
import { SignOutButton } from "@/app/components/SignOutButton";

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
