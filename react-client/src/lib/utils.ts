import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind CSS classes safely and conditionally.
 * Combines 'clsx' for logic and 'tailwind-merge' for conflict resolution.
 * 
 * @param {ClassValue[]} inputs - The classes to be merged.
 * @returns {string} The final merged class string.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
