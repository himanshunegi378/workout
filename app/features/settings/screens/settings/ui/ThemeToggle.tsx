"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

/**
 * A multi-mode toggle for switching between Light, Dark, and System themes.
 * 
 * Context:
 * Leverages `next-themes` to manage the user's preferred visual style. 
 * Includes a mount-guard to prevent server/client hydration mismatches.
 * 
 * Why:
 * - Accessibility & Preference: One-tap switching between themes to ensure 
 *   comfort in different lighting conditions (e.g., late-night gym sessions).
 */
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-12 w-full rounded-full border border-border/60 bg-muted/30 animate-pulse" />;
    }

    const options = [
        { value: "light", icon: Sun, label: "Light" },
        { value: "dark", icon: Moon, label: "Dark" },
        { value: "system", icon: Monitor, label: "System" },
    ];

    return (
        <div className="flex flex-wrap gap-2 rounded-[1.5rem] border border-border/60 bg-background/40 p-2">
            {options.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`flex min-w-[6.5rem] flex-1 items-center justify-center gap-2 rounded-[1.1rem] px-3 py-2 text-[11px] font-medium leading-none transition-colors sm:text-sm ${
                        theme === value
                            ? "border border-border/70 bg-background/90 text-foreground shadow-sm"
                            : "border border-transparent text-foreground/85 hover:border-border/60 hover:bg-background/60 hover:text-foreground"
                    }`}
                >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
}
