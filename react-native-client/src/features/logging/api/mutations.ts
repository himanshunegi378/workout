import { apiFetch } from '@/lib/api';
import { generateUUID } from '@/lib/uuid';

interface LogSetData {
  id?: string;
  workoutId?: string;
  exerciseWithMetadataId?: string;
  exerciseId?: string;
  setOrderIndex: number;
  weight: string;
  reps: string;
  rpe?: string;
  date?: string;
}

export async function logSet(data: LogSetData) {
  const payload = {
    ...data,
    id: data.id || generateUUID(),
  };

  const res = await apiFetch('/api/log/set', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to log set');
  }

  return res.json();
}

export async function deleteLogSet(setId: string) {
  const res = await apiFetch(`/api/log/set?setId=${encodeURIComponent(setId)}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete set');
  }

  return res.json();
}

export async function updateLogSet(data: { setId: string; weight: string; reps: string; rpe?: string }) {
  const res = await apiFetch('/api/log/set', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update set');
  }

  return res.json();
}
