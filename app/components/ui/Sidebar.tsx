"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Dumbbell, Settings, Layers, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/", icon: Layers, label: "Programs" },
    { href: "/log", icon: ClipboardList, label: "Log" },
    { href: "/exercises", icon: Dumbbell, label: "Exercises" },
    { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    // Hide sidebar on login/signup pages
    if (pathname === "/login" || pathname === "/signup") {
        return null;
    }

    return (
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border/70 bg-card/80 backdrop-blur-xl md:flex md:flex-col">
            <div className="flex-1 px-5 py-6">
                <div className="mb-8 flex items-center gap-3 px-3">
                    <Dumbbell className="h-6 w-6 text-accent" />
                    <p className="min-w-0 font-display text-lg font-semibold tracking-tight text-foreground">Workout</p>
                </div>

                <nav className="space-y-1">
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200 ${
                                    active
                                        ? "bg-background/80 text-foreground"
                                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                    }`}
                            >
                                <span
                                    className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full transition-colors ${
                                        active ? "bg-accent" : "bg-transparent"
                                    }`}
                                />
                                <Icon className={`h-4 w-4 transition-colors ${active ? "text-accent" : "text-current"}`} />
                                <span className={`${active ? "font-medium" : "font-normal"}`}>{label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="px-5 py-5">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-200 hover:bg-danger/10 hover:text-danger"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
