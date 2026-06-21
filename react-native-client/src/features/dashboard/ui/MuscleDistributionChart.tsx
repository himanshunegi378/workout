import React, { useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator, useColorScheme } from 'react-native';
import { PolarChart, Pie } from 'victory-native';
import { SymbolView } from 'expo-symbols';

import { useMusclePerformanceData } from '../api/query-hooks/use-muscle-performance-data';
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

export function MuscleDistributionChart() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { data: weeklyData, isLoading, error } = useMusclePerformanceData();

  const chartData = useMemo(() => {
    if (!weeklyData) return [];
    return weeklyData
      .filter((m) => m.currentWeekSets > 0)
      .map((m) => ({
        label: m.muscleGroup,
        value: m.currentWeekSets,
        color: muscleColors[m.muscleGroup] || '#be185d',
      }));
  }, [weeklyData]);

  const totalSets = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  if (isLoading) {
    return (
      <ThemedView type="backgroundElement" style={styles.loadingContainer}>
        <ActivityIndicator color="#be185d" />
      </ThemedView>
    );
  }

  if (error || !weeklyData) {
    return (
      <ThemedView type="backgroundElement" style={styles.loadingContainer}>
        <ThemedText type="small" style={{ color: themeColors.textSecondary }}>
          Failed to load muscle distribution
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <SymbolView name="chart.pie.fill" size={20} tintColor="#be185d" />
          <ThemedText type="smallBold" style={styles.title}>
            Muscle distribution
          </ThemedText>
        </View>
        <ThemedText type="small" style={{ color: themeColors.textSecondary, marginTop: 4, fontSize: 13 }}>
          Set allocation for the current week.
        </ThemedText>
      </View>

      {chartData.length === 0 ? (
        <View style={styles.emptyState}>
          <SymbolView name="circle.grid.2x2" size={32} tintColor={themeColors.textSecondary} />
          <ThemedText type="small" style={{ color: themeColors.textSecondary, marginTop: Spacing.two, textAlign: 'center' }}>
            No exercises logged this week. Start training to see your set distribution.
          </ThemedText>
        </View>
      ) : (
        <View style={styles.contentRow}>
          {/* Pie Chart Canvas */}
          <View style={styles.chartWrapper}>
            <PolarChart
              data={chartData}
              labelKey="label"
              valueKey="value"
              colorKey="color"
            >
              <Pie.Chart />
            </PolarChart>

            {/* Inner Center Label for Donut Effect */}
            <View style={styles.innerLabelContainer}>
              <ThemedText type="subtitle" style={styles.totalValue}>
                {totalSets}
              </ThemedText>
              <ThemedText type="code" style={styles.totalLabel}>
                SETS
              </ThemedText>
            </View>
          </View>

          {/* Legend Items */}
          <View style={styles.legendContainer}>
            {chartData.map((item) => {
              const percentage = Math.round((item.value / totalSets) * 100);
              return (
                <View key={item.label} style={styles.legendItem}>
                  <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                  <View style={{ flex: 1 }}>
                    <ThemedText type="smallBold" style={styles.legendLabel}>
                      {item.label}
                    </ThemedText>
                    <ThemedText type="code" style={styles.legendSubtitle}>
                      {item.value} sets ({percentage}%)
                    </ThemedText>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: 220,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: Spacing.four,
    borderRadius: 20,
    gap: Spacing.three,
  },
  header: {
    marginBottom: Spacing.one,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.four,
  },
  chartWrapper: {
    width: 140,
    height: 140,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerLabelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#000', // Center background cover to create Donut
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  totalLabel: {
    fontSize: 8,
    opacity: 0.6,
  },
  legendContainer: {
    flex: 1,
    gap: Spacing.two,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
  },
  legendSubtitle: {
    fontSize: 9,
    color: 'rgba(128, 128, 128, 0.7)',
  },
});
