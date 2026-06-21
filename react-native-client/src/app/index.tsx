import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, View, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { useAuth } from '@/context/auth-context';
import { apiFetch, BACKEND_URL } from '@/lib/api';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, MaxContentWidth, Spacing, Colors } from '@/constants/theme';
import { activeSessionStore, ActiveSession } from '@/features/workouts';

/**
 * Authenticated dashboard representing the primary Home screen.
 * Displays user overview, quick actions, session logout, and auth diagnostics tools.
 */
export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'dark' : scheme];

  const { user, token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [diagnosticStatus, setDiagnosticStatus] = useState<string>('Idle');
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active workout session detection state
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Listen to screen focus events to keep the active session banner updated dynamically
  useEffect(() => {
    const updateSession = () => {
      setActiveSession(activeSessionStore.getActiveSession());
    };
    
    updateSession();
    const unsubscribe = navigation.addListener('focus', updateSession);
    return unsubscribe;
  }, [navigation]);

  // Tick the active session duration in the Home banner
  useEffect(() => {
    if (!activeSession) return;

    const tick = () => {
      setSecondsElapsed(Math.max(0, Math.floor((Date.now() - activeSession.startTime) / 1000)));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const displayTime = React.useMemo(() => {
    const hrs = Math.floor(secondsElapsed / 3600);
    const mins = Math.floor((secondsElapsed % 3600) / 60);
    const secs = secondsElapsed % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [secondsElapsed]);

  // Runs a diagnostic request to check endpoint token authorization
  const runDiagnosticAuth = async () => {
    setLoading(true);
    setErrorMsg(null);
    setDiagnosticStatus('Testing /api/auth/me...');
    
    try {
      const res = await apiFetch('/api/auth/me');
      
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setDiagnosticData(data);
      setDiagnosticStatus('Success! Secure request passed validation.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Verification failed');
      setDiagnosticStatus('Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEmptyWorkout = () => {
    activeSessionStore.startSession('adhoc', 'adhoc', 'Empty Workout');
    router.push({
      pathname: '/workout-session',
      params: { programmeId: 'adhoc', workoutId: 'adhoc' },
    });
  };

  const handleResumeWorkout = () => {
    if (!activeSession) return;
    router.push({
      pathname: '/workout-session',
      params: { programmeId: activeSession.programmeId, workoutId: activeSession.workoutId },
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
          <View style={styles.headerRow}>
            <View>
              <ThemedText type="small" style={styles.greetingText}>Welcome back,</ThemedText>
              <ThemedText type="subtitle" style={styles.usernameText}>
                {user?.username || 'Athlete'}
              </ThemedText>
            </View>
            <TouchableOpacity onPress={logout} style={styles.logoutButton} activeOpacity={0.7}>
              <ThemedText type="smallBold" style={styles.logoutText}>Logout</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Active Workout Resume Banner */}
          {activeSession ? (
            <TouchableOpacity
              onPress={handleResumeWorkout}
              activeOpacity={0.8}
              style={styles.activeSessionBanner}
            >
              <View style={styles.bannerHeader}>
                <SymbolView
                  name={{ ios: 'timer', android: 'timer' }}
                  size={16}
                  tintColor="#fff"
                />
                <ThemedText type="smallBold" style={styles.bannerTitle}>
                  Workout In Progress
                </ThemedText>
                <ThemedText type="code" style={styles.bannerTime}>
                  {displayTime}
                </ThemedText>
              </View>
              <ThemedText type="subtitle" style={styles.bannerWorkoutName} numberOfLines={1}>
                {activeSession.name}
              </ThemedText>
              <ThemedText type="small" style={styles.bannerActionText}>
                Tap to resume your training session →
              </ThemedText>
            </TouchableOpacity>
          ) : null}

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <ThemedView type="backgroundElement" style={styles.statCard}>
              <ThemedText type="small" style={styles.statLabel}>Total Workouts</ThemedText>
              <ThemedText type="subtitle" style={styles.statValue}>0</ThemedText>
            </ThemedView>
            <ThemedView type="backgroundElement" style={styles.statCard}>
              <ThemedText type="small" style={styles.statLabel}>Active Program</ThemedText>
              <ThemedText type="smallBold" style={styles.statValueSecondary}>None</ThemedText>
            </ThemedView>
            <ThemedView type="backgroundElement" style={styles.statCard}>
              <ThemedText type="small" style={styles.statLabel}>Streak</ThemedText>
              <ThemedText type="subtitle" style={styles.statValue}>0 days</ThemedText>
            </ThemedView>
          </View>

          {/* Primary Quick Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.primaryActionButton}
              onPress={activeSession ? handleResumeWorkout : handleStartEmptyWorkout}
              activeOpacity={0.8}
            >
              <ThemedText type="default" style={styles.actionButtonText}>
                {activeSession ? 'Resume Workout' : 'Start Empty Workout'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryActionButton}
              onPress={() => router.push('/programmes')}
              activeOpacity={0.8}
            >
              <ThemedText type="default" style={styles.secondaryActionText}>
                Browse Programs
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Diagnostics Section */}
          <View style={styles.diagnosticsContainer}>
            <Collapsible title="Auth & Client Diagnostics">
              <View style={styles.collapsibleContent}>
                <ThemedText type="small">
                  Current Token:{' '}
                  <ThemedText type="code" numberOfLines={1} style={styles.tokenCode}>
                    {token || 'Missing'}
                  </ThemedText>
                </ThemedText>
                
                <ThemedText type="small">
                  Backend Endpoint:{' '}
                  <ThemedText type="code" style={styles.tokenCode}>
                    {BACKEND_URL}
                  </ThemedText>
                </ThemedText>

                <View style={styles.statusBox}>
                  <ThemedText type="small">
                    Status:{' '}
                    <ThemedText type="code" style={errorMsg ? styles.errorStatus : styles.successStatus}>
                      {diagnosticStatus}
                    </ThemedText>
                  </ThemedText>
                  
                  {diagnosticData && (
                    <ThemedText type="code" style={styles.diagnosticsUser}>
                      Returned User: {JSON.stringify(diagnosticData)}
                    </ThemedText>
                  )}

                  {errorMsg && (
                    <ThemedText type="small" style={styles.errorStatus}>
                      Error: {errorMsg}
                    </ThemedText>
                  )}
                </View>

                <TouchableOpacity
                  onPress={runDiagnosticAuth}
                  disabled={loading}
                  style={[styles.testButton, loading && styles.testButtonDisabled]}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ThemedText type="smallBold" style={styles.actionButtonText}>
                      Run API Request Test
                    </ThemedText>
                  )}
                </TouchableOpacity>
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
    gap: Spacing.four,
  },
  activeSessionBanner: {
    backgroundColor: '#be185d',
    padding: Spacing.four,
    borderRadius: 20,
    gap: Spacing.one,
    shadowColor: '#be185d',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    flex: 1,
  },
  bannerTime: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  bannerWorkoutName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
  bannerActionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: Spacing.one,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  greetingText: {
    color: '#888',
  },
  usernameText: {
    fontSize: 28,
    fontWeight: '700',
  },
  logoutButton: {
    borderWidth: 1.5,
    borderColor: '#333',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  logoutText: {
    color: '#be185d',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  statCard: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.one,
    minHeight: 80,
    justifyContent: 'center',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statValueSecondary: {
    fontSize: 16,
    color: '#aaa',
  },
  actionsContainer: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  primaryActionButton: {
    backgroundColor: '#be185d',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    shadowColor: '#be185d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryActionButton: {
    borderWidth: 1.5,
    borderColor: '#be185d',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryActionText: {
    color: '#be185d',
    fontWeight: '700',
  },
  diagnosticsContainer: {
    marginTop: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: Spacing.four,
  },
  collapsibleContent: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  tokenCode: {
    fontSize: 10,
    color: '#888',
  },
  statusBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.one,
    marginVertical: Spacing.one,
  },
  successStatus: {
    color: '#10b981',
  },
  errorStatus: {
    color: '#ef4444',
  },
  diagnosticsUser: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: Spacing.one,
  },
  testButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: Spacing.two + 2,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  testButtonDisabled: {
    backgroundColor: '#3b82f688',
  },
});
