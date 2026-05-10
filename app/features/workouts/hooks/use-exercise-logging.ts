"use client";

import { useState, useEffect } from "react";
import { 
    useLogSet, 
    useUpdateLogSet, 
    useDeleteLogSet, 
    getLastLog 
} from "@/app/features/logging";
import { useRestTimer } from "@/app/features/rest-timer";
import { usePRCelebration } from "@/app/features/personal-records/PRCelebrationContext";
import { ExerciseLog } from "../types";

interface UseExerciseLoggingProps {
    workoutId: string;
    exerciseId: string;
    exerciseName: string;
    initialLogs: ExerciseLog[];
    restMin: number;
}

/**
 * A custom hook to manage the interactive logging flow for a single exercise.
 * 
 * Context:
 * This hook encapsulates the state machine for logging sets, including optimistic 
 * UI updates, pre-filling data from history, and triggering session-wide side effects 
 * (rest timer and PR celebrations).
 */
export function useExerciseLogging({
    workoutId,
    exerciseId,
    exerciseName,
    initialLogs,
    restMin,
}: UseExerciseLoggingProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeSetIndex, setActiveSetIndex] = useState(0);
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [rpe, setRpe] = useState<number | null>(null);
    const [previousLog, setPreviousLog] = useState<{ weight: number | null; reps: number } | null>(null);

    const { startTimer } = useRestTimer();
    const { celebrate } = usePRCelebration();

    const { mutate: logSetMutation, isPending: isSaving } = useLogSet();
    const { mutate: updateSetMutation, isPending: isUpdating } = useUpdateLogSet();
    const { mutate: deleteSetMutation, isPending: isDeleting } = useDeleteLogSet();

    const currentLog = initialLogs.find((l) => l.set_order_index === activeSetIndex);

    const openDrawer = async (setIndex: number) => {
        setActiveSetIndex(setIndex);
        const log = initialLogs.find((l) => l.set_order_index === setIndex);

        let initialWeight = "";
        let initialReps = "";

        if (log) {
            initialWeight = log.weight?.toString() || "";
            initialReps = log.reps.toString();
            setRpe(log.rpe);
        } else {
            const previousSetLog = initialLogs
                .filter((l) => l.set_order_index < setIndex)
                .sort((a, b) => b.set_order_index - a.set_order_index)[0];

            if (previousSetLog) {
                initialWeight = previousSetLog.weight?.toString() || "";
                initialReps = previousSetLog.reps.toString();
                setRpe(previousSetLog.rpe);
            } else {
                setRpe(null);
            }
        }

        setWeight(initialWeight);
        setReps(initialReps);
        setIsDrawerOpen(true);

        try {
            const data = await getLastLog(exerciseId);
            setPreviousLog(data);
            if (!log && !initialWeight && !initialReps && data) {
                setWeight(data.weight?.toString() || "");
                setReps(data.reps.toString());
            }
        } catch {
            setPreviousLog(null);
        }
    };

    const closeDrawer = () => setIsDrawerOpen(false);

    const saveSet = (exerciseWithMetadataId: string) => {
        if (!reps) return;
        const optimisticId = crypto.randomUUID();

        if (currentLog) {
            closeDrawer();
            updateSetMutation({ setId: currentLog.id, weight, reps, rpe: rpe?.toString() });
        } else {
            closeDrawer();
            startTimer(restMin, { closeOnFinish: true });
            logSetMutation(
                { 
                    id: optimisticId, 
                    workoutId, 
                    exerciseWithMetadataId, 
                    exerciseId, 
                    setOrderIndex: activeSetIndex, 
                    weight, 
                    reps, 
                    rpe: rpe?.toString() 
                },
                { 
                    onSuccess: (newLog) => { 
                        if (newLog.pr) celebrate(newLog.pr, exerciseName); 
                    } 
                }
            );
        }
    };

    const performDeleteSet = () => {
        if (!currentLog) return;
        deleteSetMutation(currentLog.id, {
            onSuccess: () => {
                closeDrawer();
            },
        });
    };

    return {
        logs: initialLogs,
        activeSetIndex,
        weight,
        setWeight,
        reps,
        setReps,
        rpe,
        setRpe,
        previousLog,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        saveSet,
        deleteSet: performDeleteSet,
        isSaving: isSaving || isUpdating,
        isDeleting,
        currentLog,
    };
}
