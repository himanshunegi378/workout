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
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-1/3 -right-32 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 -left-32 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

            <div className="w-full max-w-sm relative z-10 animate-slide-up">
                {/* Logo / Brand */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 ring-1 ring-accent/20">
                        <Dumbbell className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sign in to your workout tracker
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
                            htmlFor="login-username"
                            className="text-sm font-medium text-foreground"
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
                            className="w-full bg-muted border border-border rounded-xl
                                px-4 py-3 text-foreground placeholder:text-muted-foreground/50
                                focus:outline-none focus:ring-2 focus:ring-ring
                                focus:border-accent transition-all duration-200
                                font-body text-base"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="login-password"
                            className="text-sm font-medium text-foreground"
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
                        className="text-accent hover:text-accent-hover font-medium transition-colors"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
