"use client";

interface DashboardEmptyStateProps {
    message?: string;
    style?: React.CSSProperties;
    className?: string;
}

export function DashboardEmptyState({
    message = "No volume data found for the selected filters.",
    style,
    className = "bg-card border border-border rounded-xl p-6 text-center text-muted-foreground italic"
}: DashboardEmptyStateProps) {
    return (
        <div className={className} style={style}>
            {message}
        </div>
    );
}
