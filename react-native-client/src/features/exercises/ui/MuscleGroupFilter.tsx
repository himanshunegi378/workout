import React from 'react';
import { ScrollView, StyleSheet, Pressable, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { MuscleGroup } from '../types';
import { muscleColorMap } from './MuscleGroupSelector';

const ALL_GROUPS = ['All', 'Abs', 'Back', 'Biceps', 'Cardio', 'Chest', 'Forearms', 'Legs', 'Shoulders', 'Triceps'] as const;
type Filter = (typeof ALL_GROUPS)[number];

interface MuscleGroupFilterProps {
  selected: Filter;
  onChange: (f: Filter) => void;
}

export function MuscleGroupFilter({ selected, onChange }: MuscleGroupFilterProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {ALL_GROUPS.map((group) => {
        const isActive = selected === group;
        const groupColor = group !== 'All' ? muscleColorMap[group as MuscleGroup] : '#be185d';

        return (
          <Pressable
            key={group}
            onPress={() => onChange(group)}
            style={({ pressed }) => [
              styles.button,
              {
                borderColor: isActive ? 'transparent' : (scheme === 'dark' ? '#333' : '#ddd'),
                backgroundColor: isActive 
                  ? (group === 'All' ? 'rgba(190, 24, 93, 0.15)' : groupColor)
                  : 'transparent',
              },
              pressed && styles.pressed,
            ]}
          >
            <ThemedText
              type="smallBold"
              style={[
                styles.buttonText,
                {
                  color: isActive
                    ? (group === 'All' ? '#be185d' : '#ffffff')
                    : themeColors.textSecondary,
                },
              ]}
            >
              {group}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  button: {
    paddingHorizontal: Spacing.three + 2,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
