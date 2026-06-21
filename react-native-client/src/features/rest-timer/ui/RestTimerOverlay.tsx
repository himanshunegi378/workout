import React from 'react';
import { StyleSheet, View, TouchableOpacity, useColorScheme } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Colors, Spacing, BottomTabInset } from '@/constants/theme';
import { useRestTimer } from '../hooks/RestTimerContext';
import { formatTime } from '../api/formatTime';

/**
 * A floating control panel that renders absolute at the bottom of the viewport
 * above the navigation bar. This ensures the rest timer remains interactive
 * without blocking the user's ability to browse or log other sets.
 */
export function RestTimerOverlay() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const {
    isActive,
    timeLeft,
    isRunning,
    isMinimized,
    pauseTimer,
    resumeTimer,
    addTime,
    stopTimer,
    minimizeTimer,
  } = useRestTimer();

  if (!isActive || isMinimized) return null;

  const isComplete = timeLeft === 0;

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <ThemedView type="backgroundElement" style={styles.card}>
        {/* Header Title and Minimize */}
        <View style={styles.header}>
          <ThemedText type="small" style={styles.eyebrow}>
            Rest Timer
          </ThemedText>
          <TouchableOpacity
            onPress={minimizeTimer}
            style={styles.minimizeBtn}
            hitSlop={12}
            activeOpacity={0.7}
          >
            <SymbolView
              name={{ ios: 'chevron.down', android: 'keyboard_arrow_down', web: 'expand_more' }}
              size={20}
              tintColor={themeColors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Counter controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            onPress={() => addTime(-30)}
            style={[styles.adjustBtn, { backgroundColor: themeColors.backgroundSelected }]}
            activeOpacity={0.7}
          >
            <SymbolView
              name={{ ios: 'minus', android: 'remove', web: 'remove' }}
              size={16}
              tintColor={themeColors.text}
            />
          </TouchableOpacity>

          <View style={styles.timerDisplay}>
            <ThemedText
              style={[
                styles.timerText,
                isComplete && styles.timerComplete,
                { color: isComplete ? '#be185d' : themeColors.text },
              ]}
            >
              {formatTime(timeLeft)}
            </ThemedText>
          </View>

          <TouchableOpacity
            onPress={() => addTime(30)}
            style={[styles.adjustBtn, { backgroundColor: themeColors.backgroundSelected }]}
            activeOpacity={0.7}
          >
            <SymbolView
              name={{ ios: 'plus', android: 'add', web: 'add' }}
              size={16}
              tintColor={themeColors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Actions grid */}
        <View style={styles.actionsGrid}>
          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            onPress={isRunning ? pauseTimer : resumeTimer}
            style={styles.actionBtn}
          >
            <View style={styles.btnContent}>
              <SymbolView
                name={
                  isRunning
                    ? { ios: 'pause.fill', android: 'pause', web: 'pause' }
                    : { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }
                }
                size={14}
                tintColor={isRunning ? themeColors.text : '#ffffff'}
              />
              <ThemedText
                type="smallBold"
                style={{ color: isRunning ? themeColors.text : '#ffffff', marginLeft: Spacing.one }}
              >
                {isRunning ? 'Pause' : 'Resume'}
              </ThemedText>
            </View>
          </Button>

          <Button variant="danger" onPress={stopTimer} style={styles.actionBtn}>
            <View style={styles.btnContent}>
              <SymbolView
                name={{ ios: 'forward.fill', android: 'skip_next', web: 'skip_next' }}
                size={14}
                tintColor="#ef4444"
              />
              <ThemedText type="smallBold" style={{ color: '#ef4444', marginLeft: Spacing.one }}>
                Skip
              </ThemedText>
            </View>
          </Button>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BottomTabInset + Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    zIndex: 999,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: Spacing.three,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
  },
  minimizeBtn: {
    padding: Spacing.one,
    borderRadius: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
  },
  adjustBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  timerComplete: {
    // Opacity animation simulated visually when timer finishes
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
