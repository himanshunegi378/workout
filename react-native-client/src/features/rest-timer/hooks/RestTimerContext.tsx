import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { createMMKV } from 'react-native-mmkv';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

interface RestTimerContextValue {
  isActive: boolean;
  timeLeft: number;
  totalDuration: number;
  isRunning: boolean;
  isMinimized: boolean;
  startTimer: (seconds: number, options?: { closeOnFinish?: boolean; startMinimized?: boolean }) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  addTime: (seconds: number) => void;
  stopTimer: () => void;
  openTimer: () => void;
  minimizeTimer: () => void;
}

interface TimerState {
  isActive: boolean;
  totalDuration: number;
  closeOnFinish: boolean;
  isPaused: boolean;
  isMinimized: boolean;
  expiryTimestamp: Date | null;
  timeLeftAtPause: number | null;
}

interface PersistedState {
  isActive: boolean;
  totalDuration: number;
  closeOnFinish: boolean;
  isPaused: boolean;
  isMinimized: boolean;
  expiryTimestamp: string | null;
  timeLeftAtPause: number | null;
}

const STORAGE_KEY = '@workout/rest-timer-state';
const RestTimerContext = createContext<RestTimerContextValue | null>(null);

// Configure foreground notifications handler
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

const mmkv = Platform.OS !== 'web' ? createMMKV({ id: 'rest-timer' }) : null;

const storage = {
  getItem: (key: string): string | null => {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    }
    return mmkv?.getString(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch {}
    } else {
      mmkv?.set(key, value);
    }
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch {}
    } else {
      mmkv?.remove(key);
    }
  },
};

/**
 * Manages the native rest timer lifecycle, orchestrating MMKV cache,
 * local push notifications, and tactile haptic feedbacks.
 */
export function RestTimerProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  
  const expiryTimestampRef = useRef<Date | null>(null);
  const closeOnFinishRef = useRef(false);
  const timeLeftAtPauseRef = useRef<number | null>(null);
  const intervalIdRef = useRef<any>(null);
  const notificationIdRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  // Request notifications permissions on mount
  useEffect(() => {
    async function requestPerms() {
      if (Platform.OS === 'web') return;
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
      } catch (err) {
        console.warn('Notifications permission request failed', err);
      }
    }
    requestPerms();
  }, []);

  const triggerHaptic = useCallback(async (type: 'start' | 'update' | 'success') => {
    if (Platform.OS === 'web') return;
    try {
      if (type === 'start') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (type === 'update') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (type === 'success') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      console.warn('Haptics execution failed', err);
    }
  }, []);

  const cancelNotification = useCallback(async () => {
    if (Platform.OS === 'web') return;
    if (notificationIdRef.current) {
      try {
        await Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
      } catch (err) {
        console.warn('Cancel notification failed', err);
      }
      notificationIdRef.current = null;
    }
  }, []);

  const scheduleNotification = useCallback(async (secondsRemaining: number) => {
    if (Platform.OS === 'web' || secondsRemaining <= 0) return;
    await cancelNotification();
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Rest Finished',
          body: 'Time to start your next set!',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsRemaining,
        },
      });
      notificationIdRef.current = id;
    } catch (err) {
      console.warn('Scheduling notification failed', err);
    }
  }, [cancelNotification]);

  // Clears active clock ticking intervals
  const clearIntervalTick = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  const resetState = useCallback(() => {
    clearIntervalTick();
    setIsActive(false);
    setTimeLeft(0);
    setTotalDuration(0);
    setIsPaused(false);
    setIsMinimized(true);
    expiryTimestampRef.current = null;
    timeLeftAtPauseRef.current = null;
    closeOnFinishRef.current = false;
    storage.removeItem(STORAGE_KEY);
  }, [clearIntervalTick]);

  const onExpire = useCallback(() => {
    triggerHaptic('success');
    resetState();
  }, [triggerHaptic, resetState]);

  // Sync state mutations to durable device persistence (MMKV or localStorage)
  const persistState = useCallback((overrides?: Partial<PersistedState>) => {
    const stateObj: PersistedState = {
      isActive: overrides?.isActive !== undefined ? overrides.isActive : (expiryTimestampRef.current !== null),
      totalDuration: overrides?.totalDuration !== undefined ? overrides.totalDuration : totalDuration,
      closeOnFinish: overrides?.closeOnFinish !== undefined ? overrides.closeOnFinish : closeOnFinishRef.current,
      isPaused: overrides?.isPaused !== undefined ? overrides.isPaused : isPaused,
      isMinimized: overrides?.isMinimized !== undefined ? overrides.isMinimized : isMinimized,
      expiryTimestamp: overrides?.expiryTimestamp !== undefined ? overrides.expiryTimestamp : expiryTimestampRef.current?.toISOString() ?? null,
      timeLeftAtPause: overrides?.timeLeftAtPause !== undefined ? overrides.timeLeftAtPause : timeLeftAtPauseRef.current,
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(stateObj));
  }, [totalDuration, isPaused, isMinimized]);

  // Clock tick routine to update remaining seconds
  const startClockTick = useCallback((targetExpiry: Date) => {
    clearIntervalTick();
    
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((targetExpiry.getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearIntervalTick();
        onExpire();
      }
    };
    
    tick(); // Initial invocation
    intervalIdRef.current = setInterval(tick, 500); // 500ms intervals to prevent UI drift
  }, [clearIntervalTick, onExpire]);

  // Restores session timer state on mount (Client-safe to prevent Hydration errors)
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const saved = storage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const persisted: PersistedState = JSON.parse(saved);
      if (persisted.isActive) {
        setIsActive(true);
        setTotalDuration(persisted.totalDuration);
        setIsMinimized(persisted.isMinimized);
        closeOnFinishRef.current = persisted.closeOnFinish;
        
        if (persisted.isPaused && persisted.timeLeftAtPause !== null) {
          setIsPaused(true);
          setTimeLeft(persisted.timeLeftAtPause);
          timeLeftAtPauseRef.current = persisted.timeLeftAtPause;
        } else if (persisted.expiryTimestamp) {
          const expiryDate = new Date(persisted.expiryTimestamp);
          const remaining = Math.max(0, Math.ceil((expiryDate.getTime() - Date.now()) / 1000));
          
          if (remaining <= 0) {
            // Already expired while app was dead
            setTimeout(() => onExpire(), 0);
          } else {
            setIsPaused(false);
            setTimeLeft(remaining);
            expiryTimestampRef.current = expiryDate;
            startClockTick(expiryDate);
            scheduleNotification(remaining);
          }
        }
      }
    } catch (err) {
      console.error('Failed to restore rest timer state:', err);
    }
  }, [startClockTick, scheduleNotification, onExpire]);

  const startTimer = useCallback((seconds: number, options: { closeOnFinish?: boolean; startMinimized?: boolean } = {}) => {
    triggerHaptic('start');
    clearIntervalTick();

    const targetDate = new Date(Date.now() + seconds * 1000);
    expiryTimestampRef.current = targetDate;
    timeLeftAtPauseRef.current = null;
    closeOnFinishRef.current = options.closeOnFinish || false;

    setIsActive(true);
    setTimeLeft(seconds);
    setTotalDuration(seconds);
    setIsPaused(false);
    setIsMinimized(options.startMinimized ?? true);

    startClockTick(targetDate);
    scheduleNotification(seconds);

    // Save state
    const stateObj: PersistedState = {
      isActive: true,
      totalDuration: seconds,
      closeOnFinish: options.closeOnFinish || false,
      isPaused: false,
      isMinimized: options.startMinimized ?? true,
      expiryTimestamp: targetDate.toISOString(),
      timeLeftAtPause: null,
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(stateObj));
  }, [clearIntervalTick, startClockTick, scheduleNotification, triggerHaptic]);

  const pauseTimer = useCallback(() => {
    if (!expiryTimestampRef.current || isPaused) return;

    triggerHaptic('update');
    clearIntervalTick();
    cancelNotification();

    const currentRemaining = Math.max(0, Math.ceil((expiryTimestampRef.current.getTime() - Date.now()) / 1000));
    
    setIsPaused(true);
    setTimeLeft(currentRemaining);
    timeLeftAtPauseRef.current = currentRemaining;

    persistState({
      isPaused: true,
      timeLeftAtPause: currentRemaining,
      expiryTimestamp: null,
    });
  }, [clearIntervalTick, cancelNotification, triggerHaptic, persistState, isPaused]);

  const resumeTimer = useCallback(() => {
    if (!isPaused || timeLeftAtPauseRef.current === null) return;

    triggerHaptic('start');
    
    const targetDate = new Date(Date.now() + timeLeftAtPauseRef.current * 1000);
    expiryTimestampRef.current = targetDate;
    
    setIsPaused(false);
    startClockTick(targetDate);
    scheduleNotification(timeLeftAtPauseRef.current);
    
    const remaining = timeLeftAtPauseRef.current;
    timeLeftAtPauseRef.current = null;

    persistState({
      isPaused: false,
      timeLeftAtPause: null,
      expiryTimestamp: targetDate.toISOString(),
    });
  }, [startClockTick, scheduleNotification, triggerHaptic, persistState, isPaused]);

  const addTime = useCallback((secondsToAdd: number) => {
    triggerHaptic('update');
    
    let currentRemaining = timeLeft;
    if (!isPaused && expiryTimestampRef.current) {
      currentRemaining = Math.max(0, Math.ceil((expiryTimestampRef.current.getTime() - Date.now()) / 1000));
    }

    const nextTimeLeft = Math.max(0, currentRemaining + secondsToAdd);
    
    if (nextTimeLeft === 0) {
      cancelNotification();
      onExpire();
      return;
    }

    setTimeLeft(nextTimeLeft);
    
    if (isPaused) {
      timeLeftAtPauseRef.current = nextTimeLeft;
      persistState({
        timeLeftAtPause: nextTimeLeft,
      });
    } else {
      const targetDate = new Date(Date.now() + nextTimeLeft * 1000);
      expiryTimestampRef.current = targetDate;
      startClockTick(targetDate);
      scheduleNotification(nextTimeLeft);
      
      persistState({
        expiryTimestamp: targetDate.toISOString(),
      });
    }
  }, [timeLeft, isPaused, startClockTick, scheduleNotification, cancelNotification, onExpire, triggerHaptic, persistState]);

  const stopTimer = useCallback(() => {
    triggerHaptic('update');
    cancelNotification();
    resetState();
  }, [cancelNotification, resetState, triggerHaptic]);

  const openTimer = useCallback(() => {
    setIsMinimized(false);
    persistState({ isMinimized: false });
  }, [persistState]);

  const minimizeTimer = useCallback(() => {
    setIsMinimized(true);
    persistState({ isMinimized: true });
  }, [persistState]);

  // Tear down timers on unmount
  useEffect(() => {
    return () => {
      clearIntervalTick();
    };
  }, [clearIntervalTick]);

  return (
    <RestTimerContext.Provider
      value={{
        isActive,
        timeLeft,
        totalDuration,
        isRunning: isActive && !isPaused,
        isMinimized,
        startTimer,
        pauseTimer,
        resumeTimer,
        addTime,
        stopTimer,
        openTimer,
        minimizeTimer,
      }}
    >
      {children}
    </RestTimerContext.Provider>
  );
}

export function useRestTimer(): RestTimerContextValue {
  const ctx = useContext(RestTimerContext);
  if (!ctx) {
    throw new Error('useRestTimer must be used inside <RestTimerProvider>');
  }
  return ctx;
}
