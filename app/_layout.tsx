import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { getSessionAuthed, hydrateSession, setUnauthorizedHandler } from '../lib/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    const bootstrapAuth = async () => {
      await hydrateSession();
      setIsAuthed(getSessionAuthed());
      setAuthChecked(true);
    };
    bootstrapAuth();
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    setIsAuthed(getSessionAuthed());
  }, [authChecked, segments]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setIsAuthed(false);
      router.replace('/login');
    });
    return () => {
      setUnauthorizedHandler(null);
    };
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    const inTabs = segments[0] === '(tabs)';
    const inLogin = segments[0] === 'login';
    if (isAuthed && !inTabs) {
      router.replace('/(tabs)');
    } else if (!isAuthed && !inLogin) {
      router.replace('/login');
    }
  }, [authChecked, isAuthed, segments, router]);

  if (!authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
