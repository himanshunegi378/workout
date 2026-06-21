import React, { useMemo, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Pressable, useColorScheme } from 'react-native';
import {
  format,
  subDays,
  startOfToday,
  eachDayOfInterval,
  startOfWeek,
  parseISO,
  isSameMonth,
} from 'date-fns';
import { SymbolView } from 'expo-symbols';

import { useHeatmapActivity } from '../../analytics/api/query-hooks/use-heatmap-activity';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

export function WorkoutHeatmap() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { data: activity = [], isLoading } = useHeatmapActivity();
  const [selectedCell, setSelectedCell] = useState<{ date: Date; count: number } | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const labelWidth = 32; // Estimated width for day labels

  const daysToShow = useMemo(() => {
    if (containerWidth <= 0) return 90; // Fallback for initial state
    const availableForWeeks = containerWidth - labelWidth - 8;
    const numWeeks = Math.floor(availableForWeeks / 14); // 10px cell + 4px spacing/margin
    return Math.max(numWeeks * 7, 7);
  }, [containerWidth]);

  const { endDate, gridStart } = useMemo(() => {
    const end = startOfToday();
    const start = subDays(end, daysToShow);
    const grid = startOfWeek(start, { weekStartsOn: 0 }); // Sunday start
    return { endDate: end, gridStart: grid };
  }, [daysToShow]);

  const allDays = useMemo(() => {
    return eachDayOfInterval({ start: gridStart, end: endDate });
  }, [gridStart, endDate]);

  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    activity.forEach((item) => {
      const dateStr = format(parseISO(item.date), 'yyyy-MM-dd');
      map.set(dateStr, item.count);
    });
    return map;
  }, [activity]);

  const getCellColor = (count: number) => {
    if (count === 0) return themeColors.backgroundSelected;
    if (count < 3) return 'rgba(190, 24, 93, 0.25)';
    if (count < 5) return 'rgba(190, 24, 93, 0.5)';
    if (count < 8) return 'rgba(190, 24, 93, 0.8)';
    return '#be185d';
  };

  const weeks = useMemo(() => {
    const weekChunks: Date[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weekChunks.push(allDays.slice(i, i + 7));
    }
    return weekChunks;
  }, [allDays]);

  const dateString = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  if (isLoading) {
    return (
      <ThemedView type="backgroundElement" style={styles.loadingContainer}>
        <ActivityIndicator color="#be185d" />
        <ThemedText type="small" style={styles.loadingText}>
          Crunching workout data...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <ThemedText type="smallBold" style={styles.headerTitle}>
            Consistency Heatmap
          </ThemedText>
          <ThemedText type="small" style={{ color: themeColors.textSecondary, fontSize: 12 }}>
            {dateString}
          </ThemedText>
        </View>
        <View style={styles.headerRight}>
          <SymbolView
            name="info.circle"
            size={16}
            tintColor={themeColors.textSecondary}
          />
          <View style={[styles.separator, { backgroundColor: themeColors.textSecondary + '33' }]} />
          <ThemedText type="code" style={{ color: themeColors.textSecondary, fontSize: 10 }}>
            {Math.round(daysToShow / 30.43)} Months
          </ThemedText>
        </View>
      </View>

      {/* Grid Container */}
      <View
        style={styles.gridContainer}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        {/* Y-Axis Labels */}
        <View style={styles.yAxisLabels}>
          <View style={styles.monthLabelFiller} />
          <ThemedText type="code" style={styles.dayLabel}>Sun</ThemedText>
          <View style={styles.dayLabelFiller} />
          <ThemedText type="code" style={styles.dayLabel}>Tue</ThemedText>
          <View style={styles.dayLabelFiller} />
          <ThemedText type="code" style={styles.dayLabel}>Thu</ThemedText>
          <View style={styles.dayLabelFiller} />
          <ThemedText type="code" style={styles.dayLabel}>Sat</ThemedText>
        </View>

        {/* Columns Grid */}
        <View style={styles.columnsScroll}>
          {weeks.map((week, weekIndex) => {
            const firstDayOfWeek = week[0];
            const isNewMonth =
              weekIndex === 0 || !isSameMonth(firstDayOfWeek, weeks[weekIndex - 1][0]);

            return (
              <View key={weekIndex} style={styles.weekColumn}>
                {/* Month header label */}
                <View style={styles.monthHeaderCell}>
                  <ThemedText type="code" numberOfLines={1} style={styles.monthHeaderText}>
                    {isNewMonth ? format(firstDayOfWeek, 'MMM') : ''}
                  </ThemedText>
                </View>

                {/* Day cells */}
                {week.map((day) => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const count = activityMap.get(dateKey) || 0;
                  const isSelected = selectedCell && format(selectedCell.date, 'yyyy-MM-dd') === dateKey;

                  return (
                    <Pressable
                      key={dateKey}
                      onPress={() => setSelectedCell({ date: day, count })}
                      style={[
                        styles.cell,
                        {
                          backgroundColor: getCellColor(count),
                          borderColor: isSelected ? themeColors.text : 'transparent',
                          borderWidth: isSelected ? 1 : 0,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>

      {/* Selected Cell Detail or Legend */}
      <View style={styles.footer}>
        {selectedCell ? (
          <Pressable style={styles.detailContainer} onPress={() => setSelectedCell(null)}>
            <ThemedText type="smallBold" style={{ fontSize: 12 }}>
              {format(selectedCell.date, 'MMM d, yyyy')}:{' '}
              <ThemedText type="small" style={{ color: themeColors.textSecondary }}>
                {selectedCell.count} exercises performed
              </ThemedText>
            </ThemedText>
            <ThemedText type="code" style={{ fontSize: 10, color: '#be185d' }}>
              Clear
            </ThemedText>
          </Pressable>
        ) : (
          <View style={styles.legendContainer}>
            <ThemedText type="code" style={styles.legendText}>Less</ThemedText>
            <View style={styles.legendSquares}>
              <View style={[styles.legendSquare, { backgroundColor: themeColors.backgroundSelected }]} />
              <View style={[styles.legendSquare, { backgroundColor: 'rgba(190, 24, 93, 0.25)' }]} />
              <View style={[styles.legendSquare, { backgroundColor: 'rgba(190, 24, 93, 0.5)' }]} />
              <View style={[styles.legendSquare, { backgroundColor: 'rgba(190, 24, 93, 0.8)' }]} />
              <View style={[styles.legendSquare, { backgroundColor: '#be185d' }]} />
            </View>
            <ThemedText type="code" style={styles.legendText}>More</ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: Spacing.four,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
    gap: Spacing.two,
  },
  loadingText: {
    color: '#888',
  },
  container: {
    padding: Spacing.four,
    borderRadius: 20,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  headerTitleContainer: {
    gap: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  separator: {
    width: 1,
    height: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  yAxisLabels: {
    width: 32,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingRight: 6,
  },
  monthLabelFiller: {
    height: 14,
  },
  dayLabel: {
    fontSize: 8,
    lineHeight: 10,
    height: 10,
    color: 'rgba(128,128,128,0.5)',
  },
  dayLabelFiller: {
    height: 10,
  },
  columnsScroll: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  weekColumn: {
    width: 12,
    marginRight: 2,
    gap: 4,
    alignItems: 'center',
  },
  monthHeaderCell: {
    height: 14,
    justifyContent: 'center',
  },
  monthHeaderText: {
    fontSize: 8,
    color: 'rgba(128,128,128,0.5)',
  },
  cell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  footer: {
    marginTop: Spacing.one,
    height: 20,
    justifyContent: 'center',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
  legendText: {
    fontSize: 8,
    color: 'rgba(128,128,128,0.5)',
  },
  legendSquares: {
    flexDirection: 'row',
    gap: 3,
  },
  legendSquare: {
    width: 8,
    height: 8,
    borderRadius: 1.5,
  },
});
