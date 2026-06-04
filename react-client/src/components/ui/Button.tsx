import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-accent text-accent-foreground hover:bg-accent-hover hover:-translate-y-px",
    secondary:
        "border border-border/70 bg-card/90 text-foreground hover:border-border hover:bg-muted/30",
    ghost:
        "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
    danger:
        "border border-danger/25 bg-danger/12 text-danger hover:bg-danger/18",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", className = "", children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3
                    rounded-full font-display text-sm font-semibold
                    transition-all duration-200 active:animate-press
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
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
