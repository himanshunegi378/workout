import { describe, it, expect } from "vitest";
import { epley1RM, detectPR, type PRType } from "./pr-utils";

describe("epley1RM", () => {
    it("returns weight for 1 rep", () => {
        expect(epley1RM(100, 1)).toBe(100);
    });

    it("estimates 1RM correctly for multiple reps", () => {
        // 100kg x 5 reps -> 100 * (1 + 5/30) ~= 116.67
        expect(epley1RM(100, 5)).toBeCloseTo(116.67, 1);
    });

    it("returns 0 when weight is null", () => {
        expect(epley1RM(null, 10)).toBe(0);
    });

    it("returns 0 when weight is 0", () => {
        expect(epley1RM(0, 10)).toBe(0);
    });
});

describe("detectPR", () => {
    it("returns null when no historical bests exist (first set ever)", () => {
        expect(detectPR({ weight: 100, reps: 5, bestWeight: null, bestReps: null })).toBeNull();
    });

    it("detects max weight PR", () => {
        expect(detectPR({ weight: 110, reps: 5, bestWeight: 100, bestReps: 5 })).toBe("weight");
    });

    it("detects max reps PR (same weight)", () => {
        expect(detectPR({ weight: 100, reps: 8, bestWeight: 100, bestReps: 5 })).toBe("reps");
    });

    it("returns null for bodyweight reps that are not a PR", () => {
        // Bodyweight exercise: weight=null, bestWeight=null.
        // reps=5 vs bestReps=8 -> NOT a reps PR. No weight to compare -> null.
        expect(detectPR({ weight: null, reps: 5, bestWeight: null, bestReps: 8 })).toBeNull();
    });

    it("detects weight PR is prioritised over estimated_1rm", () => {
        // Weight PR fires before estimated_1rm check
        expect(detectPR({ weight: 110, reps: 5, bestWeight: 100, bestReps: 5 })).toBe("weight");
    });

    it("returns null when not a PR", () => {
        expect(detectPR({ weight: 90, reps: 5, bestWeight: 100, bestReps: 8 })).toBeNull();
    });

    it("detects weight PR when bestReps is null but bestWeight exists", () => {
        expect(detectPR({ weight: 105, reps: 5, bestWeight: 100, bestReps: null })).toBe("weight");
    });
});

// Silence unused import lint by reference
const _: PRType = "weight";
void _;
