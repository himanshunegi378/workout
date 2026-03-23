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
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/90 pb-safe backdrop-blur-xl md:hidden">
            <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 transition-colors duration-200 ${
                                active
                                    ? "text-accent"
                                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                            }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-[10px] font-medium leading-none">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
