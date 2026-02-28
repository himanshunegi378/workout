"use client";

import { Plus } from "lucide-react";

interface QuickLogFABProps {
    onClick: () => void;
}

export function QuickLogFAB({ onClick }: QuickLogFABProps) {
    return (
        <div className="fixed bottom-24 right-4 z-40">
            <button
                onClick={onClick}
                className="w-14 h-14 bg-accent hover:bg-accent-hover text-accent-foreground rounded-full shadow-lg elevation-2 flex items-center justify-center transition-transform active:scale-95"
                title="Quick Log Set"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
}
