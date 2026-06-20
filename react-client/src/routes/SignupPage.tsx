import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Eye, EyeOff, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

/**
 * Registers a new user and signs them in through the backend auth API.
 */
export default function SignupPage() {
    const navigate = useNavigate();
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
            const res = await apiFetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.trim().toLowerCase(),
                    password,
                }),
            });

            if (!res.ok) {
                const data = (await res.json().catch(() => ({}))) as { error?: string };
                throw new Error(data.error || "Failed to create account");
            }

            const signInResult = await apiFetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.trim().toLowerCase(),
                    password,
                }),
            });

            navigate(signInResult.ok ? "/" : "/login");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-[100dvh] flex-col items-center justify-start overflow-hidden px-4 py-10 sm:justify-center sm:px-6 sm:py-0 lg:px-8">
            <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative z-10 w-full max-w-sm animate-slide-up">
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 ring-1 ring-accent/20">
                        <Dumbbell className="h-8 w-8 text-accent" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-foreground">Create Account</h1>
                    <p className="mt-1 text-sm text-muted-foreground/90">Join and start tracking your workouts</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl bg-card/75 p-5 shadow-none sm:p-6">
                    <div className="space-y-1.5">
                        <label htmlFor="signup-username" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90">
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
                            className="w-full rounded-2xl bg-background/55 px-4 py-3 font-body text-base text-foreground placeholder:text-muted-foreground/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/40"
                        />
                        {username.length > 0 && username.trim().length < 3 ? (
                            <p className="text-xs font-medium text-danger">At least 3 characters</p>
                        ) : null}
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="signup-password" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90">
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
                                className="w-full rounded-2xl bg-background/55 px-4 py-3 pr-12 font-body text-base text-foreground placeholder:text-muted-foreground/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/40"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/90 transition-colors hover:text-foreground"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {password.length > 0 && password.length < 6 ? (
                            <p className="text-xs font-medium text-danger">At least 6 characters</p>
                        ) : null}
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="signup-confirm-password" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90">
                            Confirm Password
                        </label>
                        <input
                            id="signup-confirm-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-2xl bg-background/55 px-4 py-3 font-body text-base text-foreground placeholder:text-muted-foreground/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/40"
                        />
                        {confirmPassword.length > 0 && password !== confirmPassword ? (
                            <p className="text-xs font-medium text-danger">Passwords do not match</p>
                        ) : null}
                    </div>

                    {error ? (
                        <div className="animate-slide-up rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-display font-semibold text-accent-foreground transition-all duration-200 hover:bg-accent-hover active:animate-press disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
