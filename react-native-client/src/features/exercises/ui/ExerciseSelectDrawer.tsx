import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SymbolView } from 'expo-symbols';

import { BottomDrawer } from '@/components/ui/bottom-drawer';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { Exercise, MuscleGroup } from '../types';
import { muscleColorMap } from './MuscleGroupSelector';

interface ExerciseSelectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  onSelect: (exerciseId: string) => void;
  selectedId?: string;
}

export function ExerciseSelectDrawer({
  isOpen,
  onClose,
  exercises,
  onSelect,
  selectedId,
}: ExerciseSelectDrawerProps) {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return exercises;
    const query = searchQuery.toLowerCase();
    return exercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(query) ||
        ex.muscle_group.toLowerCase().includes(query)
    );
  }, [exercises, searchQuery]);

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title="Select Exercise">
      <View style={styles.container}>
        {/* Search bar */}
        <View style={[styles.searchRow, { backgroundColor: themeColors.backgroundSelected }]}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={16}
            tintColor={themeColors.textSecondary}
          />
          <TextInput
            placeholder="Search exercises..."
            placeholderTextColor="rgba(128,128,128,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: themeColors.text }]}
          />
        </View>

        {/* Scrollable list */}
        <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
          {filteredExercises.length === 0 ? (
            <View style={styles.emptyState}>
              <SymbolView
                name={{ ios: 'dumbbell.fill', android: 'fitness_center', web: 'fitness_center' }}
                size={36}
                tintColor={themeColors.textSecondary}
              />
              <ThemedText type="smallBold" style={styles.emptyTitle}>
                No exercises found
              </ThemedText>
              <ThemedText type="small" style={styles.emptyDesc}>
                Try a different search query.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.listContent}>
              {filteredExercises.map((ex) => {
                const isSelected = selectedId === ex.id;
                const groupColor = muscleColorMap[ex.muscle_group as MuscleGroup] || '#888';

                return (
                  <Pressable
                    key={ex.id}
                    onPress={() => {
                      onSelect(ex.id);
                      onClose();
                    }}
                    style={({ pressed }) => [
                      styles.listItem,
                      {
                        backgroundColor: isSelected 
                          ? 'rgba(190, 24, 93, 0.08)' 
                          : 'transparent',
                      },
                      pressed && styles.pressed,
                    ]}
                  >
                    {/* Left vertical color indicator */}
                    <View style={[styles.colorBar, { backgroundColor: groupColor }]} />
                    
                    <View style={styles.itemTextContainer}>
                      <ThemedText type="smallBold" style={{ fontSize: 15 }}>
                        {ex.name}
                      </ThemedText>
                      <ThemedText type="small" style={[styles.groupText, { color: themeColors.textSecondary }]}>
                        {ex.muscle_group}
                      </ThemedText>
                    </View>

                    {/* Checkmark indicator */}
                    <View
                      style={[
                        styles.indicatorCircle,
                        { borderColor: isSelected ? '#be185d' : 'rgba(128,128,128,0.3)' },
                      ]}
                    >
                      {isSelected && <View style={styles.indicatorDot} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </BottomDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    gap: Spacing.three,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    height: 40,
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    gap: Spacing.one,
    paddingBottom: Spacing.four,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  colorBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  itemTextContainer: {
    flex: 1,
    gap: 2,
  },
  groupText: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
  indicatorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#be185d',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  emptyTitle: {
    fontSize: 16,
    marginTop: Spacing.two,
  },
  emptyDesc: {
    color: '#666',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
