import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNetInfo } from '@react-native-community/netinfo';
import { useMutationState, hydrate } from '@tanstack/react-query';

import { useProgrammes, useCreateProgramme, Programme } from '@/hooks/use-programmes';
import { queryClient, clientPersister } from '@/lib/query-client';
import { setSimulatedOffline, getIsSimulatedOffline } from '@/lib/network';
import { generateUUID } from '@/lib/uuid';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

// Import Analytics & Dashboard components
import { WorkoutHeatmap } from '@/features/analytics';
import {
  FatigueTrendLine,
  SessionVolumeChart,
  MuscleDistributionChart,
  MuscleOutputTable,
} from '@/features/dashboard';

export default function AnalyticsScreen() {
  // Offline Diagnostics State
  const netInfo = useNetInfo();
  const [simulatedOffline, setSimulatedOfflineState] = useState(getIsSimulatedOffline());
  const { data: programmes, isLoading: loadingProgs, error: progsError, refetch: refetchProgs } = useProgrammes();
  const createProgramme = useCreateProgramme();

  // Watch pending/paused mutations reactively in the cache
  const mutations = useMutationState({
    select: (mutation) => ({
      variables: mutation.state.variables as any,
      status: mutation.state.status,
      isPaused: mutation.state.isPaused,
    }),
  });

  const toggleOfflineSimulation = () => {
    const nextState = !simulatedOffline;
    setSimulatedOffline(nextState);
    setSimulatedOfflineState(nextState);
  };

  const handleAddMockProgramme = () => {
    const randomSuffix = Math.floor(Math.random() * 10000);
    createProgramme.mutate({
      id: generateUUID(),
      name: `Programme #${randomSuffix}`,
      description: `Mock workout routine generated offline/online.`,
      is_active: false,
    });
  };

  const handleSimulateAppReload = async () => {
    queryClient.clear();
    const restoredState = await clientPersister.restoreClient();
    if (restoredState) {
      hydrate(queryClient, restoredState);
      queryClient.resumePausedMutations();
    }
  };

  const handleClearCache = async () => {
    queryClient.clear();
    await clientPersister.removeClient();
    refetchProgs();
  };

  const isActuallyOnline = !!netInfo.isConnected;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>
              Analytics
            </ThemedText>
            <ThemedText type="small" style={styles.description}>
              Track your consistency, load fatigue, and routine overload trends.
            </ThemedText>
          </View>

          {/* 1. Consistency Heatmap */}
          <View style={styles.dashboardSection}>
            <WorkoutHeatmap />
          </View>

          {/* 2. Fatigue ACWR Line Chart */}
          <View style={styles.dashboardSection}>
            <FatigueTrendLine />
          </View>

          {/* 3. Muscle Group Set Allocation Donut Chart */}
          <View style={styles.dashboardSection}>
            <MuscleDistributionChart />
          </View>

          {/* 4. Routine Session Overload Bar Chart */}
          <View style={styles.dashboardSection}>
            <SessionVolumeChart />
          </View>

          {/* 5. Muscle Performance Pulse & Details Sheets */}
          <View style={styles.dashboardSection}>
            <MuscleOutputTable />
          </View>

          {/* Collapsible Diagnostics (Slice 3 offline caching & sync diagnostics) */}
          <View style={styles.diagnosticsContainer}>
            <Collapsible title="Offline Caching & Sync Diagnostics">
              <View style={styles.collapsibleContent}>
                {/* Network Health Indicators */}
                <ThemedView type="backgroundSelected" style={styles.card}>
                  <ThemedText type="smallBold" style={styles.cardTitle}>
                    Network Connectivity State
                  </ThemedText>
                  <View style={styles.indicatorRow}>
                    <View style={styles.indicatorColumn}>
                      <ThemedText type="small" style={styles.indicatorLabel}>Real Connection:</ThemedText>
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, isActuallyOnline ? styles.dotGreen : styles.dotRed]} />
                        <ThemedText type="smallBold">{isActuallyOnline ? 'Connected' : 'Disconnected'}</ThemedText>
                      </View>
                    </View>

                    <View style={styles.indicatorColumn}>
                      <ThemedText type="small" style={styles.indicatorLabel}>Simulation Mode:</ThemedText>
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, simulatedOffline ? styles.dotRed : styles.dotGreen]} />
                        <ThemedText type="smallBold">{simulatedOffline ? 'Simulated Offline' : 'Normal'}</ThemedText>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={toggleOfflineSimulation}
                    style={[styles.toggleButton, simulatedOffline && styles.toggleButtonActive]}
                    activeOpacity={0.8}
                  >
                    <ThemedText type="smallBold" style={styles.toggleButtonText}>
                      {simulatedOffline ? 'Disable Simulated Offline' : 'Enable Simulated Offline'}
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>

                {/* Mutation Queue Monitor */}
                <ThemedView type="backgroundSelected" style={styles.card}>
                  <ThemedText type="smallBold" style={styles.cardTitle}>
                    Mutation Queue ({mutations.length})
                  </ThemedText>
                  {mutations.length === 0 ? (
                    <View style={styles.emptyState}>
                      <ThemedText type="small" style={styles.emptyText}>✓ No pending mutations in queue</ThemedText>
                    </View>
                  ) : (
                    <View style={styles.queueList}>
                      {mutations.map((m, idx) => (
                        <View key={idx} style={styles.queueItem}>
                          <View style={styles.queueHeader}>
                            <ThemedText type="smallBold" style={styles.queueName}>
                              Create "{m.variables?.name || 'Programme'}"
                            </ThemedText>
                            <View style={[styles.queueBadge, m.isPaused ? styles.badgePaused : styles.badgeSyncing]}>
                              <ThemedText type="code" style={styles.badgeText}>
                                {m.isPaused ? 'PAUSED / QUEUED' : 'SENDING'}
                              </ThemedText>
                            </View>
                          </View>
                          <ThemedText type="code" style={styles.queueId}>
                            ID: {m.variables?.id}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  )}
                </ThemedView>

                {/* Operations Panel */}
                <View style={styles.operationsGrid}>
                  <TouchableOpacity
                    onPress={handleAddMockProgramme}
                    style={styles.opButton}
                    activeOpacity={0.8}
                  >
                    <ThemedText type="smallBold" style={styles.opButtonText}>
                      Add Mock Programme
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSimulateAppReload}
                    style={[styles.opButton, styles.buttonYellow]}
                    activeOpacity={0.8}
                  >
                    <ThemedText type="smallBold" style={styles.opButtonText}>
                      Simulate App Reload
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleClearCache}
                    style={[styles.opButton, styles.buttonOutline]}
                    activeOpacity={0.8}
                  >
                    <ThemedText type="smallBold" style={styles.clearButtonText}>
                      Clear MMKV Cache
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </Collapsible>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

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
    gap: Spacing.five,
  },
  header: {
    marginBottom: Spacing.one,
    gap: Spacing.one,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    color: '#888',
  },
  dashboardSection: {
    width: '100%',
  },
  diagnosticsContainer: {
    marginTop: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: Spacing.four,
  },
  collapsibleContent: {
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.three,
  },
  cardTitle: {
    color: '#aaa',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  indicatorColumn: {
    flex: 1,
    gap: Spacing.one,
  },
  indicatorLabel: {
    color: '#666',
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotGreen: {
    backgroundColor: '#10b981',
  },
  dotRed: {
    backgroundColor: '#ef4444',
  },
  toggleButton: {
    backgroundColor: '#be185d',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  toggleButtonActive: {
    backgroundColor: '#3b82f6',
  },
  toggleButtonText: {
    color: '#fff',
  },
  emptyState: {
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  emptyText: {
    color: '#555',
  },
  queueList: {
    gap: Spacing.two,
  },
  queueItem: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.one,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queueName: {
    fontSize: 15,
  },
  queueBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgePaused: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  badgeSyncing: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  badgeText: {
    fontSize: 9,
    color: '#f59e0b',
  },
  queueId: {
    fontSize: 10,
    color: '#666',
  },
  operationsGrid: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  opButton: {
    backgroundColor: '#be185d',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  buttonYellow: {
    backgroundColor: '#d97706',
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: '#333',
    backgroundColor: 'transparent',
  },
  opButtonText: {
    color: '#fff',
  },
  clearButtonText: {
    color: '#aaa',
  },
});
