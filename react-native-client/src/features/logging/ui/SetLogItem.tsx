import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { ExerciseLog } from '../types';

interface SetLogItemProps {
  index?: number;
  log: Partial<ExerciseLog> & { reps: number };
  isAdHoc?: boolean;
  variant?: 'compact' | 'featured' | 'list';
}

export function SetLogItem({
  index,
  log,
  isAdHoc,
  variant = 'compact',
}: SetLogItemProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { weight, reps, rpe, pr_type, set_order_index } = log;
  const displayIndex = index ?? (set_order_index !== undefined ? set_order_index + 1 : 0);
  const prType = pr_type;

  if (variant === 'featured') {
    return (
      <View style={[styles.featuredContainer, { borderColor: scheme === 'dark' ? '#222' : '#eee' }]}>
        <View style={styles.leftRow}>
          <View style={styles.badgeWrapper}>
            <View
              style={[
                styles.indexBadge,
                { backgroundColor: prType ? 'rgba(190,24,93,0.15)' : themeColors.backgroundSelected },
              ]}
            >
              {prType ? (
                <SymbolView
                  name={{ ios: 'trophy.fill', android: 'emoji_events', web: 'emoji_events' }}
                  size={12}
                  tintColor="#be185d"
                />
              ) : (
                <ThemedText type="smallBold" style={{ fontSize: 11, color: themeColors.text }}>
                  {displayIndex}
                </ThemedText>
              )}
            </View>
            {isAdHoc && (
              <View style={styles.adHocDot}>
                <SymbolView
                  name={{ ios: 'bolt.fill', android: 'flash_on', web: 'flash_on' }}
                  size={6}
                  tintColor="#ffffff"
                />
              </View>
            )}
          </View>

          <View style={styles.valuesContainer}>
            <ThemedText type="subtitle" style={styles.boldText}>
              {weight ? `${weight}kg` : 'BW'}
            </ThemedText>
            <ThemedText type="small" style={styles.timesText}>
              ×
            </ThemedText>
            <ThemedText type="subtitle" style={[styles.boldText, { color: '#be185d' }]}>
              {reps}
            </ThemedText>
            {rpe && (
              <View style={[styles.rpeBadge, { backgroundColor: themeColors.backgroundSelected }]}>
                <ThemedText type="code" style={styles.rpeText}>
                  @{rpe}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  if (variant === 'list') {
    return (
      <View style={styles.listContainer}>
        <View style={styles.leftRow}>
          <View style={styles.badgeWrapper}>
            <View
              style={[
                styles.indexBadge,
                { backgroundColor: prType ? 'rgba(190,24,93,0.15)' : 'rgba(190,24,93,0.08)' },
              ]}
            >
              {prType ? (
                <SymbolView
                  name={{ ios: 'trophy.fill', android: 'emoji_events', web: 'emoji_events' }}
                  size={12}
                  tintColor="#be185d"
                />
              ) : (
                <ThemedText type="smallBold" style={{ fontSize: 11, color: themeColors.text }}>
                  {displayIndex}
                </ThemedText>
              )}
            </View>
            {isAdHoc && (
              <View style={styles.adHocDot}>
                <SymbolView
                  name={{ ios: 'bolt.fill', android: 'flash_on', web: 'flash_on' }}
                  size={6}
                  tintColor="#ffffff"
                />
              </View>
            )}
          </View>

          <View style={styles.listValues}>
            <ThemedText type="smallBold" style={styles.semiBoldText}>
              {weight ? `${weight}kg` : 'BW'}
            </ThemedText>
            <ThemedText type="small" style={{ color: 'rgba(128,128,128,0.6)' }}>
              ×
            </ThemedText>
            <ThemedText type="smallBold" style={styles.semiBoldText}>
              {reps}
            </ThemedText>
            {rpe && (
              <View style={[styles.rpeBadgeCompact, { backgroundColor: themeColors.backgroundSelected }]}>
                <ThemedText type="code" style={styles.rpeTextCompact}>
                  @{rpe}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  // Default compact layout
  return (
    <View style={[styles.compactContainer, { backgroundColor: 'rgba(255,255,255,0.03)' }]}>
      <View style={styles.leftRow}>
        <ThemedText type="small" style={styles.indexText}>
          {displayIndex}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.compactBoldText}>
          {weight ? `${weight}kg` : 'BW'}
        </ThemedText>
        <ThemedText type="small" style={{ color: 'rgba(128,128,128,0.4)' }}>
          ×
        </ThemedText>
        <ThemedText type="smallBold" style={[styles.compactBoldText, { color: '#be185d' }]}>
          {reps}
        </ThemedText>
        {rpe && (
          <ThemedText type="code" style={styles.compactRpeText}>
            @{rpe}
          </ThemedText>
        )}
        {isAdHoc && (
          <SymbolView
            name={{ ios: 'bolt.fill', android: 'flash_on', web: 'flash_on' }}
            size={10}
            tintColor="#eab308"
            style={{ marginLeft: 4 }}
          />
        )}
      </View>
      {prType && (
        <SymbolView
          name={{ ios: 'trophy.fill', android: 'emoji_events', web: 'emoji_events' }}
          size={12}
          tintColor="#be185d"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  featuredContainer: {
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  badgeWrapper: {
    position: 'relative',
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adHocDot: {
    position: 'absolute',
    right: -1,
    top: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#eab308',
    borderWidth: 1.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valuesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  boldText: {
    fontSize: 20,
    fontWeight: '700',
  },
  timesText: {
    color: 'rgba(128,128,128,0.4)',
    marginHorizontal: 2,
  },
  rpeBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 8,
    alignSelf: 'center',
  },
  rpeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  semiBoldText: {
    fontSize: 15,
    fontWeight: '600',
  },
  rpeBadgeCompact: {
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  rpeTextCompact: {
    fontSize: 9,
    fontWeight: '700',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
  },
  indexText: {
    fontSize: 12,
    color: 'rgba(128,128,128,0.4)',
    width: 16,
  },
  compactBoldText: {
    fontSize: 14,
    fontWeight: '700',
  },
  compactRpeText: {
    fontSize: 10,
    color: 'rgba(128,128,128,0.4)',
    fontWeight: '700',
    marginLeft: Spacing.one,
  },
});
