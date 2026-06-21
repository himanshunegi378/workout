import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator, Pressable, useColorScheme, Platform } from 'react-native';
import { CartesianChart, Line, Area } from 'victory-native';
import { matchFont, LinearGradient, vec } from '@shopify/react-native-skia';
import { SymbolView } from 'expo-symbols';
import { subDays, startOfDay } from 'date-fns';

import { useFatigueData } from '../api/query-hooks/use-fatigue-data';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

const font = Platform.OS === 'web' ? undefined : matchFont({
  fontFamily: 'sans-serif',
  fontSize: 9,
});

export function FatigueTrendLine() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const [startDateOffset, setStartDateOffset] = useState(0);

  const targetEndDate = startDateOffset === 0 ? undefined : subDays(startOfDay(new Date()), startDateOffset);
  const { data: response, isLoading, error, isFetching } = useFatigueData(targetEndDate, 90);
  const rawData = response?.timeSeries;
  const hasMoreHistory = response?.hasMoreHistory ?? false;

  const handlePrev = () => {
    if (!hasMoreHistory) return;
    setStartDateOffset((prev) => prev + 90);
  };

  const handleNext = () => {
    if (startDateOffset <= 0) return;
    setStartDateOffset((prev) => Math.max(0, prev - 90));
  };

  const chartData = useMemo(() => {
    return rawData?.map((d, index) => {
      const dateObj = new Date(d.date);
      return {
        index,
        acuteLoad: d.acuteLoad,
        chronicLoad: d.chronicLoad,
        ratio: d.ratio,
        displayDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    }) ?? [];
  }, [rawData]);

  const isCalibrating = chartData.length > 0 && (rawData?.[rawData.length - 1]?.isCalibrating ?? false);
  const currentRatio = chartData.length > 0 ? (rawData?.[rawData.length - 1]?.ratio ?? 0) : 0;

  let statusColor = '#10b981'; // success
  let statusText = 'Optimal';

  if (currentRatio > 1.5) {
    statusColor = '#ef4444'; // danger
    statusText = 'Danger';
  } else if (currentRatio >= 1.3) {
    statusColor = '#f59e0b'; // warning
    statusText = 'Overreaching';
  } else if (currentRatio < 0.8) {
    statusColor = themeColors.textSecondary;
    statusText = 'Undertraining';
  }

  if (isLoading && startDateOffset === 0) {
    return (
      <ThemedView type="backgroundElement" style={styles.loadingContainer}>
        <ActivityIndicator color="#be185d" size="large" />
      </ThemedView>
    );
  }

  if (error || !rawData) {
    return (
      <ThemedView type="backgroundElement" style={styles.errorContainer}>
        <ThemedText type="small" style={{ color: themeColors.textSecondary }}>
          Failed to load fatigue data
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <ThemedText type="code" style={styles.eyebrow}>
            LOAD BALANCE
          </ThemedText>
          <View style={styles.titleRow}>
            <SymbolView name="waveform.path.ecg" size={20} tintColor="#be185d" />
            <ThemedText type="smallBold" style={styles.title}>
              Fatigue and workload
            </ThemedText>
          </View>
          
          {/* Pagination Controls */}
          <View style={styles.paginationRow}>
            <Pressable
              onPress={handlePrev}
              disabled={!hasMoreHistory || isFetching}
              style={({ pressed }) => [
                styles.navButton,
                (!hasMoreHistory || isFetching) && styles.navButtonDisabled,
                pressed && styles.navButtonPressed,
              ]}
            >
              <SymbolView name="chevron.left" size={14} tintColor={themeColors.text} />
            </Pressable>
            <ThemedText type="small" style={styles.paginationLabel}>
              {isFetching ? 'Loading...' : (startDateOffset === 0 ? 'Last 90 days' : `${startDateOffset} days back`)}
            </ThemedText>
            <Pressable
              onPress={handleNext}
              disabled={startDateOffset === 0 || isFetching}
              style={({ pressed }) => [
                styles.navButton,
                (startDateOffset === 0 || isFetching) && styles.navButtonDisabled,
                pressed && styles.navButtonPressed,
              ]}
            >
              <SymbolView name="chevron.right" size={14} tintColor={themeColors.text} />
            </Pressable>
          </View>
        </View>

        {!isCalibrating && chartData.length > 0 && startDateOffset === 0 && (
          <View style={styles.metricBadge}>
            <ThemedText type="subtitle" style={[styles.badgeValue, { color: statusColor }]}>
              {currentRatio.toFixed(2)}
            </ThemedText>
            <ThemedText type="code" style={[styles.badgeLabel, { color: statusColor }]}>
              {statusText}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Chart Canvas */}
      <View style={styles.chartWrapper}>
        {isCalibrating && (
          <View style={[styles.overlay, { backgroundColor: themeColors.backgroundElement + 'E0' }]}>
            <SymbolView name="timer" size={32} tintColor="#be185d" />
            <ThemedText type="smallBold" style={{ marginTop: Spacing.two }}>
              Calibrating
            </ThemedText>
            <ThemedText type="small" style={styles.overlaySubtitle}>
              Building your 28-day baseline before calculating fatigue.
            </ThemedText>
          </View>
        )}

        <View style={{ height: 200, width: '100%' }}>
          {chartData.length > 0 ? (
            <CartesianChart
              data={chartData}
              xKey="index"
              yKeys={['chronicLoad', 'acuteLoad']}
              axisOptions={{
                font,
                tickCount: 5,
                lineColor: themeColors.backgroundSelected,
                labelColor: themeColors.textSecondary,
                formatXLabel: (index) => {
                  const item = chartData[Math.round(index)];
                  return item ? item.displayDate : '';
                },
              }}
            >
              {({ points, chartBounds }) => (
                <>
                  <Area
                    points={points.chronicLoad}
                    y0={chartBounds.bottom}
                    animate={{ type: 'timing', duration: 300 }}
                  >
                    <LinearGradient
                      start={vec(0, 0)}
                      end={vec(0, 200)}
                      colors={['#3b82f640', '#3b82f600']}
                    />
                  </Area>
                  <Line
                    points={points.chronicLoad}
                    color="#3b82f6"
                    strokeWidth={1.5}
                    animate={{ type: 'timing', duration: 300 }}
                  />
                  <Line
                    points={points.acuteLoad}
                    color="#14b8a6"
                    strokeWidth={2.5}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: 260,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    height: 260,
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 2.2,
    opacity: 0.6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  navButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.25,
  },
  navButtonPressed: {
    opacity: 0.7,
  },
  paginationLabel: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
  },
  metricBadge: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  badgeValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  chartWrapper: {
    position: 'relative',
    marginTop: Spacing.two,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: Spacing.four,
    textAlign: 'center',
  },
  overlaySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    maxWidth: 240,
    marginTop: Spacing.one,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
