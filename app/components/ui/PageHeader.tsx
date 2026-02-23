"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
    title: string;
    backHref?: string;
    action?: React.ReactNode;
}

export function PageHeader({ title, backHref, action }: PageHeaderProps) {
    return (
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
                {backHref ? (
                    <Link
                        href={backHref}
                        className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-foreground" />
                    </Link>
                ) : (
                    <div className="w-9" />
                )}
                <h1 className="font-display text-lg font-bold text-foreground flex-1 text-center">
                    {title}
                </h1>
                {action ? (
                    <div className="flex items-center gap-2">{action}</div>
                ) : (
                    <div className="w-9" />
                )}
            </div>
        </header>
    );
}
