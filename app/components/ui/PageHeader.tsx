"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backHref?: string;
    action?: React.ReactNode;
    /** If true, shows a back button even if backHref is not provided (uses router.back) */
    showBackDefault?: boolean;
}

export function PageHeader({ title, subtitle, backHref, action, showBackDefault }: PageHeaderProps) {
    const router = useRouter();

    const renderBack = () => {
        if (!backHref && !showBackDefault) return null;

        const content = (
            <div className="flex items-center justify-center rounded-xl p-2 -ml-2 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground active:scale-95">
                <ChevronLeft className="h-5 w-5 md:h-5 md:w-5" />
            </div>
        );

        if (backHref) {
            return (
                <Link href={backHref} aria-label="Go back">
                    {content}
                </Link>
            );
        }

        return (
            <button onClick={() => router.back()} aria-label="Go back">
                {content}
            </button>
        );
    };

    return (
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto grid h-16 max-w-lg grid-cols-[44px_1fr_44px] items-center gap-2 px-4 md:h-20 md:max-w-5xl md:grid-cols-[auto_1fr_auto] md:gap-6 md:px-10">
                <div className="flex shrink-0 items-center">
                    {renderBack()}
                </div>

                <div className="min-w-0 text-center md:text-left">
                    <h1 className="truncate font-display text-lg font-semibold tracking-tight text-foreground md:text-2xl">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="truncate text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:text-xs">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="flex min-w-[44px] shrink-0 items-center justify-end">
                    {action && <div className="flex items-center gap-2">{action}</div>}
                </div>
            </div>
        </header>
    );
}
