export type PRType = "weight" | "reps" | "estimated_1rm";

/** Calculates an estimated one-rep max using the legacy Epley formula. */
export function epley1RM(weight: number | null, reps: number): number {
  if (!weight || weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

type PRCheckInput = {
  weight: number | null;
  reps: number;
  bestWeight: number | null;
  bestReps: number | null;
};

/** Matches the legacy PR priority: weight, then reps, then estimated 1RM. */
export function detectPR(input: PRCheckInput): PRType | null {
  const { weight, reps, bestWeight, bestReps } = input;

  if (bestWeight === null && bestReps === null) return null;

  if (weight !== null && weight > 0) {
    if (bestWeight === null || weight > bestWeight) {
      return "weight";
    }
  }

  if (bestReps === null || reps > bestReps) {
    return "reps";
  }

  const currentEst = epley1RM(weight, reps);
  const bestEst = epley1RM(bestWeight, bestReps ?? 1);
  if (currentEst > 0 && currentEst > bestEst) {
    return "estimated_1rm";
  }

  return null;
}
