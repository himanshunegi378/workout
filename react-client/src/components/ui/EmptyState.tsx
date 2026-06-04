import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
    variant?: "default" | "compact";
}

export function EmptyState({ icon: Icon, title, description, action, variant = "default" }: EmptyStateProps) {
    const isCompact = variant === "compact";

    return (
        <div className={`flex flex-col items-center justify-center text-center animate-fade-in ${isCompact ? "py-8" : "py-16"}`}>
            <div className={`flex items-center justify-center rounded-full bg-card/80 ${isCompact ? "mb-3 h-10 w-10" : "mb-5 h-14 w-14"}`}>
                <Icon className={`${isCompact ? "h-4 w-4" : "h-6 w-6"} text-accent`} />
            </div>
            <h3 className={`font-display font-semibold tracking-tight text-foreground ${isCompact ? "mb-0.5 text-sm" : "mb-1 text-lg"}`}>
                {title}
            </h3>
            <p className={`max-w-sm text-muted-foreground/90 ${isCompact ? "mb-4 text-xs leading-5" : "mb-6 text-sm leading-6"}`}>
                {description}
            </p>
            {action}
        </div>
    );
}
