import type { ReactNode } from "react";

type PageShellSize = "md" | "lg" | "xl";

const sizeClasses: Record<PageShellSize, string> = {
    md: "max-w-3xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
};

interface PageShellProps {
    children: ReactNode;
    header?: ReactNode;
    size?: PageShellSize;
    contentClassName?: string;
}

export function PageShell({ children, header, size = "xl", contentClassName = "" }: PageShellProps) {
    return (
        <div className="min-h-screen pb-20">
            {header}
            <main className={`mx-auto w-full ${sizeClasses[size]} px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 ${contentClassName}`.trim()}>
                {children}
            </main>
        </div>
    );
}
