import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  useColorScheme,
} from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

interface RPESelectorProps {
  value: number | null;
  onChange: (rpe: number | null) => void;
  label?: string;
}

const RPE_OPTIONS = [5, 6, 7, 8, 9, 10];

export function RPESelector({
  value,
  onChange,
  label = 'RPE (Intensity)',
}: RPESelectorProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const getRpeText = (rpe: number) => {
    if (rpe === 10) return 'Max';
    if (rpe >= 9) return 'Hard';
    if (rpe >= 7) return 'Mod';
    return 'Easy';
  };

  const getIntensityLabel = (val: number) => {
    return val === 10 ? 'Max Effort' : `${val}/10`;
  };

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <SymbolView
            name={{ ios: 'gauge.medium', android: 'speed', web: 'speed' }}
            size={14}
            tintColor="#be185d"
          />
          <ThemedText type="smallBold" style={styles.labelText}>
            {label}
          </ThemedText>
        </View>
        {value !== null && (
          <View style={styles.badge}>
            <ThemedText type="code" style={styles.badgeText}>
              Intensity: {getIntensityLabel(value)}
            </ThemedText>
          </View>
        )}
      </View>

      {/* RPE Buttons ScrollView */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {RPE_OPTIONS.map((rpe) => {
          const isSelected = value === rpe;
          return (
            <Pressable
              key={rpe}
              onPress={() => onChange(isSelected ? null : rpe)}
              style={({ pressed }) => [
                styles.rpeButton,
                { backgroundColor: isSelected ? '#be185d' : themeColors.backgroundSelected },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText
                type="default"
                style={[
                  styles.rpeValText,
                  { color: isSelected ? '#ffffff' : themeColors.text },
                ]}
              >
                {rpe}
              </ThemedText>
              <ThemedText
                type="code"
                style={[
                  styles.rpeDescText,
                  { color: isSelected ? 'rgba(255,255,255,0.7)' : themeColors.textSecondary },
                ]}
              >
                {getRpeText(rpe)}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.one,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  labelText: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#888',
  },
  badge: {
    backgroundColor: 'rgba(190, 24, 93, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(190, 24, 93, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 9,
    color: '#be185d',
    fontWeight: '700',
  },
  scrollContainer: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  rpeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rpeValText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  rpeDescText: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 1,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.9 }],
  },
});
