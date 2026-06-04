import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "workout-theme";

function resolveSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: ThemeMode) {
    const resolved = theme === "system" ? resolveSystemTheme() : theme;
    document.documentElement.classList.toggle("light", resolved === "light");
}

/**
 * Manages the root theme class for the Vite client.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
    });

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem(STORAGE_KEY, theme);

        if (theme !== "system") return;

        const media = window.matchMedia("(prefers-color-scheme: light)");
        const handleChange = () => applyTheme("system");
        media.addEventListener("change", handleChange);
        return () => media.removeEventListener("change", handleChange);
    }, [theme]);

    const value = useMemo(
        () => ({
            theme,
            setTheme: setThemeState,
        }),
        [theme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return context;
}
