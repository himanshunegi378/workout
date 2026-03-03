/**
 * Personal Record (PR) utility functions.
 *
 * Provides:
 *   - epley1RM: Epley formula for estimating 1-Rep Max
 *   - detectPR: Compare a new set against historical bests and return the PR type, or null
 */

export type PRType = "weight" | "reps" | "estimated_1rm";

/**
 * Epley formula: weight * (1 + reps/30)
 *
 * Returns the exact weight for 1-rep sets (the formula overestimates by ~3% at reps=1).
 * Returns 0 if weight is null/0 or reps is 0 (no meaningful estimate possible).
 */
export function epley1RM(weight: number | null, reps: number): number {
    if (!weight || weight <= 0 || reps <= 0) return 0;
    if (reps === 1) return weight;
    return weight * (1 + reps / 30);
}

interface PRCheckInput {
    weight: number | null;
    reps: number;
    /** Historical all-time max weight logged for this exercise. */
    bestWeight: number | null;
    /** Historical all-time max reps logged for this exercise (any weight). */
    bestReps: number | null;
}

/**
 * Determines whether the new set beats any historical PR.
 *
 * Priority: weight > reps > estimated_1rm
 *
 * Returns null if:
 *  - There is no prior history (first set ever — avoid false positives)
 *  - The set does not beat any existing PR
 */
export function detectPR(input: PRCheckInput): PRType | null {
    const { weight, reps, bestWeight, bestReps } = input;

    // No history at all — don't celebrate the very first set ever as a PR
    if (bestWeight === null && bestReps === null) return null;

    // 1. Max weight PR
    if (weight !== null && weight > 0) {
        if (bestWeight === null || weight > bestWeight) {
            return "weight";
        }
    }

    // 2. Max reps PR (at any weight)
    if (bestReps === null || reps > bestReps) {
        return "reps";
    }

    // 3. Estimated 1RM PR
    const currentEst = epley1RM(weight, reps);
    const bestEst = epley1RM(bestWeight, bestReps ?? 1);
    if (currentEst > 0 && currentEst > bestEst) {
        return "estimated_1rm";
    }

    return null;
}
