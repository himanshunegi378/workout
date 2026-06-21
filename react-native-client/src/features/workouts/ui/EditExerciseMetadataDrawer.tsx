import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  useColorScheme,
} from 'react-native';

import { BottomDrawer } from '@/components/ui/bottom-drawer';
import { Button } from '@/components/ui/button';
import { NumberStepper } from '@/components/ui/number-stepper';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useEditExerciseMetadata } from '@/features/exercises';

interface EditExerciseMetadataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  programmeId: string;
  workoutId: string;
  metadataId: string;
  exerciseName: string;
  initialSets: number;
  initialReps: number;
  initialRest: number;
  initialTempo: string;
}

export function EditExerciseMetadataDrawer({
  isOpen,
  onClose,
  programmeId,
  workoutId,
  metadataId,
  exerciseName,
  initialSets,
  initialReps,
  initialRest,
  initialTempo,
}: EditExerciseMetadataDrawerProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const [sets, setSets] = useState(initialSets);
  const [reps, setReps] = useState(initialReps);
  const [rest, setRest] = useState(initialRest);
  const [tempo, setTempo] = useState(initialTempo);

  const { mutate: editMetadata, isPending, error: mutationError } = useEditExerciseMetadata({
    programmeId,
    workoutId,
    metadataId,
  });

  useEffect(() => {
    if (isOpen) {
      setSets(initialSets);
      setReps(initialReps);
      setRest(initialRest);
      setTempo(initialTempo);
    }
  }, [isOpen, initialSets, initialReps, initialRest, initialTempo]);

  const handleSave = () => {
    editMetadata(
      {
        sets_min: sets,
        sets_max: sets,
        reps_min: reps,
        reps_max: reps,
        rest_min: rest,
        rest_max: rest,
        tempo: tempo.trim(),
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title={`Edit ${exerciseName}`}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
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
            onPress={handleSave}
            disabled={isPending}
            loading={isPending}
          >
            Save Changes
          </Button>
        </View>
      </ScrollView>
    </BottomDrawer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    gap: Spacing.four,
    paddingBottom: Spacing.six,
  },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#888',
    minHeight: 20,
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
});
