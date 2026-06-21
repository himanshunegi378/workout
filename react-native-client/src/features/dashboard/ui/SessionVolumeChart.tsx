import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator, Pressable, useColorScheme, Platform } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { matchFont, LinearGradient, vec } from '@shopify/react-native-skia';
import { SymbolView } from 'expo-symbols';

import { useWorkouts } from '../api/query-hooks/use-workouts';
import { useSessionVolume, SessionVolumeNode } from '../api/query-hooks/use-session-volume';
import { useProgrammes } from '@/features/programmes';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

const font = Platform.OS === 'web' ? undefined : matchFont({
  fontFamily: 'sans-serif',
  fontSize: 9,
});

export function SessionVolumeChart() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { data: workouts, isLoading: loadingWorkouts } = useWorkouts(true);
  const { data: programmes, isLoading: loadingProgrammes } = useProgrammes();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('');
  const [selectedBar, setSelectedBar] = useState<SessionVolumeNode | null>(null);

  const hasActiveProgramme = programmes?.some((p) => p.is_active) ?? false;
  const effectiveWorkoutId = selectedWorkoutId || workouts?.[0]?.id || '';

  const { data: sessionData, isLoading: loadingVolume, isFetching } = useSessionVolume(
    effectiveWorkoutId || undefined,
    15
  );

  const chartData = useMemo(() => {
    return sessionData?.map((session, index) => {
      const dateObj = new Date(session.date);
      return {
        index,
        volume: session.volume,
        displayDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        raw: session,
      };
    }) || [];
  }, [sessionData]);

  // Set default selection to the latest point if available
  React.useEffect(() => {
    if (sessionData && sessionData.length > 0) {
      setSelectedBar(sessionData[sessionData.length - 1]);
    } else {
      setSelectedBar(null);
    }
  }, [sessionData]);

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'optimal':
        return { color: '#10b981', label: 'Optimal (+0-5%)' };
      case 'warning':
        return { color: '#f59e0b', label: 'High Jump (>5%)' };
      case 'deload':
        return { color: '#64748b', label: 'Deload (<0%)' };
      default:
        return { color: '#3b82f6', label: 'Baseline' };
    }
  };

  if (loadingWorkouts || loadingProgrammes) {
    return (
      <ThemedView type="backgroundElement" style={styles.loadingContainer}>
        <ActivityIndicator color="#be185d" size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <SymbolView name="chart.bar.fill" size={20} tintColor="#be185d" />
            <ThemedText type="smallBold" style={styles.title}>
              Session progression
            </ThemedText>
          </View>
          <ThemedText type="small" style={{ color: themeColors.textSecondary, marginTop: 4, fontSize: 13 }}>
            Track total volume per routine.
          </ThemedText>
        </View>

        {/* Workout Routine Selector */}
        {hasActiveProgramme && workouts && workouts.length > 0 && (
          <View style={styles.selectorWrapper}>
            <Pressable style={[styles.selectorButton, { backgroundColor: themeColors.backgroundSelected }]}>
              <ThemedText type="smallBold" numberOfLines={1} style={styles.selectorText}>
                {workouts.find((w) => w.id === effectiveWorkoutId)?.name || 'Select Routine'}
              </ThemedText>
              <SymbolView name="chevron.down" size={12} tintColor={themeColors.textSecondary} />
            </Pressable>
            {/* Simple dropdown modal can be simulated or we use a native picker. 
                For native smoothness, we render horizontal pills of routines to filter! 
                That's extremely premium on mobile instead of a clunky dropdown list! */}
          </View>
        )}
      </View>

      {/* Routine Horizontal Pills Selector */}
      {hasActiveProgramme && workouts && workouts.length > 1 && (
        <View style={styles.pillsRow}>
          {workouts.map((w) => {
            const isSelected = w.id === effectiveWorkoutId;
            return (
              <Pressable
                key={w.id}
                onPress={() => setSelectedWorkoutId(w.id)}
                style={[
                  styles.pill,
                  isSelected ? { backgroundColor: '#be185d' } : { backgroundColor: themeColors.backgroundSelected },
                ]}
              >
                <ThemedText
                  type="smallBold"
                  style={[styles.pillText, isSelected ? { color: '#fff' } : { color: themeColors.textSecondary }]}
                >
                  {w.name}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Chart Canvas */}
      <View style={styles.chartWrapper}>
        {!hasActiveProgramme && (
          <View style={[styles.overlay, { backgroundColor: themeColors.backgroundElement + 'E0' }]}>
            <SymbolView name="exclamationmark.triangle" size={32} tintColor="#be185d" />
            <ThemedText type="smallBold" style={{ marginTop: Spacing.two }}>
              No Active Programme
            </ThemedText>
            <ThemedText type="small" style={styles.overlaySubtitle}>
              Activate your training protocol in the programmes tab to see session progression.
            </ThemedText>
          </View>
        )}

        {hasActiveProgramme && (loadingVolume || isFetching) && (
          <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
            <ActivityIndicator color="#be185d" />
          </View>
        )}

        {hasActiveProgramme && chartData.length === 0 && !loadingVolume && (
          <View style={styles.emptyState}>
            <SymbolView name="chart.bar" size={32} tintColor={themeColors.textSecondary} />
            <ThemedText type="small" style={{ color: themeColors.textSecondary, marginTop: Spacing.two }}>
              No logged sessions found for this routine.
            </ThemedText>
          </View>
        )}

        {hasActiveProgramme && chartData.length > 0 && (
          <View style={{ height: 200, width: '100%' }}>
            <CartesianChart
              data={chartData}
              xKey="index"
              yKeys={['volume']}
              axisOptions={{
                font,
                tickCount: 5,
                lineColor: themeColors.backgroundSelected,
                labelColor: themeColors.textSecondary,
                formatXLabel: (index) => {
                  const item = chartData[Math.round(index)];
                  return item ? item.displayDate : '';
                },
                formatYLabel: (val) => `${Math.round(val / 1000)}k`,
              }}
            >
              {({ points, chartBounds }) => (
                <Bar
                  points={points.volume}
                  chartBounds={chartBounds}
                  roundedCorners={{ topLeft: 4, topRight: 4 }}
                  animate={{ type: 'timing', duration: 300 }}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, 200)}
                    colors={['#be185d', '#be185d40']}
                  />
                </Bar>
              )}
            </CartesianChart>
          </View>
        )}
      </View>

      {/* Selected Point Details Card */}
      {selectedBar && (
        <ThemedView type="backgroundSelected" style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <ThemedText type="smallBold">
              {new Date(selectedBar.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </ThemedText>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusDetails(selectedBar.status).color }]} />
          </View>

          <View style={styles.detailBody}>
            <View style={styles.detailItem}>
              <ThemedText type="code" style={styles.detailLabel}>VOLUME</ThemedText>
              <ThemedText type="smallBold" style={styles.detailValue}>
                {Math.round(selectedBar.volume).toLocaleString()} kg
              </ThemedText>
            </View>

            <View style={styles.detailItem}>
              <ThemedText type="code" style={styles.detailLabel}>STATUS</ThemedText>
              <ThemedText
                type="smallBold"
                style={[styles.detailValue, { color: getStatusDetails(selectedBar.status).color }]}
              >
                {getStatusDetails(selectedBar.status).label}
              </ThemedText>
            </View>

            {selectedBar.status !== 'neutral' && (
              <View style={styles.detailItem}>
                <DailyProgressChange value={selectedBar.deltaPercentage} />
              </View>
            )}
          </View>
        </ThemedView>
      )}
    </ThemedView>
  );
}

function DailyProgressChange({ value }: { value: number }) {
  const isUp = value > 0;
  return (
    <View style={styles.changeRow}>
      <SymbolView
        name={isUp ? 'arrow.up.right' : 'arrow.down.right'}
        size={12}
        tintColor={isUp ? '#10b981' : '#ef4444'}
      />
      <ThemedText type="smallBold" style={{ color: isUp ? '#10b981' : '#ef4444', fontSize: 12 }}>
        {isUp ? '+' : ''}
        {value}%
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  selectorWrapper: {
    maxWidth: 140,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 16,
    gap: Spacing.one,
  },
  selectorText: {
    fontSize: 12,
    flex: 1,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pillText: {
    fontSize: 12,
  },
  chartWrapper: {
    position: 'relative',
    marginTop: Spacing.one,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: Spacing.four,
    height: 200,
  },
  overlaySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    maxWidth: 240,
    marginTop: Spacing.one,
  },
  emptyState: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCard: {
    padding: Spacing.three,
    borderRadius: 16,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  detailBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 8,
    color: 'rgba(128, 128, 128, 0.6)',
  },
  detailValue: {
    fontSize: 13,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
  },
});
