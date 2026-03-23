"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Dumbbell, Settings, Layers } from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/", icon: Layers, label: "Programs" },
    { href: "/log", icon: ClipboardList, label: "Log" },
    { href: "/exercises", icon: Dumbbell, label: "Exercises" },
    { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
    const pathname = usePathname();

    // Hide on login/signup pages
    if (pathname === "/login" || pathname === "/signup") {
        return null;
    }

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/92 pb-safe backdrop-blur-xl md:hidden">
            <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-full px-2 py-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                                active
                                    ? "text-foreground"
                                    : "text-muted-foreground/90 hover:text-foreground"
                            }`}
                        >
                            <span className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                                active ? "bg-card/95 text-accent ring-1 ring-border/80" : "text-current"
                            }`}>
                                <Icon className="h-5 w-5" />
                            </span>
                            <span className="text-[11px] font-medium leading-none">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
