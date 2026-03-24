"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { usePageHeaderActions } from "../context/PageHeaderContext";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backHref?: string;
    action?: React.ReactNode;
    /** If true, shows a back button even if backHref is not provided (uses router.back) */
    showBackDefault?: boolean;
}

/**
 * Renders the sticky page header with optional back navigation and action slots.
 */
export function PageHeader({ title, subtitle, backHref, action, showBackDefault }: PageHeaderProps) {
    const router = useRouter();
    const headerActions = usePageHeaderActions();

    /**
     * Chooses between link-based and history-based back navigation.
     */
    const renderBack = () => {
        if (!backHref && !showBackDefault) return null;

        const content = (
            <div className="flex items-center justify-center rounded-full p-2.5 -ml-2 text-muted-foreground transition-colors hover:bg-muted/45 hover:text-foreground active:scale-95">
                <ChevronLeft className="h-5 w-5" />
            </div>
        );

        if (backHref) {
            return (
                <Link
                    href={backHref}
                    aria-label="Go back"
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    {content}
                </Link>
            );
        }

        return (
            <button
                onClick={() => router.back()}
                aria-label="Go back"
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                {content}
            </button>
        );
    };

    return (
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/84 backdrop-blur-xl">
            <div className="mx-auto grid h-16 w-full max-w-6xl grid-cols-[44px_1fr_44px] items-center gap-2 px-4 sm:px-6 md:h-[4.5rem] md:grid-cols-[auto_1fr_auto] md:gap-6 lg:px-8">
                <div className="flex shrink-0 items-center">
                    {renderBack()}
                </div>

                <div className="min-w-0 text-center md:text-left">
                    <h1 className="truncate font-display text-lg font-semibold tracking-[-0.03em] text-foreground md:text-[1.75rem]">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="truncate text-[11px] uppercase tracking-[0.16em] text-muted-foreground/90 md:mt-1 md:text-xs">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="flex min-w-[44px] shrink-0 items-center justify-end">
                    {(action || headerActions?.actions.length) ? (
                        <div className="flex items-center gap-2">
                            {headerActions?.actions.map((item) => (
                                <div key={item.id} className="flex items-center">
                                    {item.node}
                                </div>
                            ))}
                            {action}
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
}
