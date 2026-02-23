import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-accent hover:bg-accent-hover text-accent-foreground shadow-lg shadow-accent/20",
    secondary:
        "bg-muted hover:bg-border text-foreground border border-border",
    ghost:
        "hover:bg-muted text-muted-foreground hover:text-foreground",
    danger:
        "bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", className = "", children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3
                    rounded-xl font-display text-sm font-semibold
                    transition-all duration-200 active:animate-press
                    disabled:opacity-50 disabled:pointer-events-none
                    ${variantClasses[variant]} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
