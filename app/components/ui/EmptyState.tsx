import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-border/70 bg-card/80">
                <Icon className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-1 font-display text-lg font-semibold tracking-tight text-foreground">
                {title}
            </h3>
            <p className="mb-6 max-w-sm text-sm leading-6 text-muted-foreground/90">
                {description}
            </p>
            {action}
        </div>
    );
}
