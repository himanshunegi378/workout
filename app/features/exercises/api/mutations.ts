interface CreateExerciseData {
    id?: string;
    name: string;
    description: string | null;
    muscle_group: string;
}

/**
 * Persistence layer for creating a new exercise in the global library.
 * 
 * Context:
 * Performs the low-level fetch request to the POST /api/exercises endpoint. 
 * Includes basic error parsing to extract backend validation errors.
 */
export async function createExercise(data: CreateExerciseData) {
    const payload = {
        ...data,
        id: data.id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7))
    };

    const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create exercise");
    }

    return res.json();
}

interface AddExerciseToWorkoutData {
    id?: string;
    exercise_id: string;
    sets_min: number;
    sets_max: number;
    reps_min: number;
    reps_max: number;
    rest_min: number;
    rest_max: number;
    tempo: string;
}

/**
 * Persistence layer for associating an exercise with a specific workout.
 * 
 * Context:
 * This function is used when a user "adds" an exercise to a workout, 
 * which involves creating a metadata record that links the two.
 */
export async function addExerciseToWorkout(programmeId: string, workoutId: string, data: AddExerciseToWorkoutData) {
    const payload = {
        ...data,
        id: data.id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7))
    };

    const res = await fetch(`/api/programmes/${programmeId}/workouts/${workoutId}/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add exercise");
    }

    return res.json();
}

export interface EditExerciseMetadataData {
    exercise_id?: string;
    sets_min?: number;
    sets_max?: number;
    reps_min?: number;
    reps_max?: number;
    rest_min?: number;
    rest_max?: number;
    tempo?: string;
}

/**
 * Persistence layer for updating an existing exercise's metadata (sets, reps, etc.) in a workout.
 * 
 * Context:
 * Performs a PATCH request to precisely update chosen parameters without 
 * affecting the global exercise definition itself.
 */
export async function editExerciseMetadata(
    programmeId: string,
    workoutId: string,
    metadataId: string,
    data: EditExerciseMetadataData
) {
    const res = await fetch(
        `/api/programmes/${programmeId}/workouts/${workoutId}/exercises/${metadataId}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }
    );

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to edit exercise metadata");
    }

    return res.json();
}

