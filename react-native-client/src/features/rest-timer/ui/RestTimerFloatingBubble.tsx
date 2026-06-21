import React from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, BottomTabInset } from '@/constants/theme';
import { useRestTimer } from '../hooks/RestTimerContext';
import { formatTime } from '../api/formatTime';

/**
 * Minimized floating pill displaying the countdown. Clicking this pill expands
 * the overlay, allowing the user to manage their rest duration.
 */
export function RestTimerFloatingBubble() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { isActive, isMinimized, timeLeft, openTimer } = useRestTimer();

  if (!isActive || !isMinimized) return null;

  return (
    <TouchableOpacity
      onPress={openTimer}
      style={[
        styles.bubble,
        {
          backgroundColor: themeColors.backgroundElement,
          borderColor: scheme === 'dark' ? '#333' : '#ddd',
        },
      ]}
      activeOpacity={0.8}
    >
      <SymbolView
        name={{ ios: 'timer', android: 'timer', web: 'timer' }}
        size={14}
        tintColor="#be185d"
        style={styles.icon}
      />
      <ThemedText type="smallBold" style={styles.text}>
        {formatTime(timeLeft)}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    bottom: BottomTabInset + Spacing.three,
    right: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 998,
  },
  icon: {
    marginRight: Spacing.one,
  },
  text: {
    fontVariant: ['tabular-nums'],
  },
});
