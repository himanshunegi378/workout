"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, ClipboardList, Dumbbell, Settings } from "lucide-react";

const navItems = [
    { href: "/", icon: Layers, label: "Programs" },
    { href: "/log", icon: ClipboardList, label: "Log" },
    { href: "/exercises", icon: Dumbbell, label: "Exercises" },
    { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 inset-x-0 bg-card/80 backdrop-blur-xl border-t border-border z-50 pb-safe shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_-4px_20px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center gap-0.5 p-2 transition-colors duration-200 ${active
                                ? "text-accent"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
