import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useProgramme } from '@/features/programmes';
import { activeSessionStore } from '@/features/workouts';
import { Button } from '@/components/ui/button';

export default function ProgrammeDetailsScreen() {
  const router = useRouter();
  const { programmeId } = useLocalSearchParams<{ programmeId: string }>();
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { data: programme, isLoading, isError, refetch } = useProgramme(programmeId || '');

  const handleStartWorkout = (workoutId: string, workoutName: string) => {
    if (!programmeId) return;
    activeSessionStore.startSession(programmeId, workoutId, workoutName);
    router.replace({
      pathname: '/workout-session',
      params: { programmeId, workoutId },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Row */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <SymbolView
                name={{ ios: 'chevron.left', android: 'arrow_back' }}
                size={22}
                tintColor={themeColors.text}
              />
            </Pressable>
            <View style={{ flex: 1 }}>
              <ThemedText type="small" style={styles.eyebrow}>
                Programme Detail
              </ThemedText>
              <ThemedText type="subtitle" style={styles.title}>
                {programme?.name || 'Loading Protocol...'}
              </ThemedText>
            </View>
          </View>

          {/* Content state views */}
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color="#be185d" size="large" />
              <ThemedText type="small" style={{ color: themeColors.textSecondary, marginTop: Spacing.two }}>
                Loading programme details...
              </ThemedText>
            </View>
          ) : isError || !programme ? (
            <View style={styles.errorContainer}>
              <SymbolView
                name={{ ios: 'exclamationmark.triangle.fill', android: 'warning' }}
                size={36}
                tintColor="#ef4444"
              />
              <ThemedText type="smallBold" style={{ marginTop: Spacing.two }}>
                Failed to load details
              </ThemedText>
              <Button onPress={() => refetch()} variant="secondary" style={{ marginTop: Spacing.three }}>
                Try Again
              </Button>
            </View>
          ) : programme.workouts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <SymbolView
                name={{ ios: 'square.grid.3x1.folder.badge.plus', android: 'folder_open' }}
                size={40}
                tintColor={themeColors.textSecondary}
              />
              <ThemedText type="smallBold" style={{ fontSize: 16 }}>
                No workouts scheduled
              </ThemedText>
              <ThemedText type="small" style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>
                Add workout sessions to this program on the web first.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.listGrid}>
              {programme.workouts
                .sort((a, b) => a.order_index - b.order_index)
                .map((workout) => (
                  <View
                    key={workout.id}
                    style={[styles.card, { backgroundColor: themeColors.backgroundSelected }]}
                  >
                    <View style={styles.cardHeader}>
                      <View style={{ flex: 1 }}>
                        <ThemedText type="code" style={[styles.cardIndex, { color: themeColors.textSecondary }]}>
                          Day {workout.order_index + 1}
                        </ThemedText>
                        <ThemedText type="subtitle" style={styles.workoutName}>
                          {workout.name}
                        </ThemedText>
                      </View>

                      <Pressable
                        onPress={() => handleStartWorkout(workout.id, workout.name)}
                        style={({ pressed }) => [styles.startBtn, pressed && styles.pressed]}
                      >
                        <SymbolView
                          name={{ ios: 'play.fill', android: 'play_arrow' }}
                          size={12}
                          tintColor="#fff"
                        />
                        <ThemedText type="code" style={styles.startBtnText}>
                          Start
                        </ThemedText>
                      </Pressable>
                    </View>

                    {workout.exercisesWithMetadata.length > 0 ? (
                      <View style={styles.exercisePreview}>
                        <ThemedText type="code" style={[styles.previewTitle, { color: themeColors.textSecondary }]}>
                          Exercises Overview
                        </ThemedText>
                        <View style={styles.exerciseNamesList}>
                          {workout.exercisesWithMetadata.map((ewm, idx) => (
                            <View key={idx} style={styles.exerciseNameRow}>
                              <View style={styles.dot} />
                              <ThemedText type="small" style={{ fontSize: 13 }}>
                                {ewm.exercise.name}
                              </ThemedText>
                            </View>
                          ))}
                        </View>
                      </View>
                    ) : (
                      <ThemedText type="small" style={{ color: themeColors.textSecondary, fontStyle: 'italic', marginTop: Spacing.two }}>
                        No exercises linked yet.
                      </ThemedText>
                    )}
                  </View>
                ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

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
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.one,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#333',
  },
  eyebrow: {
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
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
    gap: Spacing.four,
  },
  card: {
    borderRadius: 20,
    padding: Spacing.four,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  cardIndex: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: '#be185d',
    paddingHorizontal: Spacing.three + 2,
    paddingVertical: Spacing.two,
    borderRadius: 14,
  },
  startBtnText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
  },
  exercisePreview: {
    marginTop: Spacing.three,
    borderTopWidth: 0.5,
    borderColor: 'rgba(128,128,128,0.2)',
    paddingTop: Spacing.two,
    gap: Spacing.two,
  },
  previewTitle: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  exerciseNamesList: {
    flexDirection: 'column',
    gap: 6,
  },
  exerciseNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#be185d',
  },
  pressed: {
    opacity: 0.8,
  },
});
