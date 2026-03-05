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
        <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-card border-r border-border shrink-0">
            <div className="p-6">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center elevation-2">
                        <Dumbbell className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight">Workout</span>
                </div>

                <nav className="space-y-1">
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                                    ? "bg-accent/10 text-accent font-semibold elevation-1"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-110"}`} />
                                <span className="font-body text-sm">{label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-border">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-muted-foreground hover:bg-danger/10 hover:text-danger transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-body text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
