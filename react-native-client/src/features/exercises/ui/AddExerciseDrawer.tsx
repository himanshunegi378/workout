import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { SymbolView } from 'expo-symbols';

import { BottomDrawer } from '@/components/ui/bottom-drawer';
import { Button } from '@/components/ui/button';
import { NumberStepper } from '@/components/ui/number-stepper';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useExercises } from '../api/query-hooks/use-exercises';
import { useAddExerciseToWorkout } from '../api/mutation-hooks/use-add-exercise-to-workout';
import { MuscleGroup } from '../types';
import { ExerciseSelectDrawer } from './ExerciseSelectDrawer';
import { muscleColorMap } from './MuscleGroupSelector';

interface AddExerciseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  programmeId: string;
  workoutId: string;
}

export function AddExerciseDrawer({
  isOpen,
  onClose,
  programmeId,
  workoutId,
}: AddExerciseDrawerProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { data: exercises = [] } = useExercises();

  const [exerciseId, setExerciseId] = useState('');
  const [isSelectDrawerOpen, setIsSelectDrawerOpen] = useState(false);

  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [rest, setRest] = useState(60);
  const [tempo, setTempo] = useState('2-0-1-0');

  const selectedExercise = exercises.find((ex) => ex.id === exerciseId);

  const { mutate: addExercise, isPending, error: mutationError } = useAddExerciseToWorkout();

  const canSubmit = exerciseId !== '' && sets > 0 && reps > 0 && rest >= 0 && tempo.trim() !== '';

  const handleSubmit = () => {
    if (!canSubmit) return;

    addExercise(
      {
        programmeId,
        workoutId,
        data: {
          exercise_id: exerciseId,
          sets_min: sets,
          sets_max: sets,
          reps_min: reps,
          reps_max: reps,
          rest_min: rest,
          rest_max: rest,
          tempo: tempo.trim(),
        },
      },
      {
        onSuccess: () => {
          setExerciseId('');
          setSets(3);
          setReps(10);
          setRest(60);
          setTempo('2-0-1-0');
          onClose();
        },
      }
    );
  };

  return (
    <>
      <BottomDrawer isOpen={isOpen} onClose={onClose} title="Add Exercise">
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          {/* Exercise select button */}
          <View style={styles.formGroup}>
            <ThemedText type="smallBold" style={styles.label}>
              Exercise
            </ThemedText>
            <Pressable
              onPress={() => setIsSelectDrawerOpen(true)}
              style={({ pressed }) => [
                styles.selectButton,
                { backgroundColor: themeColors.backgroundSelected },
                pressed && styles.pressed,
              ]}
            >
              {selectedExercise ? (
                <View style={styles.selectedContainer}>
                  <View
                    style={[
                      styles.colorBar,
                      { backgroundColor: muscleColorMap[selectedExercise.muscle_group as MuscleGroup] || '#888' },
                    ]}
                  />
                  <View style={styles.selectedInfo}>
                    <ThemedText type="smallBold" style={styles.selectedName}>
                      {selectedExercise.name}
                    </ThemedText>
                    <ThemedText type="small" style={[styles.selectedGroup, { color: themeColors.textSecondary }]}>
                      {selectedExercise.muscle_group}
                    </ThemedText>
                  </View>
                </View>
              ) : (
                <ThemedText type="default" style={{ color: 'rgba(128,128,128,0.5)' }}>
                  Select an exercise...
                </ThemedText>
              )}
              <SymbolView
                name={{ ios: 'chevron.down', android: 'keyboard_arrow_down', web: 'keyboard_arrow_down' }}
                size={20}
                tintColor={themeColors.textSecondary}
              />
            </Pressable>
          </View>

          {/* Sets and reps steppers */}
          <View style={styles.row}>
            <NumberStepper label="Sets" value={sets} onChange={setSets} min={1} max={20} />
            <NumberStepper label="Reps" value={reps} onChange={setReps} min={1} max={100} />
          </View>

          {/* Rest stepper and tempo input */}
          <View style={styles.row}>
            <NumberStepper label="Rest" value={rest} onChange={setRest} min={0} max={600} step={10} suffix="s" />
            <View style={styles.formGroupHalf}>
              <ThemedText type="smallBold" style={styles.label}>
                Tempo
              </ThemedText>
              <View style={[styles.inputWrapper, { backgroundColor: themeColors.backgroundSelected }]}>
                <TextInput
                  placeholder="e.g. 2-0-1-0"
                  placeholderTextColor="rgba(128,128,128,0.5)"
                  value={tempo}
                  onChangeText={setTempo}
                  style={[styles.textInput, { color: themeColors.text }]}
                />
              </View>
            </View>
          </View>

          {/* Save panel */}
          <View style={styles.footerPanel}>
            {mutationError && (
              <View style={styles.errorBox}>
                <ThemedText type="smallBold" style={styles.errorText}>
                  {mutationError instanceof Error ? mutationError.message : 'Something went wrong'}
                </ThemedText>
              </View>
            )}

            <Button
              onPress={handleSubmit}
              disabled={!canSubmit || isPending}
              loading={isPending}
            >
              Add to Workout
            </Button>
          </View>
        </ScrollView>
      </BottomDrawer>

      <ExerciseSelectDrawer
        isOpen={isSelectDrawerOpen}
        onClose={() => setIsSelectDrawerOpen(false)}
        exercises={exercises}
        selectedId={exerciseId}
        onSelect={(id) => setExerciseId(id)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    gap: Spacing.four,
    paddingBottom: Spacing.six,
  },
  formGroup: {
    flexDirection: 'column',
    gap: Spacing.one + 2,
  },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#888',
    minHeight: 20,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: 16,
    height: 52,
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    flex: 1,
  },
  colorBar: {
    width: 3,
    height: 24,
    borderRadius: 1.5,
  },
  selectedInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  selectedName: {
    fontSize: 15,
    lineHeight: 18,
  },
  selectedGroup: {
    fontSize: 11,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  formGroupHalf: {
    flex: 1,
    flexDirection: 'column',
    gap: Spacing.one + 2,
  },
  inputWrapper: {
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 4,
  },
  footerPanel: {
    marginTop: Spacing.two,
    gap: Spacing.three,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 13,
  },
  pressed: {
    opacity: 0.8,
  },
});
