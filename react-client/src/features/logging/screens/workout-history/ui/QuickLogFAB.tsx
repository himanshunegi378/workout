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
            <div className="pointer-events-none absolute inset-0 rounded-full bg-accent/12 blur-xl" />
            <button
                onClick={onClick}
                className="relative flex h-14 w-14 items-center justify-center rounded-full border border-accent/25 bg-accent !text-background transition-colors hover:bg-accent-hover active:scale-95"
                title="Quick Log Set"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
}
