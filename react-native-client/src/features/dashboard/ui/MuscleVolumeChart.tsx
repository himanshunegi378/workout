import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator, Pressable, useColorScheme, Platform } from 'react-native';
import { CartesianChart, Area, Line } from 'victory-native';
import { matchFont, LinearGradient, vec } from '@shopify/react-native-skia';
import { SymbolView } from 'expo-symbols';

import { MuscleGroup } from '@/features/exercises';
import { useMuscleHistoricalMetrics } from '../api/query-hooks/use-muscle-historical-data';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { MuscleChartMetric } from '../types';

const font = Platform.OS === 'web' ? undefined : matchFont({
  fontFamily: 'sans-serif',
  fontSize: 9,
});

interface MuscleVolumeChartProps {
  muscleGroup: MuscleGroup;
}

const colors: Record<string, string> = {
  Chest: '#ff4757',
  Back: '#2ed573',
  Legs: '#ffa502',
  Shoulders: '#5352ed',
  Arms: '#eccc68',
  Abs: '#70a1ff',
};

const metricCopy: Record<MuscleChartMetric, { eyebrow: string; title: string; empty: string; unit: string }> = {
  volume: {
    eyebrow: 'Volume trend (kg)',
    title: '8 week pulse',
    empty: 'Log weighted sets to build a volume pulse.',
    unit: 'kg',
  },
  avgLoad: {
    eyebrow: 'Avg load trend',
    title: 'Strength proxy',
    empty: 'No weighted-load sets yet. Bodyweight work still counts in your training, but this trend needs external load.',
    unit: 'kg',
  },
};

export function MuscleVolumeChart({ muscleGroup }: MuscleVolumeChartProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const [metric, setMetric] = useState<MuscleChartMetric>('volume');
  const { data, isLoading, error } = useMuscleHistoricalMetrics(muscleGroup);

  const strokeColor = colors[muscleGroup] || '#be185d';
  const copy = metricCopy[metric];

  const chartData = useMemo(() => {
    return data?.map((point, index) => ({
      index,
      value: point[metric] ?? 0,
      trend: (metric === 'volume' ? point.volumeTrend : point.avgLoadTrend) ?? 0,
      label: point.label,
    })) ?? [];
  }, [data, metric]);

  const hasMetricData = useMemo(() => {
    return data?.some((point) => {
      const val = point[metric];
      return val !== null && val > 0;
    }) ?? false;
  }, [data, metric]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={strokeColor} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.errorContainer}>
        <SymbolView name="exclamationmark.triangle" size={24} tintColor={themeColors.textSecondary} />
        <ThemedText type="code" style={{ color: themeColors.textSecondary, marginTop: Spacing.two }}>
          History unavailable
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title & Segmented Control */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <ThemedText type="code" style={styles.eyebrow}>
            {copy.eyebrow.toUpperCase()}
          </ThemedText>
          <ThemedText type="smallBold" style={styles.title}>
            {copy.title}
          </ThemedText>
        </View>

        {/* Segment Button */}
        <View style={[styles.segmentContainer, { backgroundColor: themeColors.backgroundSelected }]}>
          <Pressable
            onPress={() => setMetric('volume')}
            style={[styles.segmentButton, metric === 'volume' && { backgroundColor: strokeColor }]}
          >
            <ThemedText type="code" style={[styles.segmentText, metric === 'volume' && { color: '#fff' }]}>
              VOL
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setMetric('avgLoad')}
            style={[styles.segmentButton, metric === 'avgLoad' && { backgroundColor: strokeColor }]}
          >
            <ThemedText type="code" style={[styles.segmentText, metric === 'avgLoad' && { color: '#fff' }]}>
              LOAD
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {metric === 'avgLoad' && !hasMetricData ? (
        <View style={[styles.emptyContainer, { backgroundColor: themeColors.backgroundSelected }]}>
          <SymbolView name="waveform.path" size={24} tintColor={themeColors.textSecondary} />
          <ThemedText type="smallBold" style={{ marginTop: Spacing.two }}>
            Load trend waiting
          </ThemedText>
          <ThemedText type="small" style={styles.emptySubtitle}>
            {copy.empty}
          </ThemedText>
        </View>
      ) : (
        <View style={styles.chartWrapper}>
          <View style={{ height: 180, width: '100%' }}>
            {chartData.length > 0 ? (
              <CartesianChart
                data={chartData}
                xKey="index"
                yKeys={['value', 'trend']}
                axisOptions={{
                  font,
                  tickCount: 5,
                  lineColor: themeColors.backgroundSelected,
                  labelColor: themeColors.textSecondary,
                  formatXLabel: (index) => {
                    const item = chartData[Math.round(index)];
                    return item ? item.label : '';
                  },
                  formatYLabel: (val) => {
                    if (metric === 'volume' && val > 9999) {
                      return `${(val / 1000).toFixed(1)}k`;
                    }
                    return `${Math.round(val)}`;
                  },
                }}
              >
                {({ points, chartBounds }) => (
                  <>
                    <Area
                      points={points.value}
                      y0={chartBounds.bottom}
                      animate={{ type: 'timing', duration: 300 }}
                    >
                      <LinearGradient
                        start={vec(0, 0)}
                        end={vec(0, 180)}
                        colors={[`${strokeColor}55`, `${strokeColor}00`]}
                      />
                    </Area>
                    <Line
                      points={points.value}
                      color={strokeColor}
                      strokeWidth={2.5}
                      animate={{ type: 'timing', duration: 300 }}
                    />
                    <Line
                      points={points.trend}
                      color={themeColors.text}
                      strokeWidth={1.5}
                      animate={{ type: 'timing', duration: 300 }}
                    />
                  </>
                )}
              </CartesianChart>
            ) : (
              <View style={styles.emptyState}>
                <ThemedText type="small" style={{ color: themeColors.textSecondary }}>No data</ThemedText>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  container: {
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 2,
    opacity: 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 2,
  },
  segmentButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 5,
    borderRadius: 18,
  },
  segmentText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  emptyContainer: {
    height: 180,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  emptySubtitle: {
    fontSize: 11,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: Spacing.one,
    lineHeight: 16,
  },
  chartWrapper: {
    marginTop: Spacing.one,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
