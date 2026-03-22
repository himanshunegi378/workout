"use client";

import { Plus } from "lucide-react";

/**
 * Props for the QuickLogFAB component.
 */
interface QuickLogFABProps {
    /** Callback function to execute when the button is clicked. */
    onClick: () => void;
}

/**
 * A Floating Action Button (FAB) for the quick logging feature.
 * Positioned fixed at the bottom right with a pulsing background effect.
 * 
 * @param {QuickLogFABProps} props - Component properties.
 * @returns {JSX.Element} The rendered FAB.
 */
export function QuickLogFAB({ onClick }: QuickLogFABProps) {
    return (
        <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40">
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
