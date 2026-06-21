import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Pressable, ScrollView, useColorScheme } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { BottomDrawer } from '@/components/ui/bottom-drawer';
import { useMusclePerformanceData } from '../api/query-hooks/use-muscle-performance-data';
import { MuscleVolumeChart } from './MuscleVolumeChart';
import { MusclePerformanceData, ExercisePerformanceData, TrendStatus } from '../types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

const muscleColors: Record<string, string> = {
  Chest: '#ff4757',
  Back: '#2ed573',
  Legs: '#ffa502',
  Shoulders: '#5352ed',
  Arms: '#eccc68',
  Abs: '#70a1ff',
};

const TrendBadge = ({ status, label }: { status: TrendStatus; label: string }) => {
  const config = {
    up: { icon: 'arrow.up.right' as const, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    down: { icon: 'arrow.down.right' as const, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    same: { icon: 'minus' as const, color: 'rgba(128, 128, 128, 0.7)', bg: 'rgba(255, 255, 255, 0.05)' },
  }[status];

  return (
    <View style={[styles.trendBadge, { backgroundColor: config.bg }]}>
      <SymbolView name={config.icon} size={10} tintColor={config.color} />
      <ThemedText type="code" style={[styles.trendBadgeText, { color: config.color }]}>
        {label}
      </ThemedText>
    </View>
  );
};

export function MuscleOutputTable() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { data: weeklyData, isLoading, error } = useMusclePerformanceData();
  const [selectedMuscle, setSelectedMuscle] = useState<MusclePerformanceData | null>(null);

  if (isLoading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator color="#be185d" />
      </View>
    );
  }

  if (error || !weeklyData) {
    return (
      <ThemedView type="backgroundElement" style={styles.errorWrapper}>
        <SymbolView name="exclamationmark.triangle" size={24} tintColor={themeColors.textSecondary} />
        <ThemedText type="smallBold" style={{ marginTop: Spacing.two }}>
          Analysis interrupted
        </ThemedText>
      </ThemedView>
    );
  }

  if (weeklyData.length === 0) {
    return (
      <ThemedView type="backgroundElement" style={styles.emptyWrapper}>
        <SymbolView name="waveform.path.ecg" size={24} tintColor={themeColors.textSecondary} />
        <ThemedText type="smallBold" style={{ marginTop: Spacing.two }}>
          No muscle data yet
        </ThemedText>
        <ThemedText type="small" style={{ color: themeColors.textSecondary, marginTop: Spacing.one }}>
          Log a few sessions to see your volume pulse.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <ThemedText type="code" style={styles.eyebrow}>
            MUSCLE BALANCE
          </ThemedText>
          <ThemedText type="smallBold" style={styles.title}>
            Performance pulse
          </ThemedText>
          <ThemedText type="small" style={{ color: themeColors.textSecondary, marginTop: 4, fontSize: 13 }}>
            Real-time workload balance across trained muscle groups.
          </ThemedText>
        </View>
      </View>

      {/* Grid List */}
      <View style={styles.grid}>
        {weeklyData.map((row) => {
          const muscleColor = muscleColors[row.muscleGroup] || '#be185d';
          const volumeChange = row.volumeChangePercentage;

          let changeColor: string = themeColors.textSecondary;
          if (volumeChange > 5) changeColor = '#ef4444';
          else if (volumeChange >= 2) changeColor = '#10b981';
          else if (volumeChange < 0) changeColor = '#b91c1c';

          return (
            <Pressable
              key={row.muscleGroup}
              onPress={() => setSelectedMuscle(row)}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: themeColors.backgroundElement },
                pressed && styles.cardPressed,
              ]}
            >
              <View style={[styles.colorBar, { backgroundColor: muscleColor }]} />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View>
                    <ThemedText type="code" style={styles.cardEyebrow}>MUSCLE GROUP</ThemedText>
                    <ThemedText type="smallBold" style={styles.cardTitle}>
                      {row.muscleGroup}
                    </ThemedText>
                  </View>
                  <View style={styles.badgeRow}>
                    <TrendBadge status={row.repsTrend} label="R" />
                    <TrendBadge status={row.weightTrend} label="W" />
                    <TrendBadge status={row.volumeTrend} label="VOL" />
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.footerItem}>
                    <ThemedText type="code" style={styles.cardEyebrow}>SETS</ThemedText>
                    <ThemedText type="smallBold">{row.currentWeekSets}</ThemedText>
                  </View>
                  <View style={styles.footerItem}>
                    <ThemedText type="code" style={styles.cardEyebrow}>VOLUME</ThemedText>
                    <ThemedText type="smallBold">
                      {row.currentWeekVolume > 9999
                        ? `${(row.currentWeekVolume / 1000).toFixed(1)}k`
                        : row.currentWeekVolume.toLocaleString()}
                      <ThemedText type="code" style={{ color: themeColors.textSecondary, fontSize: 10 }}> kg</ThemedText>
                    </ThemedText>
                  </View>
                  <View style={[styles.footerItem, { alignItems: 'flex-end' }]}>
                    <ThemedText type="code" style={styles.cardEyebrow}>CHANGE</ThemedText>
                    <ThemedText type="smallBold" style={{ color: changeColor }}>
                      {volumeChange > 0 ? '+' : ''}
                      {volumeChange.toFixed(1)}%
                    </ThemedText>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Muscle Details Drawer */}
      {selectedMuscle && (
        <BottomDrawer
          isOpen={!!selectedMuscle}
          onClose={() => setSelectedMuscle(null)}
          title={selectedMuscle.muscleGroup}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.drawerScroll}
          >
            {/* Summary info */}
            <View style={styles.drawerSummary}>
              <View>
                <ThemedText type="code" style={styles.cardEyebrow}>INTELLIGENCE REPORT</ThemedText>
                <ThemedText type="subtitle" style={styles.drawerTitle}>
                  {selectedMuscle.muscleGroup}
                </ThemedText>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <ThemedText type="code" style={styles.cardEyebrow}>SESSION VOLUME</ThemedText>
                <ThemedText type="smallBold" style={{ fontSize: 18 }}>
                  {selectedMuscle.currentWeekVolume.toLocaleString()}
                  <ThemedText type="code" style={{ color: themeColors.textSecondary }}> kg</ThemedText>
                </ThemedText>
              </View>
            </View>

            {/* Historical Muscle Pulse Chart */}
            <View style={styles.chartContainer}>
              <MuscleVolumeChart muscleGroup={selectedMuscle.muscleGroup} />
            </View>

            {/* Exercise-level performance breakdown */}
            <View style={styles.exercisesList}>
              <ThemedText type="code" style={styles.sectionHeader}>
                EXERCISE BREAKDOWN
              </ThemedText>
              
              {selectedMuscle.exercises.map((ex, index) => {
                const exVolumeChange = ex.volumeChangePercentage;
                let exChangeColor: string = themeColors.textSecondary;
                if (exVolumeChange > 5) exChangeColor = '#ef4444';
                else if (exVolumeChange >= 2) exChangeColor = '#10b981';
                else if (exVolumeChange < 0) exChangeColor = '#b91c1c';

                return (
                  <View key={ex.name} style={[styles.exItem, { borderBottomColor: themeColors.backgroundSelected }]}>
                    <View style={styles.exHeader}>
                      <ThemedText type="smallBold" style={styles.exName}>
                        {ex.name}
                      </ThemedText>
                      <View style={styles.badgeRow}>
                        <TrendBadge status={ex.repsTrend} label="R" />
                        <TrendBadge status={ex.weightTrend} label="W" />
                        <TrendBadge status={ex.volumeTrend} label="VOL" />
                      </View>
                    </View>

                    <View style={styles.exStats}>
                      <View style={styles.exStatBox}>
                        <ThemedText type="code" style={styles.exLabel}>SETS</ThemedText>
                        <ThemedText type="small" style={styles.exValue}>{ex.currentWeekSets}</ThemedText>
                      </View>
                      <View style={styles.exStatBox}>
                        <ThemedText type="code" style={styles.exLabel}>VOL</ThemedText>
                        <ThemedText type="small" style={styles.exValue}>
                          {ex.currentWeekVolume.toLocaleString()} kg
                        </ThemedText>
                      </View>
                      <View style={[styles.exStatBox, { alignItems: 'flex-end' }]}>
                        <ThemedText type="code" style={styles.exLabel}>CHANGE</ThemedText>
                        <ThemedText type="smallBold" style={{ color: exChangeColor, fontSize: 12 }}>
                          {exVolumeChange > 0 ? '+' : ''}
                          {exVolumeChange.toFixed(1)}%
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </BottomDrawer>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingWrapper: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorWrapper: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  emptyWrapper: {
    padding: Spacing.four,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    gap: Spacing.three,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    opacity: 0.6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  grid: {
    gap: Spacing.two,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 96,
  },
  cardPressed: {
    opacity: 0.85,
  },
  colorBar: {
    width: 6,
  },
  cardContent: {
    flex: 1,
    padding: Spacing.three,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardEyebrow: {
    fontSize: 8,
    color: 'rgba(128, 128, 128, 0.6)',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 4,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  trendBadgeText: {
    fontSize: 8,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  footerItem: {
    flex: 1,
    gap: 1,
  },
  drawerScroll: {
    paddingBottom: Spacing.five,
  },
  drawerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: Spacing.three,
    marginBottom: Spacing.four,
  },
  drawerTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  chartContainer: {
    marginBottom: Spacing.four,
  },
  exercisesList: {
    gap: Spacing.two,
  },
  sectionHeader: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: 'rgba(128, 128, 128, 0.5)',
    marginBottom: Spacing.one,
  },
  exItem: {
    borderBottomWidth: 1,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  exHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exName: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  exStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exStatBox: {
    flex: 1,
    gap: 1,
  },
  exLabel: {
    fontSize: 8,
    color: 'rgba(128, 128, 128, 0.6)',
  },
  exValue: {
    fontSize: 12,
  },
});
