import { apiFetch } from '@/lib/api';
import { generateUUID } from '@/lib/uuid';

interface CreateExerciseData {
  id?: string;
  name: string;
  description: string | null;
  muscle_group: string;
}

export async function createExercise(data: CreateExerciseData) {
  const payload = {
    ...data,
    id: data.id || generateUUID(),
  };

  const res = await apiFetch('/api/exercises', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create exercise');
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

export async function addExerciseToWorkout(
  programmeId: string,
  workoutId: string,
  data: AddExerciseToWorkoutData
) {
  const payload = {
    ...data,
    id: data.id || generateUUID(),
  };

  const res = await apiFetch(`/api/programmes/${programmeId}/workouts/${workoutId}/exercises`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to add exercise');
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

export async function editExerciseMetadata(
  programmeId: string,
  workoutId: string,
  metadataId: string,
  data: EditExerciseMetadataData
) {
  const res = await apiFetch(
    `/api/programmes/${programmeId}/workouts/${workoutId}/exercises/${metadataId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to edit exercise metadata');
  }

  return res.json();
}
