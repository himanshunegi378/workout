import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { AuthScreen } from '@/components/auth-screen';
import { queryClient, clientPersister } from '@/lib/query-client';
import { initNetworkListener } from '@/lib/network';
import { RestTimerProvider, RestTimerOverlay, RestTimerFloatingBubble } from '@/features/rest-timer';

/**
 * Inner component to access the useAuth hook once the AuthProvider is mounted.
 * Implements route protection and wraps screens in the PersistQueryClientProvider cache.
 */
function TabLayoutContent() {
  const colorScheme = useColorScheme();
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: clientPersister,
          dehydrateOptions: {
            shouldDehydrateMutation: () => true, // Persist all mutation state
          },
        }}
        onSuccess={() => {
          // Resume any paused mutations once query cache is restored
          queryClient.resumePausedMutations();
        }}
      >
        <RestTimerProvider>
          <AnimatedSplashOverlay />
          {token ? (
            <>
              <AppTabs />
              <RestTimerOverlay />
              <RestTimerFloatingBubble />
            </>
          ) : (
            <AuthScreen />
          )}
        </RestTimerProvider>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}

/**
 * Root Layout defining the app themes, initializing network status bridge,
 * and mounting the AuthProvider shell.
 */
export default function TabLayout() {
  useEffect(() => {
    initNetworkListener();
  }, []);

  return (
    <AuthProvider>
      <TabLayoutContent />
    </AuthProvider>
  );
}
