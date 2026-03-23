"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Dumbbell, Eye, EyeOff, Loader2 } from "lucide-react";

/**
 * The standard authentication portal for existing users.
 * 
 * Context:
 * This page provides a secure entry point into the application. It handles 
 * credential validation via `next-auth` and redirecting users to their 
 * training dashboard upon success.
 * 
 * Why:
 * - Security First: Implements client-side validation and clear error feedback 
 *   to ensure a smooth and secure login experience.
 * - UX Visuals: Includes brand-consistent styling (Dumbbell icon, accent glows) 
 *   and helpful features like the password visibility toggle.
 * - Seamless Transition: Automatically refreshes the router state upon successful 
 *   sign-in to ensure all protected data displays correctly.
 */
export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const canSubmit = username.trim().length > 0 && password.length > 0 && !loading;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!canSubmit) return;

        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            username: username.trim().toLowerCase(),
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid username or password");
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    }

    return (
        <div className="relative flex min-h-[100dvh] flex-col items-center justify-start overflow-hidden px-4 py-10 sm:px-6 sm:justify-center sm:py-0 lg:px-8">
            {/* Background glow effects */}
            <div className="absolute top-1/3 -right-32 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 -left-32 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

            <div className="w-full max-w-sm relative z-10 animate-slide-up">
                {/* Logo / Brand */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 ring-1 ring-accent/20">
                        <Dumbbell className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                        Welcome Back
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground/90">
                        Sign in to your workout tracker
                    </p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-3xl border border-border/70 bg-card/90 p-5 shadow-none sm:p-6"
                >
                    {/* Username */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="login-username"
                            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90"
                        >
                            Username
                        </label>
                        <input
                            id="login-username"
                            type="text"
                            autoComplete="username"
                            autoFocus
                            placeholder="Your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-foreground placeholder:text-muted-foreground/80 transition-all duration-200
                                focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/40
                                font-body text-base"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="login-password"
                            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border border-border/70 bg-background/60 px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground/80 transition-all duration-200
                                    focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/40
                                    font-body text-base"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/90
                                    hover:text-foreground transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-2xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger animate-slide-up">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-accent/25 bg-accent px-5 py-3 font-display font-semibold text-accent-foreground transition-all duration-200 active:animate-press hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Signing in…
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                {/* Link to signup */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
