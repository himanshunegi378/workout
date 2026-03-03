"use client";

import { Plus } from "lucide-react";

interface QuickLogFABProps {
    onClick: () => void;
}

export function QuickLogFAB({ onClick }: QuickLogFABProps) {
    return (
        <div className="fixed bottom-24 right-4 z-40">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse pointer-events-none" />
            <button
                onClick={onClick}
                className="relative w-16 h-16 bg-accent hover:bg-accent-hover text-accent-foreground rounded-2xl shadow-xl 
                    flex items-center justify-center transition-all duration-300 
                    active:scale-90 active:rotate-12 group"
                title="Quick Log Set"
            >
                <Plus className="w-8 h-8 transition-transform duration-300 group-hover:rotate-90" />
            </button>
        </div>
    );
}
