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
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 bg-background/84 backdrop-blur-xl md:flex md:flex-col">
            <div className="flex-1 px-5 py-6">
                <div className="mb-10 px-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card/80">
                            <Dumbbell className="h-5 w-5 text-accent" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-display text-lg font-semibold tracking-tight text-foreground">Workout</p>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground/90">Training workspace</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-1.5">
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                    className={`group relative flex items-center gap-3 rounded-full px-3 py-2.5 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                                    active
                                        ? "bg-card/95 text-foreground"
                                        : "text-muted-foreground/90 hover:bg-card/55 hover:text-foreground"
                                    }`}
                            >
                                <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                                        active ? "bg-background text-accent" : "bg-transparent text-current"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                </span>
                                <span className={`${active ? "font-medium" : "font-normal"}`}>{label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="px-5 py-5">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-sm text-muted-foreground/90 transition-colors duration-200 hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
