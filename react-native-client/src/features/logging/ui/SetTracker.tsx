import React from 'react';
import { StyleSheet, View, Pressable, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { ExerciseLog } from '../types';

interface TrackerProtocol {
  setsMin: number;
  setsMax: number;
  targetReps: number;
}

interface SetTrackerProps {
  protocol: TrackerProtocol;
  logs: Partial<ExerciseLog>[];
  onSetClick: (setIndex: number) => void;
  previousLogs?: Partial<ExerciseLog>[];
}

export function SetTracker({
  protocol,
  logs,
  onSetClick,
  previousLogs = [],
}: SetTrackerProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { setsMin, setsMax, targetReps } = protocol;
  const totalCircles = setsMax;

  return (
    <View style={styles.container}>
      {Array.from({ length: totalCircles }).map((_, i) => {
        const isOptional = i >= setsMin;
        const log = logs.find((l) => l.set_order_index === i);
        const isCompleted = !!log;
        const missedTarget = isCompleted && (log.reps ?? 0) < targetReps;

        const prevLog = previousLogs.find((l) => l.set_order_index === i);

        return (
          <View key={i} style={styles.bubbleCol}>
            <Pressable
              onPress={() => onSetClick(i)}
              style={({ pressed }) => [
                styles.bubble,
                {
                  backgroundColor: isCompleted
                    ? (missedTarget ? 'rgba(245,158,11,0.15)' : 'rgba(190,24,93,0.15)')
                    : (isOptional ? themeColors.background : themeColors.backgroundSelected),
                  borderColor: isCompleted
                    ? (missedTarget ? '#f59e0b' : '#be185d')
                    : (isOptional ? 'rgba(128,128,128,0.3)' : 'transparent'),
                  borderWidth: isCompleted || isOptional ? 1 : 0,
                },
                pressed && styles.pressed,
              ]}
            >
              {isCompleted ? (
                <View style={styles.completedContent}>
                  <ThemedText
                    type="smallBold"
                    style={[styles.repText, { color: missedTarget ? '#f59e0b' : '#be185d' }]}
                  >
                    {log.reps}
                  </ThemedText>
                  {log.rpe && (
                    <View style={styles.rpeBadge}>
                      <ThemedText type="code" style={styles.rpeText}>
                        {log.rpe}
                      </ThemedText>
                    </View>
                  )}
                </View>
              ) : (
                <ThemedText
                  type="small"
                  style={{
                    color: isOptional ? themeColors.textSecondary : themeColors.text,
                    fontWeight: '600',
                  }}
                >
                  {i + 1}
                </ThemedText>
              )}
            </Pressable>

            {/* Beat Previous Marker */}
            <View style={styles.previousLabelContainer}>
              {prevLog ? (
                <ThemedText type="code" style={[styles.previousLabel, { color: themeColors.textSecondary }]}>
                  {prevLog.weight ? `${prevLog.weight}×${prevLog.reps}` : `${prevLog.reps}r`}
                </ThemedText>
              ) : (
                <View style={styles.emptyPrevSpacer} />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    marginTop: Spacing.two,
    paddingBottom: Spacing.one,
  },
  bubbleCol: {
    width: 44,
    alignItems: 'center',
    flexDirection: 'column',
    gap: Spacing.two,
  },
  bubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  repText: {
    fontSize: 14,
    fontWeight: '700',
  },
  rpeBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rpeText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  previousLabelContainer: {
    height: 14,
    justifyContent: 'center',
  },
  previousLabel: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyPrevSpacer: {
    height: 14,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
