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
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {description}
            </p>
            {action}
        </div>
    );
}
