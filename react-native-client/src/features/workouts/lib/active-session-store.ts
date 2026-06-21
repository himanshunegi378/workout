import { Platform } from 'react-native';
import { createMMKV } from 'react-native-mmkv';

export interface ActiveSession {
  programmeId: string;
  workoutId: string;
  startTime: number;
  name: string;
}

const STORAGE_KEY = '@workout/active-session';
const mmkv = Platform.OS !== 'web' ? createMMKV({ id: 'active-session' }) : null;

export const activeSessionStore = {
  startSession: (programmeId: string, workoutId: string, name: string, startTime?: number) => {
    const session: ActiveSession = {
      programmeId,
      workoutId,
      startTime: startTime || Date.now(),
      name,
    };
    const value = JSON.stringify(session);
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch {}
    } else {
      mmkv?.set(STORAGE_KEY, value);
    }
  },

  getActiveSession: (): ActiveSession | null => {
    let raw: string | null = null;
    if (Platform.OS === 'web') {
      try {
        raw = localStorage.getItem(STORAGE_KEY);
      } catch {}
    } else {
      raw = mmkv?.getString(STORAGE_KEY) ?? null;
    }
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clearActiveSession: () => {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    } else {
      mmkv?.remove(STORAGE_KEY);
    }
  },
};
