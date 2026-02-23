"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Dumbbell, Eye, EyeOff, Loader2 } from "lucide-react";

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
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-1/4 -left-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

            <div className="w-full max-w-sm relative z-10 animate-slide-up">
                {/* Logo / Brand */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 ring-1 ring-accent/20">
                        <Dumbbell className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                        Create Account
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Join and start tracking your workouts
                    </p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-card border border-border rounded-2xl p-6 space-y-5"
                >
                    {/* Username */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="signup-username"
                            className="text-sm font-medium text-foreground"
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
                            className="w-full bg-muted border border-border rounded-xl
                                px-4 py-3 text-foreground placeholder:text-muted-foreground/50
                                focus:outline-none focus:ring-2 focus:ring-ring
                                focus:border-accent transition-all duration-200
                                font-body text-base"
                        />
                        {username.length > 0 && username.trim().length < 3 && (
                            <p className="text-xs text-danger">
                                At least 3 characters
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="signup-password"
                            className="text-sm font-medium text-foreground"
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
                                className="w-full bg-muted border border-border rounded-xl
                                    px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground/50
                                    focus:outline-none focus:ring-2 focus:ring-ring
                                    focus:border-accent transition-all duration-200
                                    font-body text-base"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground
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
                            <p className="text-xs text-danger">
                                At least 6 characters
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="signup-confirm"
                            className="text-sm font-medium text-foreground"
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
                            className="w-full bg-muted border border-border rounded-xl
                                px-4 py-3 text-foreground placeholder:text-muted-foreground/50
                                focus:outline-none focus:ring-2 focus:ring-ring
                                focus:border-accent transition-all duration-200
                                font-body text-base"
                        />
                        {confirmPassword.length > 0 &&
                            password !== confirmPassword && (
                                <p className="text-xs text-danger">
                                    Passwords don&apos;t match
                                </p>
                            )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-danger text-sm animate-slide-up">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="w-full bg-accent hover:bg-accent-hover text-accent-foreground
                            font-display font-semibold py-3 px-5 rounded-xl
                            transition-all duration-200 active:animate-press
                            disabled:opacity-40 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2"
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
                        className="text-accent hover:text-accent-hover font-medium transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
