"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    /** Custom Tailwind classes for the spinner container. */
    className?: string;
    /** Size of the spinner icon. Defaults to 4 (16px). */
    size?: number;
    /** Text to display alongside the spinner. */
    label?: string;
}

/**
 * A standardized loading indicator for the application.
 * Uses lucide-react Loader2 with a consistent animation.
 * 
 * @param {LoadingSpinnerProps} props - Component properties.
 * @returns {JSX.Element} The rendered loading spinner.
 */
export function LoadingSpinner({ 
    className, 
    size = 4, 
    label 
}: LoadingSpinnerProps) {
    const sizeMap: Record<number, string> = {
        4: "h-4 w-4",
        5: "h-5 w-5",
        6: "h-6 w-6",
        8: "h-8 w-8",
        10: "h-10 w-10",
        12: "h-12 w-12"
    };

    const iconSize = sizeMap[size] || "h-4 w-4";

    return (
        <div className={cn("flex items-center justify-center gap-2 text-muted-foreground", className)}>
            <Loader2 className={cn("animate-spin", iconSize)} />
            {label && <span className="text-sm font-medium">{label}</span>}
        </div>
    );
}
