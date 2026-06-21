import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SymbolView } from 'expo-symbols';

import { BottomDrawer } from '@/components/ui/bottom-drawer';
import { Button } from '@/components/ui/button';
import { NumberStepper } from '@/components/ui/number-stepper';
import { RPESelector } from '@/components/ui/rpe-selector';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

import { useLogSet } from '../api/mutation-hooks/use-log-set';
import { useLastLog } from '../api/query-hooks/use-last-log';
import { useExerciseHistory, groupLogsByDate } from '../api/query-hooks/use-exercise-history';
import { SetLogItem } from './SetLogItem';
import { Exercise } from '../types';

interface ExerciseQuickLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise;
  initialDate?: string;
}

export function ExerciseQuickLogDrawer({
  isOpen,
  onClose,
  exercise,
  initialDate,
}: ExerciseQuickLogDrawerProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const [activeTab, setActiveTab] = useState<'day' | 'history'>('day');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const { mutate: logSet, isPending } = useLogSet();
  const { data: lastLog } = useLastLog(exercise.id, isOpen);
  const dayRange = getDayRange(initialDate);

  const {
    data: dayLogs,
    isLoading: isDayLoading,
    isError: isDayError,
    refetch: refetchDayLogs,
  } = useExerciseHistory(isOpen ? exercise.id : undefined, dayRange);

  const {
    data: logs,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    refetch: refetchHistory,
  } = useExerciseHistory(isOpen ? exercise.id : undefined);

  const groupedLogs = groupLogsByDate(logs);

  const getNextSetIndex = () => {
    if (!dayLogs || dayLogs.length === 0) return 0;
    const maxIndex = Math.max(...dayLogs.map((l) => l.set_order_index));
    return maxIndex + 1;
  };

  const handleSubmit = (weight: string, reps: string, rpe: string | null) => {
    if (!reps || reps === '0') return;

    const setOrderIndex = getNextSetIndex();

    logSet(
      {
        exerciseId: exercise.id,
        setOrderIndex,
        weight: weight || '0',
        reps,
        rpe: rpe || undefined,
        date: initialDate,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        },
      }
    );
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title={exercise.name}>
      <View style={styles.container}>
        {showSuccess && (
          <View style={styles.toast}>
            <SymbolView
              name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
              size={14}
              tintColor="#ffffff"
            />
            <ThemedText type="smallBold" style={styles.toastText}>
              Set Logged!
            </ThemedText>
          </View>
        )}

        {/* Tab Switcher */}
        <View style={[styles.tabsRow, { backgroundColor: themeColors.backgroundSelected }]}>
          <Pressable
            onPress={() => setActiveTab('day')}
            style={[
              styles.tabButton,
              activeTab === 'day' && { backgroundColor: themeColors.background },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={[
                styles.tabText,
                { color: activeTab === 'day' ? '#be185d' : themeColors.textSecondary },
              ]}
            >
              This Day
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('history')}
            style={[
              styles.tabButton,
              activeTab === 'history' && { backgroundColor: themeColors.background },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={[
                styles.tabText,
                { color: activeTab === 'history' ? '#be185d' : themeColors.textSecondary },
              ]}
            >
              All History
            </ThemedText>
          </Pressable>
        </View>

        {/* Scroll Content */}
        <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
          {activeTab === 'day' ? (
            isDayLoading ? (
              <ActivityIndicator color="#be185d" style={{ marginVertical: Spacing.four }} />
            ) : isDayError ? (
              <View style={styles.errorBox}>
                <ThemedText type="small" style={{ color: '#ef4444' }}>
                  Failed to load logs.
                </ThemedText>
                <Button onPress={() => refetchDayLogs()} variant="ghost">
                  Retry
                </Button>
              </View>
            ) : dayLogs && dayLogs.length > 0 ? (
              <View style={styles.setsList}>
                {dayLogs.map((log) => (
                  <SetLogItem
                    key={log.id}
                    variant="featured"
                    log={log}
                    isAdHoc={!log.exerciseWithMetadata}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyBox}>
                <ThemedText type="small" style={{ color: themeColors.textSecondary }}>
                  No sets logged for this exercise today.
                </ThemedText>
              </View>
            )
          ) : isHistoryLoading ? (
            <ActivityIndicator color="#be185d" style={{ marginVertical: Spacing.four }} />
          ) : isHistoryError ? (
            <View style={styles.errorBox}>
              <ThemedText type="small" style={{ color: '#ef4444' }}>
                Failed to load history.
              </ThemedText>
              <Button onPress={() => refetchHistory()} variant="ghost">
                Retry
              </Button>
            </View>
          ) : groupedLogs && Object.keys(groupedLogs).length > 0 ? (
            <View style={styles.historyGroupContainer}>
              {Object.entries(groupedLogs).map(([dateStr, sessionLogs]) => (
                <View key={dateStr} style={styles.historyGroup}>
                  <View style={styles.groupHeader}>
                    <View style={styles.dot} />
                    <ThemedText type="code" style={[styles.groupLabel, { color: themeColors.textSecondary }]}>
                      {dateStr}
                    </ThemedText>
                  </View>
                  <View style={styles.groupLogsList}>
                    {sessionLogs.map((log) => (
                      <SetLogItem
                        key={log.id}
                        variant="compact"
                        log={log}
                        isAdHoc={!log.exerciseWithMetadata}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <ThemedText type="small" style={{ color: themeColors.textSecondary }}>
                No historical records.
              </ThemedText>
            </View>
          )}
        </ScrollView>

        {/* Quick Log Form panel */}
        <View style={[styles.formPanel, { borderColor: themeColors.backgroundSelected }]}>
          <Pressable onPress={() => setIsExpanded(!isExpanded)} style={styles.expandHeader}>
            <ThemedText type="smallBold" style={styles.formTitle}>
              Quick Log Set
            </ThemedText>
            <SymbolView
              name={{
                ios: isExpanded ? 'chevron.down' : 'chevron.up',
                android: isExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up',
                web: isExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up',
              }}
              size={18}
              tintColor="#be185d"
            />
          </Pressable>

          {isExpanded && (
            <QuickLogForm
              key={`${exercise.id}-${lastLog?.id || 'none'}`}
              lastLog={lastLog}
              isPending={isPending}
              onSubmit={handleSubmit}
            />
          )}
        </View>
      </View>
    </BottomDrawer>
  );
}

interface QuickLogFormProps {
  lastLog?: any;
  isPending: boolean;
  onSubmit: (w: string, r: string, rpe: string | null) => void;
}

function QuickLogForm({ lastLog, isPending, onSubmit }: QuickLogFormProps) {
  const [weight, setWeight] = useState(lastLog?.weight?.toString() || '0');
  const [reps, setReps] = useState(lastLog?.reps?.toString() || '0');
  const [rpe, setRpe] = useState<number | null>(lastLog?.rpe || null);

  const weightNum = parseFloat(weight) || 0;
  const repsNum = parseInt(reps) || 0;

  return (
    <View style={styles.formContent}>
      <View style={styles.steppersRow}>
        <NumberStepper
          label="Weight"
          value={weightNum}
          onChange={(val) => setWeight(val.toString())}
          min={0}
          max={500}
          step={2.5}
          suffix="kg"
          stepOptions={[2.5, 5]}
        />
        <NumberStepper
          label="Reps"
          value={repsNum}
          onChange={(val) => setReps(val.toString())}
          min={0}
          max={100}
          step={1}
        />
      </View>
      <RPESelector value={rpe} onChange={setRpe} />
      <Button
        onPress={() => onSubmit(weight, reps, rpe?.toString() || null)}
        disabled={isPending || repsNum <= 0}
        loading={isPending}
      >
        Log Set
      </Button>
    </View>
  );
}

function getDayRange(initialDate?: string) {
  if (!initialDate) return undefined;
  const date = new Date(initialDate);
  if (Number.isNaN(date.getTime())) return undefined;

  const from = new Date(date);
  from.setHours(0, 0, 0, 0);

  const to = new Date(date);
  to.setHours(23, 59, 59, 999);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

const styles = StyleSheet.create({
  container: {
    height: 420,
    gap: Spacing.two,
  },
  toast: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: '#be185d',
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    zIndex: 50,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 2,
    alignSelf: 'flex-start',
    marginBottom: Spacing.two,
  },
  tabButton: {
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
  },
  tabText: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollList: {
    flex: 1,
  },
  setsList: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  emptyBox: {
    paddingVertical: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    paddingVertical: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  historyGroupContainer: {
    gap: Spacing.four,
    paddingBottom: Spacing.four,
  },
  historyGroup: {
    gap: Spacing.two,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#be185d',
  },
  groupLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  groupLogsList: {
    gap: Spacing.one,
  },
  formPanel: {
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  expandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  formTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#be185d',
  },
  formContent: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  steppersRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
});
