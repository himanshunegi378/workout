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
            <div className="p-2 -ml-2 rounded-2xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all active:scale-90 flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
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
        <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-border/40">
            <div className="grid grid-cols-[48px_1fr_48px] md:grid-cols-[auto_1fr_auto] items-center px-4 md:px-10 h-16 md:h-20 max-w-lg md:max-w-5xl mx-auto gap-2 md:gap-8">
                {/* Back Button Area */}
                <div className="flex items-center shrink-0">
                    {renderBack()}
                </div>

                {/* Title Area - Centered on mobile, Left on desktop */}
                <div className="flex flex-col min-w-0 text-center md:text-left">
                    <h1 className="font-display text-lg md:text-2xl font-bold text-foreground truncate tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[10px] md:text-xs font-bold text-muted-foreground/80 uppercase tracking-widest truncate">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Action Area */}
                <div className="flex items-center justify-end shrink-0 min-w-[40px]">
                    {action && (
                        <div className="flex items-center gap-3">
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
