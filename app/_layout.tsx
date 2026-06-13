import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '@/lib/auth';
import { queryClient } from '@/lib/query';
import { restoreLanguage } from '@/lib/i18n';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const { user, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [langReady, setLangReady] = useState(false);

  useEffect(() => {
    restoreLanguage().finally(() => setLangReady(true));
  }, []);

  useEffect(() => {
    if (initializing || !langReady) return;
    SplashScreen.hideAsync().catch(() => {});
    const seg0 = segments[0];
    if (!user) {
      // Logged out: send to login unless already in the auth group
      if (seg0 !== '(auth)') router.replace('/(auth)/login');
    } else if (seg0 === '(auth)' || seg0 === undefined) {
      // Logged in but on the login screen or the root index → go to the app
      router.replace('/(tabs)');
    }
  }, [user, initializing, langReady, segments, router]);

  if (initializing || !langReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="webview/[target]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StatusBar style="dark" />
            <RootNavigator />
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
