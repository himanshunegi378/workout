import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomDrawer } from '@/components/ui/bottom-drawer';
import { Button } from '@/components/ui/button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

import {
  useExercises,
  useCreateExercise,
  MuscleGroupFilter,
  MuscleGroupSelector,
  MuscleGroup,
  muscleColorMap,
} from '@/features/exercises';

type FilterType = 'All' | MuscleGroup;

export default function ExercisesScreen() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { data: exercises = [], isLoading, isError, refetch } = useExercises();
  const createExercise = useCreateExercise();

  // Search & Filter state
  const [filter, setFilter] = useState<FilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Custom Exercise Drawer state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDesc, setNewExerciseDesc] = useState('');
  const [newExerciseGroup, setNewExerciseGroup] = useState<MuscleGroup | null>(null);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchGroup = filter === 'All' || ex.muscle_group === filter;
      const matchQuery = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGroup && matchQuery;
    });
  }, [exercises, filter, searchQuery]);

  const canSaveCustom = newExerciseName.trim().length > 0 && newExerciseGroup !== null;

  const handleSaveCustom = () => {
    if (!canSaveCustom) return;

    createExercise.mutate(
      {
        name: newExerciseName.trim(),
        description: newExerciseDesc.trim() || null,
        muscle_group: newExerciseGroup,
      },
      {
        onSuccess: () => {
          setNewExerciseName('');
          setNewExerciseDesc('');
          setNewExerciseGroup(null);
          setIsCreateOpen(false);
        },
      }
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Row */}
          <View style={styles.header}>
            <View>
              <ThemedText type="small" style={styles.eyebrow}>
                Library Overview
              </ThemedText>
              <ThemedText type="subtitle" style={styles.title}>
                Movement Catalog
              </ThemedText>
            </View>
            <Pressable
              onPress={() => setIsCreateOpen(true)}
              style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
            >
              <SymbolView
                name={{ ios: 'plus.circle.fill', android: 'add_circle', web: 'add' }}
                size={18}
                tintColor="#be185d"
              />
              <ThemedText type="smallBold" style={styles.addText}>
                New Exercise
              </ThemedText>
            </Pressable>
          </View>

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

          {/* Muscle group scrollable horizontal ribbon filter */}
          <MuscleGroupFilter selected={filter} onChange={setFilter} />

          {/* Content state views */}
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color="#be185d" size="large" />
              <ThemedText type="small" style={{ color: themeColors.textSecondary, marginTop: Spacing.two }}>
                Loading exercise library...
              </ThemedText>
            </View>
          ) : isError ? (
            <View style={styles.errorContainer}>
              <SymbolView
                name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}
                size={36}
                tintColor="#ef4444"
              />
              <ThemedText type="smallBold" style={{ marginTop: Spacing.two }}>
                Failed to load exercises
              </ThemedText>
              <Button onPress={() => refetch()} variant="secondary" style={{ marginTop: Spacing.three }}>
                Try Again
              </Button>
            </View>
          ) : filteredExercises.length === 0 ? (
            <View style={styles.emptyContainer}>
              <SymbolView
                name={{ ios: 'dumbbell.fill', android: 'fitness_center', web: 'fitness_center' }}
                size={40}
                tintColor={themeColors.textSecondary}
              />
              <ThemedText type="smallBold" style={{ fontSize: 16 }}>
                No exercises found
              </ThemedText>
              <ThemedText type="small" style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>
                {searchQuery ? `No results for "${searchQuery}"` : 'Your exercise list is empty.'}
              </ThemedText>
            </View>
          ) : (
            <View style={styles.listGrid}>
              {filteredExercises.map((ex) => {
                const groupColor = muscleColorMap[ex.muscle_group as MuscleGroup] || '#888';

                return (
                  <View
                    key={ex.id}
                    style={[styles.card, { backgroundColor: themeColors.backgroundSelected }]}
                  >
                    <View style={styles.cardHeader}>
                      <View style={[styles.cardColorBar, { backgroundColor: groupColor }]} />
                      <View style={styles.cardHeaderText}>
                        <ThemedText type="smallBold" style={{ fontSize: 15 }}>
                          {ex.name}
                        </ThemedText>
                        <ThemedText type="small" style={[styles.cardGroup, { color: themeColors.textSecondary }]}>
                          {ex.muscle_group}
                        </ThemedText>
                      </View>
                    </View>
                    {ex.description && (
                      <ThemedText
                        type="small"
                        style={[styles.cardDesc, { color: themeColors.textSecondary }]}
                        numberOfLines={2}
                      >
                        {ex.description}
                      </ThemedText>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Drawer: Custom Exercise Creator */}
      <BottomDrawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New Exercise">
        <ScrollView contentContainerStyle={styles.drawerScroll} keyboardShouldPersistTaps="handled">
          <View style={styles.drawerGroup}>
            <ThemedText type="smallBold" style={styles.drawerLabel}>
              Exercise Name
            </ThemedText>
            <View style={[styles.drawerInputWrapper, { backgroundColor: themeColors.backgroundSelected }]}>
              <TextInput
                placeholder="e.g. Barbell Bench Press"
                placeholderTextColor="rgba(128,128,128,0.5)"
                value={newExerciseName}
                onChangeText={setNewExerciseName}
                style={[styles.drawerInput, { color: themeColors.text }]}
              />
            </View>
          </View>

          <View style={styles.drawerGroup}>
            <ThemedText type="smallBold" style={styles.drawerLabel}>
              Description (optional)
            </ThemedText>
            <View
              style={[
                styles.drawerInputWrapper,
                styles.drawerTextareaWrapper,
                { backgroundColor: themeColors.backgroundSelected },
              ]}
            >
              <TextInput
                placeholder="Compound chest press..."
                placeholderTextColor="rgba(128,128,128,0.5)"
                value={newExerciseDesc}
                onChangeText={setNewExerciseDesc}
                multiline
                numberOfLines={3}
                style={[styles.drawerInput, styles.drawerTextarea, { color: themeColors.text }]}
              />
            </View>
          </View>

          <View style={styles.drawerGroup}>
            <ThemedText type="smallBold" style={styles.drawerLabel}>
              Target Muscle Group
            </ThemedText>
            <MuscleGroupSelector value={newExerciseGroup} onChange={setNewExerciseGroup} />
          </View>

          <View style={styles.drawerFooter}>
            {createExercise.isError && (
              <View style={styles.drawerErrorBox}>
                <ThemedText type="small" style={styles.drawerErrorText}>
                  {createExercise.error instanceof Error ? createExercise.error.message : 'Save failed'}
                </ThemedText>
              </View>
            )}

            <Button
              onPress={handleSaveCustom}
              disabled={!canSaveCustom || createExercise.isPending}
              loading={createExercise.isPending}
            >
              Save Exercise
            </Button>
          </View>
        </ScrollView>
      </BottomDrawer>
    </ThemedView>
  );
}

// Local duplicate declaration of Colors for inline safety
const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  scrollContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  eyebrow: {
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1.5,
    borderColor: '#333',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 16,
  },
  addText: {
    color: '#be185d',
    fontSize: 13,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    height: 44,
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  loaderContainer: {
    paddingVertical: Spacing.six,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    paddingVertical: Spacing.five,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
  },
  emptyContainer: {
    paddingVertical: Spacing.six,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emptyDesc: {
    textAlign: 'center',
    fontSize: 13,
  },
  listGrid: {
    flexDirection: 'column',
    gap: Spacing.three,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.three + 2,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  cardColorBar: {
    width: 3.5,
    height: 24,
    borderRadius: 1.75,
  },
  cardHeaderText: {
    flexDirection: 'column',
  },
  cardGroup: {
    fontSize: 11,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    paddingLeft: Spacing.one,
  },
  drawerScroll: {
    gap: Spacing.four,
    paddingBottom: Spacing.five,
  },
  drawerGroup: {
    flexDirection: 'column',
    gap: Spacing.one + 2,
  },
  drawerLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#888',
    minHeight: 20,
  },
  drawerInputWrapper: {
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  drawerTextareaWrapper: {
    height: 96,
    justifyContent: 'flex-start',
    paddingVertical: Spacing.two,
  },
  drawerInput: {
    fontSize: 15,
    paddingVertical: 4,
  },
  drawerTextarea: {
    textAlignVertical: 'top',
  },
  drawerFooter: {
    marginTop: Spacing.two,
    gap: Spacing.three,
  },
  drawerErrorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  drawerErrorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 13,
  },
  pressed: {
    opacity: 0.8,
  },
});
