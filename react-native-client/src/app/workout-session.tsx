import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/button';

// REST Timer feature
import { useRestTimer } from '@/features/rest-timer';

// Exercises feature
import { AddExerciseDrawer } from '@/features/exercises';

// Logging feature
import {
  LogSetDrawer,
  SetTracker,
  useLogSet,
  useUpdateLogSet,
  useDeleteLogSet,
  useLastLog,
  getLastLog,
} from '@/features/logging';

// Workouts feature
import {
  useWorkoutDetails,
  useFinishWorkout,
  activeSessionStore,
  EditExerciseMetadataDrawer,
} from '@/features/workouts';

export default function WorkoutSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ programmeId: string; workoutId: string }>();

  // Resolve Active Session metadata from MMKV if not supplied by route parameters
  const resolvedParams = useMemo(() => {
    if (params.programmeId && params.workoutId) {
      return { programmeId: params.programmeId, workoutId: params.workoutId };
    }
    const cached = activeSessionStore.getActiveSession();
    if (cached) {
      return { programmeId: cached.programmeId, workoutId: cached.workoutId };
    }
    return null;
  }, [params.programmeId, params.workoutId]);

  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { startTimer } = useRestTimer();

  const { data, isLoading, isError, refetch } = useWorkoutDetails(
    resolvedParams?.programmeId || '',
    resolvedParams?.workoutId || ''
  );

  const finishWorkout = useFinishWorkout();
  const logSetMutation = useLogSet();
  const updateSetMutation = useUpdateLogSet();
  const deleteSetMutation = useDeleteLogSet();

  // Active workout timer ticking state
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Finish confirmation state
  const [isFinishing, setIsFinishing] = useState(false);

  // Add ad-hoc exercise drawer state
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);

  // Edit metadata drawer state
  const [isEditMetadataOpen, setIsEditMetadataOpen] = useState(false);
  const [editMetadataParams, setEditMetadataParams] = useState<{
    id: string;
    exerciseName: string;
    sets: number;
    reps: number;
    rest: number;
    tempo: string;
  } | null>(null);

  // Set logging drawer state
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [logParams, setLogParams] = useState<{
    exerciseName: string;
    exerciseId: string;
    ewmId: string;
    setIndex: number;
    weight: string;
    reps: string;
    rpe: number | null;
    isEdit: boolean;
    logId?: string;
    previousLog?: { weight: number | null; reps: number } | null;
  } | null>(null);

  // Tick the live session timer based on the start time stored in MMKV
  useEffect(() => {
    const sessionInfo = activeSessionStore.getActiveSession();
    if (!sessionInfo) return;

    const tick = () => {
      setSecondsElapsed(Math.max(0, Math.floor((Date.now() - sessionInfo.startTime) / 1000)));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format seconds elapsed to H:MM:SS or MM:SS
  const displayTime = useMemo(() => {
    const hrs = Math.floor(secondsElapsed / 3600);
    const mins = Math.floor((secondsElapsed % 3600) / 60);
    const secs = secondsElapsed % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [secondsElapsed]);

  // Derived progress statistics
  const metrics = useMemo(() => {
    if (!data || !data.workout) {
      return {
        totalExercises: 0,
        completedExercises: 0,
        progressPercentage: 0,
        totalSetsDone: 0,
        totalVolume: 0,
        logsByEwm: {} as Record<string, any[]>,
      };
    }

    const visibleExercises = data.workout.exercisesWithMetadata || [];
    const sessionLogs = data.session?.sessionExerciseLogs || [];

    // Group logs by exerciseWithMetadata ID
    const logsByEwm: Record<string, any[]> = {};
    sessionLogs.forEach((sessionLog) => {
      if (!sessionLog.exercise_with_metadata_id || !sessionLog.exerciseLog) return;
      const key = sessionLog.exercise_with_metadata_id;
      if (!logsByEwm[key]) {
        logsByEwm[key] = [];
      }
      logsByEwm[key].push(sessionLog.exerciseLog);
    });

    // Sort logs within each exercise by set order index
    Object.values(logsByEwm).forEach((logs) => {
      logs.sort((a, b) => a.set_order_index - b.set_order_index);
    });

    // Find ad-hoc exercises completed (without templates)
    const completedAdHocExercises = new Set<string>();
    sessionLogs.forEach((sessionLog) => {
      if (!sessionLog.exercise_with_metadata_id && sessionLog.exerciseLog?.exerciseId) {
        completedAdHocExercises.add(sessionLog.exerciseLog.exerciseId);
      }
    });

    const prescribedCompletedExercises = visibleExercises.filter((ewm) => {
      const logs = logsByEwm[ewm.id] || [];
      return logs.length >= (ewm.sets_min || 1);
    }).length;

    const totalExercises = visibleExercises.length + completedAdHocExercises.size;
    const completedExercises = prescribedCompletedExercises + completedAdHocExercises.size;
    const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

    let totalVolume = 0;
    let totalSetsDone = 0;
    sessionLogs.forEach((sel) => {
      if (sel.exerciseLog) {
        totalVolume += (sel.exerciseLog.weight || 0) * sel.exerciseLog.reps;
        totalSetsDone++;
      }
    });

    return {
      totalExercises,
      completedExercises,
      progressPercentage,
      totalSetsDone,
      totalVolume,
      logsByEwm,
    };
  }, [data]);

  // Open Log Drawer prefilled with history or previous sets
  const handleOpenSetLogDrawer = async (
    exerciseName: string,
    exerciseId: string,
    ewmId: string,
    setIndex: number,
    restMin: number
  ) => {
    const exerciseLogs = metrics.logsByEwm[ewmId] || [];
    const log = exerciseLogs.find((l) => l.set_order_index === setIndex);

    let initialWeight = '';
    let initialReps = '';
    let initialRpe: number | null = null;
    let isEdit = false;
    let logId: string | undefined;

    if (log) {
      initialWeight = log.weight?.toString() || '';
      initialReps = log.reps.toString();
      initialRpe = log.rpe;
      isEdit = true;
      logId = log.id;
    } else {
      // Pre-fill from previous set in the active session
      const previousSetLog = exerciseLogs
        .filter((l) => l.set_order_index < setIndex)
        .sort((a, b) => b.set_order_index - a.set_order_index)[0];

      if (previousSetLog) {
        initialWeight = previousSetLog.weight?.toString() || '';
        initialReps = previousSetLog.reps.toString();
        initialRpe = previousSetLog.rpe;
      }
    }

    // Attempt to load historic benchmark
    let previousLog: { weight: number | null; reps: number } | null = null;
    try {
      previousLog = await getLastLog(exerciseId);
      if (!log && !initialWeight && !initialReps && previousLog) {
        initialWeight = previousLog.weight?.toString() || '';
        initialReps = previousLog.reps.toString();
      }
    } catch {}

    setLogParams({
      exerciseName,
      exerciseId,
      ewmId,
      setIndex,
      weight: initialWeight,
      reps: initialReps,
      rpe: initialRpe,
      isEdit,
      logId,
      previousLog,
    });
    setIsLogDrawerOpen(true);
  };

  const handleSaveSet = () => {
    if (!logParams || !resolvedParams) return;
    const { ewmId, exerciseId, setIndex, weight, reps, rpe, isEdit, logId } = logParams;

    setIsLogDrawerOpen(false);

    if (isEdit && logId) {
      updateSetMutation.mutate(
        { setId: logId, weight, reps, rpe: rpe?.toString() },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    } else {
      const restSeconds = data?.workout?.exercisesWithMetadata?.find((e) => e.id === ewmId)?.rest_min || 60;
      startTimer(restSeconds, { closeOnFinish: true });

      logSetMutation.mutate(
        {
          workoutId: resolvedParams.workoutId,
          exerciseWithMetadataId: ewmId,
          exerciseId,
          setOrderIndex: setIndex,
          weight,
          reps,
          rpe: rpe?.toString() || undefined,
        },
        {
          onSuccess: (newLog) => {
            refetch();
            if (newLog.pr) {
              Alert.alert('🎉 Personal Record!', `You set a new PR in ${logParams.exerciseName}: ${weight}kg x ${reps} reps!`);
            }
          },
        }
      );
    }
  };

  const handleDeleteSet = () => {
    if (!logParams || !logParams.logId) return;

    Alert.alert('Confirm Deletion', 'Are you sure you want to remove this logged set?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setIsLogDrawerOpen(false);
          deleteSetMutation.mutate(logParams.logId!, {
            onSuccess: () => {
              refetch();
            },
          });
        },
      },
    ]);
  };

  const handleConfirmFinish = () => {
    if (!data?.session) {
      // Discard active MMKV session if no backend logs were tracked yet
      activeSessionStore.clearActiveSession();
      router.replace('/');
      return;
    }

    Alert.alert('Finish Workout?', 'Ready to complete this workout session? Duration and volume will be saved.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Finish Workout',
        style: 'default',
        onPress: () => {
          setIsFinishing(true);
          finishWorkout.mutate(
            { sessionId: data.session!.id },
            {
              onSuccess: () => {
                activeSessionStore.clearActiveSession();
                router.replace('/');
              },
              onError: () => {
                setIsFinishing(false);
                Alert.alert('Error', 'Failed to finish workout. Please check your network and try again.');
              },
            }
          );
        },
      },
    ]);
  };

  if (!resolvedParams) {
    return (
      <ThemedView style={styles.errorContainerFull}>
        <SafeAreaView>
          <SymbolView name={{ ios: 'dumbbell.fill', android: 'fitness_center' }} size={48} tintColor="#ef4444" />
          <ThemedText type="subtitle" style={{ marginTop: Spacing.three }}>No Active Session found</ThemedText>
          <Button onPress={() => router.replace('/')} style={{ marginTop: Spacing.four }}>
            Back to Home
          </Button>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* HUD Top Bar */}
        <View style={styles.hudBar}>
          <View style={styles.hudTimeCol}>
            <ThemedText type="small" style={styles.hudLabel}>
              Time
            </ThemedText>
            <ThemedText type="subtitle" style={styles.hudTime}>
              {displayTime}
            </ThemedText>
          </View>
          <View style={styles.hudStatCol}>
            <ThemedText type="small" style={styles.hudLabel}>
              Sets
            </ThemedText>
            <ThemedText type="subtitle" style={styles.hudStat}>
              {metrics.totalSetsDone}
            </ThemedText>
          </View>
          <View style={styles.hudStatCol}>
            <ThemedText type="small" style={styles.hudLabel}>
              Volume
            </ThemedText>
            <ThemedText type="subtitle" style={styles.hudStat}>
              {metrics.totalVolume >= 1000
                ? `${(metrics.totalVolume / 1000).toFixed(1)}k`
                : metrics.totalVolume}
              <ThemedText type="code" style={{ fontSize: 10 }}>
                kg
              </ThemedText>
            </ThemedText>
          </View>

          <View style={styles.progressCol}>
            <ThemedText type="code" style={styles.progressLabel}>
              {metrics.completedExercises} / {metrics.totalExercises} EX
            </ThemedText>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${metrics.progressPercentage}%` }]} />
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Row */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.push('/')}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <SymbolView
                name={{ ios: 'chevron.left', android: 'arrow_back' }}
                size={22}
                tintColor={themeColors.text}
              />
            </Pressable>
            <View style={{ flex: 1 }}>
              <ThemedText type="small" style={styles.eyebrow}>
                Workout Session
              </ThemedText>
              <ThemedText type="subtitle" style={styles.title} numberOfLines={1}>
                {data?.workout?.name || 'Loading session...'}
              </ThemedText>
            </View>
            <Pressable
              onPress={handleConfirmFinish}
              disabled={isFinishing}
              style={({ pressed }) => [
                styles.finishBtn,
                isFinishing && styles.finishBtnDisabled,
                pressed && styles.pressed,
              ]}
            >
              {isFinishing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <SymbolView
                    name={{ ios: 'checkmark.circle.fill', android: 'check_circle' }}
                    size={13}
                    tintColor="#fff"
                  />
                  <ThemedText type="code" style={styles.finishBtnText}>
                    Finish
                  </ThemedText>
                </>
              )}
            </Pressable>
          </View>

          {/* Exercises list */}
          {isLoading && !data ? (
            <ActivityIndicator color="#be185d" style={{ marginTop: Spacing.six }} size="large" />
          ) : isError || !data ? (
            <View style={styles.errorBox}>
              <SymbolView name={{ ios: 'exclamationmark.triangle.fill', android: 'warning' }} size={32} tintColor="#ef4444" />
              <ThemedText type="smallBold" style={{ marginTop: Spacing.two }}>Failed to connect to session</ThemedText>
              <Button onPress={() => refetch()} variant="secondary" style={{ marginTop: Spacing.three }}>
                Try Again
              </Button>
            </View>
          ) : data.workout.exercisesWithMetadata.length === 0 ? (
            <View style={styles.emptyBox}>
              <ThemedText type="small" style={{ color: themeColors.textSecondary, textAlign: 'center' }}>
                Your training protocol is empty. Add exercises to start tracking.
              </ThemedText>
              <Button onPress={() => setIsAddExerciseOpen(true)} variant="secondary" style={{ marginTop: Spacing.four }}>
                Add Exercise
              </Button>
            </View>
          ) : (
            <View style={styles.listGrid}>
              {data.workout.exercisesWithMetadata.map((ewm) => {
                const exerciseLogs = metrics.logsByEwm[ewm.id] || [];
                const setsMin = ewm.sets_min || 1;
                const isDone = exerciseLogs.length >= setsMin;

                return (
                  <View
                    key={ewm.id}
                    style={[
                      styles.exCard,
                      { backgroundColor: themeColors.backgroundSelected },
                      isDone && styles.exCardDone,
                    ]}
                  >
                    <View style={styles.exHeaderRow}>
                      <View style={styles.exDot} />
                      <View style={{ flex: 1 }}>
                        <ThemedText type="smallBold" style={styles.exName}>
                          {ewm.exercise.name}
                        </ThemedText>
                        <ThemedText type="small" style={{ color: themeColors.textSecondary, fontSize: 11, textTransform: 'capitalize' }}>
                          {ewm.exercise.muscle_group}
                        </ThemedText>
                      </View>
                      <Pressable
                        onPress={() => {
                          setEditMetadataParams({
                            id: ewm.id,
                            exerciseName: ewm.exercise.name,
                            sets: ewm.sets_min,
                            reps: ewm.reps_min,
                            rest: ewm.rest_min,
                            tempo: ewm.tempo,
                          });
                          setIsEditMetadataOpen(true);
                        }}
                        style={({ pressed }) => [styles.optionsBtn, pressed && styles.pressed]}
                      >
                        <SymbolView
                          name={{ ios: 'ellipsis', android: 'more_vert' }}
                          size={18}
                          tintColor={themeColors.textSecondary}
                        />
                      </Pressable>
                    </View>

                    {/* Prescription Pills Row */}
                    <View style={styles.pillsRow}>
                      <View style={[styles.pill, { backgroundColor: themeColors.background }]}>
                        <ThemedText type="code" style={styles.pillText}>
                          {ewm.sets_min} Sets
                        </ThemedText>
                      </View>
                      <View style={[styles.pill, { backgroundColor: themeColors.background }]}>
                        <ThemedText type="code" style={styles.pillText}>
                          {ewm.reps_min} Reps
                        </ThemedText>
                      </View>
                      <View style={[styles.pill, { backgroundColor: themeColors.background }]}>
                        <ThemedText type="code" style={styles.pillText}>
                          {ewm.rest_min}s Rest
                        </ThemedText>
                      </View>
                      <View style={[styles.pill, { backgroundColor: themeColors.background }]}>
                        <ThemedText type="code" style={[styles.pillText, { textTransform: 'lowercase' }]}>
                          {ewm.tempo}
                        </ThemedText>
                      </View>
                    </View>

                    {/* Set Tracker circles */}
                    <View style={styles.trackerRow}>
                      <SetTracker
                        protocol={{
                          setsMin: ewm.sets_min,
                          setsMax: ewm.sets_max,
                          targetReps: ewm.reps_min,
                        }}
                        logs={exerciseLogs}
                        previousLogs={data.previousLogsByExercise?.[ewm.exercise_id] || []}
                        onSetClick={(setIdx) =>
                          handleOpenSetLogDrawer(
                            ewm.exercise.name,
                            ewm.exercise_id,
                            ewm.id,
                            setIdx,
                            ewm.rest_min
                          )
                        }
                      />
                    </View>
                  </View>
                );
              })}

              <Button
                variant="secondary"
                onPress={() => setIsAddExerciseOpen(true)}
                style={styles.addExerciseBtn}
              >
                Add Exercise
              </Button>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Set logger drawer */}
      {logParams && (
        <LogSetDrawer
          isOpen={isLogDrawerOpen}
          onClose={() => setIsLogDrawerOpen(false)}
          exerciseName={logParams.exerciseName}
          weight={logParams.weight}
          setWeight={(w) => setLogParams((p) => (p ? { ...p, weight: w } : null))}
          reps={logParams.reps}
          setReps={(r) => setLogParams((p) => (p ? { ...p, reps: r } : null))}
          rpe={logParams.rpe}
          setRpe={(rp) => setLogParams((p) => (p ? { ...p, rpe: rp } : null))}
          onSave={handleSaveSet}
          onDelete={handleDeleteSet}
          isSaving={logSetMutation.isPending || updateSetMutation.isPending}
          isDeleting={deleteSetMutation.isPending}
          isEdit={logParams.isEdit}
          previousLog={logParams.previousLog}
        />
      )}

      {/* Edit Exercise metadata parameters drawer */}
      {editMetadataParams && (
        <EditExerciseMetadataDrawer
          isOpen={isEditMetadataOpen}
          onClose={() => setIsEditMetadataOpen(false)}
          programmeId={resolvedParams.programmeId}
          workoutId={resolvedParams.workoutId}
          metadataId={editMetadataParams.id}
          exerciseName={editMetadataParams.exerciseName}
          initialSets={editMetadataParams.sets}
          initialReps={editMetadataParams.reps}
          initialRest={editMetadataParams.rest}
          initialTempo={editMetadataParams.tempo}
        />
      )}

      {/* Add adhoc exercise drawer */}
      <AddExerciseDrawer
        isOpen={isAddExerciseOpen}
        onClose={() => {
          setIsAddExerciseOpen(false);
          refetch();
        }}
        programmeId={resolvedParams.programmeId}
        workoutId={resolvedParams.workoutId}
      />
    </ThemedView>
  );
}

const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  hudBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderBottomWidth: 1,
    borderColor: '#222',
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 40,
    gap: Spacing.three,
  },
  hudTimeCol: {
    flex: 1,
    flexDirection: 'column',
  },
  hudStatCol: {
    width: 60,
    flexDirection: 'column',
    alignItems: 'center',
  },
  hudLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    color: '#888',
    letterSpacing: 1,
    fontWeight: '700',
  },
  hudTime: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  hudStat: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressCol: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  progressLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#888',
  },
  progressBar: {
    width: 72,
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#be185d',
    borderRadius: 3,
  },
  scrollContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.one,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#333',
  },
  eyebrow: {
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  finishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#be185d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  finishBtnDisabled: {
    opacity: 0.6,
  },
  finishBtnText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
  },
  errorContainerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.five,
  },
  errorBox: {
    paddingVertical: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBox: {
    paddingVertical: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listGrid: {
    flexDirection: 'column',
    gap: Spacing.three,
  },
  exCard: {
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  exCardDone: {
    borderColor: 'rgba(16,185,129,0.2)',
  },
  exHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  exDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#be185d',
  },
  exName: {
    fontSize: 16,
    fontWeight: '700',
  },
  optionsBtn: {
    padding: 6,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.one,
  },
  pill: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 10,
    color: '#888',
    fontWeight: '700',
  },
  trackerRow: {
    marginTop: Spacing.two,
  },
  addExerciseBtn: {
    marginTop: Spacing.two,
  },
  pressed: {
    opacity: 0.8,
  },
});
