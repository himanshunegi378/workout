import React from 'react';
import { StyleSheet, View, Pressable, useColorScheme } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { BottomDrawer } from '@/components/ui/bottom-drawer';
import { Button } from '@/components/ui/button';
import { NumberStepper } from '@/components/ui/number-stepper';
import { RPESelector } from '@/components/ui/rpe-selector';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

interface LogSetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  weight: string;
  setWeight: (w: string) => void;
  reps: string;
  setReps: (r: string) => void;
  rpe: number | null;
  setRpe: (r: number | null) => void;
  onSave: () => void;
  onDelete?: () => void;
  isSaving: boolean;
  isDeleting?: boolean;
  isEdit?: boolean;
  previousLog?: { weight: number | null; reps: number } | null;
}

export function LogSetDrawer({
  isOpen,
  onClose,
  exerciseName,
  weight,
  setWeight,
  reps,
  setReps,
  rpe,
  setRpe,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  isEdit,
  previousLog,
}: LogSetDrawerProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const fillPrevious = () => {
    if (previousLog) {
      if (previousLog.weight !== null) setWeight(previousLog.weight.toString());
      setReps(previousLog.reps.toString());
    }
  };

  const weightNum = parseFloat(weight) || 0;
  const repsNum = parseInt(reps) || 0;

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title={exerciseName}>
      <View style={styles.container}>
        {/* Best Previous Panel */}
        {previousLog && (
          <Pressable
            onPress={fillPrevious}
            style={({ pressed }) => [
              styles.previousCard,
              { backgroundColor: themeColors.backgroundSelected },
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.previousLeft}>
              <SymbolView
                name={{ ios: 'clock.arrow.circlepath', android: 'history', web: 'history' }}
                size={16}
                tintColor="#be185d"
              />
              <ThemedText type="smallBold" style={{ fontSize: 13, color: themeColors.text }}>
                Best Previous
              </ThemedText>
            </View>
            <ThemedText type="smallBold" style={styles.previousRight}>
              {previousLog.weight ? `${previousLog.weight}kg × ` : ''}
              {previousLog.reps} reps
            </ThemedText>
          </Pressable>
        )}

        {/* Inputs */}
        <View style={styles.stepperRow}>
          <NumberStepper
            label="Weight"
            value={weightNum}
            onChange={(val) => setWeight(val.toString())}
            min={0}
            max={500}
            step={2.5}
            suffix="kg"
            stepOptions={[2.5, 5]}
          />
          <NumberStepper
            label="Reps"
            value={repsNum}
            onChange={(val) => setReps(val.toString())}
            min={0}
            max={100}
            step={1}
          />
        </View>

        {/* RPE Selector */}
        <View style={styles.rpeWrapper}>
          <RPESelector value={rpe} onChange={setRpe} />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            onPress={onSave}
            disabled={isSaving || (isDeleting ?? false) || !reps}
            loading={isSaving}
          >
            {isEdit ? 'Update Set' : 'Save Set'}
          </Button>

          {isEdit && onDelete && (
            <Button
              onPress={onDelete}
              variant="danger"
              disabled={isSaving || (isDeleting ?? false)}
              loading={isDeleting}
            >
              Delete Set
            </Button>
          )}
        </View>
      </View>
    </BottomDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
    paddingBottom: Spacing.four,
  },
  previousCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
  },
  previousLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  previousRight: {
    fontSize: 14,
    color: '#be185d',
  },
  stepperRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  rpeWrapper: {
    marginVertical: Spacing.one,
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  pressed: {
    opacity: 0.8,
  },
});
