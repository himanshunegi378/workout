"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Dumbbell, Eye, EyeOff, Loader2 } from "lucide-react";

/**
 * The entry point for new users to register and join the platform.
 * 
 * Context:
 * This page manages the user registration lifecycle, including initial data 
 * capture, account creation via the `/api/auth/signup` endpoint, and 
 * subsequent automatic session establishment.
 * 
 * Why:
 * - Reduced Friction: Combines account creation and login into a single 
 *   workflow ("Auto Sign-in") to get users into the app as quickly as possible.
 * - Real-time Validation: Provides immediate feedback on username length, 
 *   password strength, and password matching to prevent form submission errors.
 * - Secure Onboarding: Ensures that all user IDs are standardized (lowercase) 
 *   to prevent duplication and confusion in the backend database.
 */
export default function SignupPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const canSubmit =
        username.trim().length >= 3 &&
        password.length >= 6 &&
        password === confirmPassword &&
        !loading;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!canSubmit) return;

        setLoading(true);
        setError("");

        try {
            // 1. Create the account
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.trim().toLowerCase(),
                    password,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to create account");
            }

            // 2. Auto sign-in after successful signup
            const signInResult = await signIn("credentials", {
                username: username.trim().toLowerCase(),
                password,
                redirect: false,
            });

            if (signInResult?.error) {
                // Account was created but auto-login failed — send to login
                router.push("/login");
                return;
            }

            router.push("/");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong"
            );
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-[100dvh] flex-col items-center justify-start overflow-hidden px-4 py-10 sm:px-6 sm:justify-center sm:py-0 lg:px-8">
            {/* Background glow effects */}
            <div className="absolute top-1/4 -left-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

            <div className="w-full max-w-sm relative z-10 animate-slide-up">
                {/* Logo / Brand */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 ring-1 ring-accent/20">
                        <Dumbbell className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                        Create Account
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground/90">
                        Join and start tracking your workouts
                    </p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-3xl bg-card/75 p-5 shadow-none sm:p-6"
                >
                    {/* Username */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="signup-username"
                            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90"
                        >
                            Username
                        </label>
                        <input
                            id="signup-username"
                            type="text"
                            autoComplete="username"
                            autoFocus
                            placeholder="e.g. ironlifter"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-2xl bg-background/55 px-4 py-3 text-foreground placeholder:text-muted-foreground/80 transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-ring/40
                                font-body text-base"
                        />
                        {username.length > 0 && username.trim().length < 3 && (
                            <p className="text-xs font-medium text-danger">
                                At least 3 characters
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="signup-password"
                            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Min 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl bg-background/55 px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground/80 transition-all duration-200
                                    focus:outline-none focus:ring-2 focus:ring-ring/40
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
                        {password.length > 0 && password.length < 6 && (
                            <p className="text-xs font-medium text-danger">
                                At least 6 characters
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="signup-confirm"
                            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="signup-confirm"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-2xl bg-background/55 px-4 py-3 text-foreground placeholder:text-muted-foreground/80 transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-ring/40
                                font-body text-base"
                        />
                        {confirmPassword.length > 0 &&
                            password !== confirmPassword && (
                                <p className="text-xs font-medium text-danger">
                                    Passwords don&apos;t match
                                </p>
                            )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger animate-slide-up">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-display font-semibold text-accent-foreground transition-all duration-200 active:animate-press hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating account…
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* Link to login */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
