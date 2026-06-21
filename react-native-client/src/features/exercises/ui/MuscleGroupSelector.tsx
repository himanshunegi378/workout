import React, { useState } from 'react';
import { StyleSheet, View, Pressable, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { MuscleGroup } from '../types';

export const muscleGroups: MuscleGroup[] = [
  'Abs',
  'Back',
  'Biceps',
  'Cardio',
  'Chest',
  'Forearms',
  'Legs',
  'Shoulders',
  'Triceps',
];

export const muscleColorMap: Record<MuscleGroup, string> = {
  Abs: '#7c3aed',
  Back: '#0f766e',
  Biceps: '#c2410c',
  Cardio: '#0369a1',
  Chest: '#be123c',
  Forearms: '#b45309',
  Legs: '#92400e',
  Shoulders: '#4f46e5',
  Triceps: '#e11d48',
};

interface MuscleGroupSelectorProps {
  value?: MuscleGroup | null;
  onChange: (mg: MuscleGroup) => void;
}

export function MuscleGroupSelector({
  value,
  onChange,
}: MuscleGroupSelectorProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];
  
  const [selected, setSelected] = useState<MuscleGroup | null>(value ?? null);

  const handleSelect = (mg: MuscleGroup) => {
    setSelected(mg);
    onChange(mg);
  };

  return (
    <View style={styles.container}>
      {muscleGroups.map((mg) => {
        const isSelected = selected === mg;
        const groupColor = muscleColorMap[mg];

        return (
          <Pressable
            key={mg}
            onPress={() => handleSelect(mg)}
            style={({ pressed }) => [
              styles.button,
              {
                borderColor: isSelected ? 'transparent' : (scheme === 'dark' ? '#333' : '#ddd'),
                backgroundColor: isSelected ? groupColor : (scheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
              },
              pressed && styles.pressed,
            ]}
          >
            <ThemedText
              type="smallBold"
              style={[
                styles.buttonText,
                { color: isSelected ? '#ffffff' : themeColors.text },
              ]}
            >
              {mg}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  button: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 13,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
