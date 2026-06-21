import React, { useState } from 'react';
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
import {
  subDays,
  isSameDay,
  startOfMonth,
  isWithinInterval,
  endOfMonth,
  differenceInDays,
  parseISO,
} from 'date-fns';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

import {
  useInfiniteSessions,
  useDeleteLogSet,
  SetLogItem,
  SessionWithLogs,
  ExerciseQuickLogDrawer,
} from '@/features/logging';

import { useExercises, ExerciseSelectDrawer, Exercise } from '@/features/exercises';

export default function LogScreen() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteSessions({ grouped: true, limit: 15 });

  const { mutate: deleteSet } = useDeleteLogSet();
  const { data: exercises = [] } = useExercises();

  // Quick Log Drawer coordination states
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  // History Exercise drawer state
  const [selectedHistoryExercise, setSelectedHistoryExercise] = useState<any>(null);

  const allSessions = data?.pages.flatMap((page) => page.data.flatMap((g) => g.sessions)) || [];

  // Calculations: Consistency Streak, Monthly stats
  const stats = (() => {
    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    const endOfThisMonth = endOfMonth(now);

    const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(now, 6 - i));
    const consistency = last7Days.map((day) =>
      allSessions.some((s) => s.start_time && isSameDay(parseISO(s.start_time.toString()), day))
    );

    const monthlySessions = allSessions.filter((s) =>
      s.start_time &&
      isWithinInterval(parseISO(s.start_time.toString()), {
        start: startOfThisMonth,
        end: endOfThisMonth,
      })
    ).length;

    const uniqueSessionDays = Array.from(
      new Set(
        allSessions
          .map((s) => (s.start_time ? s.start_time.toString().split('T')[0] : null))
          .filter(Boolean)
      )
    ).sort((a, b) => b!.localeCompare(a!));

    let streak = 0;
    if (uniqueSessionDays.length > 0) {
      const latestSessionDate = parseISO(uniqueSessionDays[0]!);
      const gapToToday = differenceInDays(now, latestSessionDate);

      if (gapToToday <= 1) {
        streak = 1;
        for (let i = 1; i < uniqueSessionDays.length; i++) {
          const prevDate = parseISO(uniqueSessionDays[i - 1]!);
          const currDate = parseISO(uniqueSessionDays[i]!);
          if (differenceInDays(prevDate, currDate) === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return { consistency, monthlySessions, streak };
  })();

  const grouped = (() => {
    if (!data?.pages) return [];
    const merged = new Map<string, { label: string; sessions: SessionWithLogs[] }>();
    for (const page of data.pages) {
      for (const group of page.data) {
        if (!merged.has(group.label)) {
          merged.set(group.label, { label: group.label, sessions: [] });
        }
        merged.get(group.label)!.sessions.push(...group.sessions);
      }
    }
    return Array.from(merged.values());
  })();

  const handleDeleteSet = (setId: string) => {
    Alert.alert('Confirm Deletion', 'Are you sure you want to remove this logged set?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteSet(setId),
      },
    ]);
  };

  const handleSelectExercise = (id: string) => {
    const found = exercises.find((ex) => ex.id === id);
    if (found) {
      setSelectedExercise(found);
      setIsQuickLogOpen(true);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Row */}
          <View style={styles.header}>
            <View>
              <ThemedText type="small" style={styles.eyebrow}>
                Training Log
              </ThemedText>
              <ThemedText type="subtitle" style={styles.title}>
                Your Journey
              </ThemedText>
            </View>
            <Pressable
              onPress={() => setIsSelectOpen(true)}
              style={({ pressed }) => [styles.quickLogBtn, pressed && styles.pressed]}
            >
              <SymbolView
                name={{ ios: 'plus.circle.fill', android: 'add_circle', web: 'add' }}
                size={18}
                tintColor="#be185d"
              />
              <ThemedText type="smallBold" style={styles.quickLogText}>
                Quick Log
              </ThemedText>
            </Pressable>
          </View>

          {/* Stats Bar */}
          <ThemedView type="backgroundElement" style={styles.statsCard}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={styles.statTitleRow}>
                  <SymbolView
                    name={{ ios: 'flame.fill', android: 'whatshot', web: 'whatshot' }}
                    size={12}
                    tintColor="#eab308"
                  />
                  <ThemedText type="code" style={styles.statLabel}>
                    Streak
                  </ThemedText>
                </View>
                <ThemedText type="smallBold">{stats.streak} days</ThemedText>
              </View>

              <View style={styles.statItem}>
                <View style={styles.statTitleRow}>
                  <SymbolView
                    name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
                    size={12}
                    tintColor="#be185d"
                  />
                  <ThemedText type="code" style={styles.statLabel}>
                    This Month
                  </ThemedText>
                </View>
                <ThemedText type="smallBold">{stats.monthlySessions} sessions</ThemedText>
              </View>

              <View style={styles.statItem}>
                <View style={styles.statTitleRow}>
                  <SymbolView
                    name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
                    size={12}
                    tintColor="#10b981"
                  />
                  <ThemedText type="code" style={styles.statLabel}>
                    Consistency
                  </ThemedText>
                </View>
                <ThemedText type="smallBold" style={{ fontSize: 13 }} numberOfLines={1}>
                  {stats.streak > 5 ? 'Elite' : stats.streak > 2 ? 'Momentum' : 'Building'}
                </ThemedText>
              </View>
            </View>

            {/* Consistency ribbon */}
            <View style={styles.ribbon}>
              {stats.consistency.map((active, i) => (
                <View
                  key={i}
                  style={[
                    styles.ribbonIndicator,
                    { backgroundColor: active ? '#be185d' : 'rgba(128,128,128,0.2)' },
                  ]}
                />
              ))}
            </View>
          </ThemedView>

          {/* Timeline list */}
          {isLoading && !data ? (
            <ActivityIndicator color="#be185d" size="large" style={{ marginTop: Spacing.five }} />
          ) : isError ? (
            <View style={styles.errorBox}>
              <SymbolView
                name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}
                size={36}
                tintColor="#ef4444"
              />
              <ThemedText type="smallBold" style={{ marginTop: Spacing.two }}>
                Could not load journey logs
              </ThemedText>
              <Button onPress={() => refetch()} variant="secondary" style={{ marginTop: Spacing.three }}>
                Try Again
              </Button>
            </View>
          ) : grouped.length === 0 ? (
            <View style={styles.emptyBox}>
              <SymbolView
                name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
                size={40}
                tintColor={themeColors.textSecondary}
              />
              <ThemedText type="smallBold" style={{ fontSize: 16 }}>
                Your journey starts here
              </ThemedText>
              <ThemedText type="small" style={{ color: themeColors.textSecondary, textAlign: 'center' }}>
                Log your first training session to begin.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.timeline}>
              {grouped.map(({ label, sessions: daySessions }) => (
                <View key={label} style={styles.dateSection}>
                  {/* Date section header */}
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionIcon, { backgroundColor: themeColors.backgroundSelected }]}>
                      <SymbolView
                        name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
                        size={14}
                        tintColor="#be185d"
                      />
                    </View>
                    <ThemedText type="smallBold" style={styles.sectionLabel}>
                      {label}
                    </ThemedText>
                    <View style={[styles.dividerLine, { backgroundColor: themeColors.backgroundSelected }]} />
                  </View>

                  {/* Sessions grid */}
                  <View style={styles.sessionsGrid}>
                    {daySessions.map((session) => {
                      const groupsMap = new Map<string, { exercise: Exercise; sets: any[] }>();

                      for (const sel of session.sessionExerciseLogs) {
                        const exercise = sel.exerciseWithMetadata?.exercise ?? sel.exerciseLog?.exercise;
                        if (!exercise || !sel.exerciseLog) continue;

                        if (!groupsMap.has(exercise.id)) {
                          groupsMap.set(exercise.id, { exercise, sets: [] });
                        }
                        groupsMap.get(exercise.id)!.sets.push({
                          ...sel.exerciseLog,
                          isAdHoc: sel.exercise_with_metadata_id === null,
                        });
                      }

                      const exerciseGroups = Array.from(groupsMap.values()).map((group) => ({
                        ...group,
                        sets: group.sets.sort((a, b) => a.set_order_index - b.set_order_index),
                      }));

                      const totalSets = exerciseGroups.reduce((acc, g) => acc + g.sets.length, 0);
                      const totalVolume = exerciseGroups.reduce(
                        (acc, g) =>
                          acc + g.sets.reduce((sAcc, s) => sAcc + (s.weight || 0) * s.reps, 0),
                        0
                      );

                      return (
                        <View
                          key={session.id}
                          style={[styles.sessionCard, { backgroundColor: themeColors.backgroundSelected }]}
                        >
                          {/* Session Metadata */}
                          <View style={styles.sessionHeaderRow}>
                            <View style={{ flex: 1 }}>
                              <ThemedText type="code" style={[styles.sessionGroupLabel, { color: themeColors.textSecondary }]}>
                                {session.workout?.programme?.name ?? 'Quick Log'}
                              </ThemedText>
                              <ThemedText type="smallBold" style={styles.sessionTitle}>
                                {session.workout?.name ?? 'Ad-hoc Exercises'}
                              </ThemedText>
                            </View>
                            {session.start_time && session.end_time && (
                              <View style={[styles.durationBadge, { backgroundColor: themeColors.background }]}>
                                <ThemedText type="code" style={{ fontSize: 10 }}>
                                  {formatDuration(session.start_time, session.end_time)}
                                </ThemedText>
                              </View>
                            )}
                          </View>

                          <View style={styles.statsSummaryRow}>
                            <View style={styles.summaryItem}>
                              <SymbolView
                                name={{ ios: 'target', android: 'track_changes', web: 'track_changes' }}
                                size={11}
                                tintColor="#be185d"
                              />
                              <ThemedText type="code" style={styles.summaryText}>
                                {totalSets} sets
                              </ThemedText>
                            </View>
                            <View style={styles.summaryItem}>
                              <SymbolView
                                name={{ ios: 'dumbbell.fill', android: 'fitness_center', web: 'fitness_center' }}
                                size={11}
                                tintColor="#be185d"
                              />
                              <ThemedText type="code" style={styles.summaryText}>
                                {totalVolume.toLocaleString()}kg volume
                              </ThemedText>
                            </View>
                          </View>

                          {/* Exercise logs */}
                          <View style={styles.exerciseGroupsContainer}>
                            {exerciseGroups.map(({ exercise, sets }) => (
                              <View
                                key={exercise.id}
                                style={[styles.exerciseGroup, { backgroundColor: themeColors.background }]}
                              >
                                <Pressable
                                  onPress={() => setSelectedHistoryExercise(exercise)}
                                  style={styles.exHeaderRow}
                                >
                                  <View style={styles.exDot} />
                                  <ThemedText type="smallBold" style={styles.exName}>
                                    {exercise.name}
                                  </ThemedText>
                                  <SymbolView
                                    name={{ ios: 'chevron.right', android: 'keyboard_arrow_right', web: 'keyboard_arrow_right' }}
                                    size={14}
                                    tintColor={themeColors.textSecondary}
                                    style={{ marginLeft: 'auto' }}
                                  />
                                </Pressable>

                                <View style={styles.setsList}>
                                  {sets.map((log) => (
                                    <View key={log.id} style={styles.setRow}>
                                      <View style={{ flex: 1 }}>
                                        <SetLogItem
                                          variant="list"
                                          log={log}
                                          isAdHoc={log.isAdHoc}
                                        />
                                      </View>
                                      <Pressable
                                        onPress={() => handleDeleteSet(log.id)}
                                        style={styles.deleteButton}
                                        hitSlop={8}
                                      >
                                        <SymbolView
                                          name={{ ios: 'trash.fill', android: 'delete', web: 'delete' }}
                                          size={14}
                                          tintColor="#ef4444"
                                        />
                                      </Pressable>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            ))}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}

              {/* Load More Trigger */}
              {hasNextPage && (
                <Pressable
                  onPress={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  style={styles.loadMoreBtn}
                >
                  {isFetchingNextPage ? (
                    <ActivityIndicator color="#be185d" size="small" />
                  ) : (
                    <ThemedText type="code" style={styles.loadMoreText}>
                      Load more entries
                    </ThemedText>
                  )}
                </Pressable>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Select Exercise for Quick Log */}
      <ExerciseSelectDrawer
        isOpen={isSelectOpen}
        onClose={() => setIsSelectOpen(false)}
        exercises={exercises}
        onSelect={handleSelectExercise}
      />

      {/* Quick Set Logger Drawer */}
      {selectedExercise && (
        <ExerciseQuickLogDrawer
          isOpen={isQuickLogOpen}
          onClose={() => {
            setIsQuickLogOpen(false);
            setSelectedExercise(null);
          }}
          exercise={selectedExercise}
        />
      )}

      {/* History review drawer */}
      {selectedHistoryExercise && (
        <ExerciseQuickLogDrawer
          isOpen={!!selectedHistoryExercise}
          onClose={() => setSelectedHistoryExercise(null)}
          exercise={selectedHistoryExercise}
        />
      )}
    </ThemedView>
  );
}

function formatDuration(start: string | Date, end: string | Date) {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return hrs > 0 ? `${hrs}h ${rem}m` : `${rem}m`;
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
  scrollContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  eyebrow: {
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  quickLogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1.5,
    borderColor: '#333',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 16,
  },
  quickLogText: {
    color: '#be185d',
    fontSize: 13,
  },
  statsCard: {
    padding: Spacing.four,
    borderRadius: 16,
    gap: Spacing.three,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  statItem: {
    flex: 1,
    gap: 4,
  },
  statTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  ribbon: {
    flexDirection: 'row',
    gap: 6,
    marginTop: Spacing.one,
  },
  ribbonIndicator: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  timeline: {
    flexDirection: 'column',
    gap: Spacing.five,
    marginTop: Spacing.two,
  },
  dateSection: {
    gap: Spacing.four,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  sessionsGrid: {
    gap: Spacing.four,
  },
  sessionCard: {
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  sessionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sessionGroupLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  sessionTitle: {
    fontSize: 18,
    lineHeight: 22,
    marginTop: 4,
  },
  durationBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statsSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  summaryText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '700',
  },
  exerciseGroupsContainer: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  exerciseGroup: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
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
    fontSize: 14,
    lineHeight: 16,
  },
  setsList: {
    gap: Spacing.one,
    paddingLeft: Spacing.two,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
  },
  deleteButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreBtn: {
    alignSelf: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginTop: Spacing.two,
  },
  loadMoreText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  errorBox: {
    paddingVertical: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  emptyBox: {
    paddingVertical: Spacing.five,
    alignItems: 'center',
    gap: Spacing.three,
  },
  pressed: {
    opacity: 0.8,
  },
});
