"use client";

import { useState, useEffect, useMemo } from "react";
import { calculateWorkoutProgress } from "../screens/exercise-list/progress";
import { WorkoutDetailsResponse } from "../types";

/**
 * A custom hook to manage the live state of a workout session.
 * 
 * Context:
 * This hook centralizes the ephemeral state (timer) and derived metrics (volume, 
 * progress) for a training session, separating them from the HUD view logic.
 */
export function useWorkoutSession(data: WorkoutDetailsResponse | undefined) {
    const [secondsElapsed, setSecondsElapsed] = useState(0);

    // Live Timer Logic
    useEffect(() => {
        if (!data?.session?.start_time || data?.session?.end_time) return;
        const start = new Date(data.session.start_time).getTime();

        const interval = setInterval(() => {
            setSecondsElapsed(Math.floor((Date.now() - start) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [data?.session?.start_time, data?.session?.end_time]);

    const metrics = useMemo(() => {
        if (!data) return null;
        return calculateWorkoutProgress(data.workout, data.session);
    }, [data]);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs > 0 ? `${hrs}:` : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return {
        secondsElapsed,
        displayTime: formatTime(secondsElapsed),
        metrics,
        workout: data?.workout,
        session: data?.session,
        previousLogsByExercise: data?.previousLogsByExercise,
    };
}
