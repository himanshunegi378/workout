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
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useProgrammes, useUpdateProgramme } from '@/features/programmes';
import { Button } from '@/components/ui/button';

export default function ProgrammesScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { data: programmes = [], isLoading, isError, refetch } = useProgrammes();
  const updateProgramme = useUpdateProgramme();

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updateProgramme.mutate({ id, is_active: !currentStatus });
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
                name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
                size={22}
                tintColor={themeColors.text}
              />
            </Pressable>
            <View style={{ flex: 1 }}>
              <ThemedText type="small" style={styles.eyebrow}>
                Training Cycles
              </ThemedText>
              <ThemedText type="subtitle" style={styles.title}>
                Your Programmes
              </ThemedText>
            </View>
          </View>

          {/* Content state views */}
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color="#be185d" size="large" />
              <ThemedText type="small" style={{ color: themeColors.textSecondary, marginTop: Spacing.two }}>
                Loading programmes...
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
                Failed to load programmes
              </ThemedText>
              <Button onPress={() => refetch()} variant="secondary" style={{ marginTop: Spacing.three }}>
                Try Again
              </Button>
            </View>
          ) : programmes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <SymbolView
                name={{ ios: 'dumbbell.fill', android: 'fitness_center', web: 'fitness_center' }}
                size={40}
                tintColor={themeColors.textSecondary}
              />
              <ThemedText type="smallBold" style={{ fontSize: 16 }}>
                No programmes found
              </ThemedText>
              <ThemedText type="small" style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>
                Create a training programme on the web to begin.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.listGrid}>
              {programmes.map((prog) => (
                <Pressable
                  key={prog.id}
                  onPress={() => router.push({ pathname: '/programme-details', params: { programmeId: prog.id } })}
                  style={({ pressed }) => [
                    styles.card,
                    { backgroundColor: themeColors.backgroundSelected },
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View
                      style={[
                        styles.cardColorBar,
                        { backgroundColor: prog.is_active ? '#be185d' : 'rgba(128,128,128,0.3)' },
                      ]}
                    />
                    <View style={styles.cardHeaderText}>
                      <View style={styles.titleRow}>
                        <ThemedText type="smallBold" style={{ fontSize: 18, flex: 1 }} numberOfLines={1}>
                          {prog.name}
                        </ThemedText>
                        {prog.is_active && (
                          <View style={styles.activeBadge}>
                            <ThemedText type="code" style={styles.activeBadgeText}>
                              Active
                            </ThemedText>
                          </View>
                        )}
                      </View>
                      {prog.description ? (
                        <ThemedText
                          type="small"
                          style={[styles.cardDesc, { color: themeColors.textSecondary }]}
                          numberOfLines={2}
                        >
                          {prog.description}
                        </ThemedText>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.statsRow}>
                      <SymbolView
                        name={{ ios: 'dumbbell.fill', android: 'fitness_center', web: 'fitness_center' }}
                        size={12}
                        tintColor={themeColors.textSecondary}
                      />
                      <ThemedText type="code" style={{ fontSize: 11, color: themeColors.textSecondary }}>
                        {prog.workouts.length} workout{prog.workouts.length !== 1 ? 's' : ''}
                      </ThemedText>
                    </View>

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleToggleActive(prog.id, prog.is_active);
                      }}
                      style={({ pressed }) => [
                        styles.starBtn,
                        {
                          backgroundColor: prog.is_active
                            ? '#be185d'
                            : themeColors.background,
                        },
                        pressed && styles.pressed,
                      ]}
                    >
                      <SymbolView
                        name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                        size={12}
                        tintColor={prog.is_active ? '#fff' : '#be185d'}
                      />
                      <ThemedText
                        type="code"
                        style={[
                          styles.starBtnText,
                          { color: prog.is_active ? '#fff' : '#be185d' },
                        ]}
                      >
                        {prog.is_active ? 'Active' : 'Set Active'}
                      </ThemedText>
                    </Pressable>
                  </View>
                </Pressable>
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
    fontSize: 28,
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
    gap: Spacing.three,
  },
  card: {
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  cardColorBar: {
    width: 3.5,
    height: 32,
    borderRadius: 1.75,
  },
  cardHeaderText: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  activeBadge: {
    backgroundColor: 'rgba(190, 24, 93, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: '#be185d',
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#be185d',
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
    paddingLeft: Spacing.four,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  starBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  starBtnText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.8,
  },
});
