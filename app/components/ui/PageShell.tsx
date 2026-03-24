import type { ReactNode } from "react";
import { PageHeaderActionsProvider, PageHeaderHostMount } from "@/app/features/page-header/internal";

type PageShellSize = "md" | "lg" | "xl";
type PageShellSpacing = "default" | "comfortable";

const sizeClasses: Record<PageShellSize, string> = {
    md: "max-w-3xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
};

const spacingClasses: Record<PageShellSpacing, string> = {
    default: "py-4 sm:py-6 lg:py-8",
    comfortable: "py-6 sm:py-8 lg:py-10",
};

interface PageShellProps {
    children: ReactNode;
    header?: ReactNode;
    size?: PageShellSize;
    spacing?: PageShellSpacing;
    contentClassName?: string;
}

export function PageShell({ children, header, size = "xl", spacing = "default", contentClassName = "" }: PageShellProps) {
    return (
        <PageHeaderActionsProvider>
            <div className="min-h-screen pb-20">
                {header ? <PageHeaderHostMount /> : null}
                {header}
                <main className={`mx-auto w-full ${sizeClasses[size]} px-4 sm:px-6 lg:px-8 ${spacingClasses[spacing]} ${contentClassName}`.trim()}>
                    {children}
                </main>
            </div>
        </PageHeaderActionsProvider>
    );
}
