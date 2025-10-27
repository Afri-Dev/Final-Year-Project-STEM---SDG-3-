/**
 * Root Layout for STEM Learning App
 * Configures Expo Router, initializes app state, and loads resources
 */

import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useAppStore, useAuthStore, useThemeStore } from '../services/store';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

import { AppState } from 'react-native';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const { initialize: initializeApp, isInitialized } = useAppStore();
  const { isAuthenticated, isLoading: authLoading, startSession, endSession, user } = useAuthStore();
  const { theme } = useThemeStore();
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize app (database, auth, theme)
        await initializeApp();

        // Artificial delay for splash screen (optional)
        await new Promise(resolve => setTimeout(resolve, 1000));

        setAppReady(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        setAppReady(true); // Continue anyway
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appReady && isInitialized && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [appReady, isInitialized, authLoading]);

  // Session tracking
  useEffect(() => {
    if (isAuthenticated && user) {
      startSession();
    }
  }, [isAuthenticated, user]);

  // Track app state changes for session duration
  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        if (isAuthenticated && user) {
          startSession();
        }
      } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        // App is going to the background
        if (isAuthenticated && user) {
          endSession();
        }
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, [appState, isAuthenticated, user]);

  if (!appReady || !isInitialized || authLoading) {
    const colors = theme === 'dark' ? Colors.dark : Colors.light;
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: theme === 'dark' ? Colors.dark.background : Colors.light.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="welcome"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="subject/[category]"
          options={{
            headerShown: true,
            title: 'Subject',
            headerStyle: {
              backgroundColor: theme === 'dark' ? Colors.dark.surface : Colors.light.surface,
            },
            headerTintColor: theme === 'dark' ? Colors.dark.text : Colors.light.text,
          }}
        />
        <Stack.Screen
          name="lesson/[id]"
          options={{
            headerShown: true,
            title: 'Lesson',
            headerStyle: {
              backgroundColor: theme === 'dark' ? Colors.dark.surface : Colors.light.surface,
            },
            headerTintColor: theme === 'dark' ? Colors.dark.text : Colors.light.text,
          }}
        />
        <Stack.Screen
          name="quiz/[id]"
          options={{
            headerShown: true,
            title: 'Quiz',
            headerStyle: {
              backgroundColor: theme === 'dark' ? Colors.dark.surface : Colors.light.surface,
            },
            headerTintColor: theme === 'dark' ? Colors.dark.text : Colors.light.text,
          }}
        />
        <Stack.Screen
          name="quiz-result"
          options={{
            headerShown: true,
            title: 'Quiz Results',
            headerStyle: {
              backgroundColor: theme === 'dark' ? Colors.dark.surface : Colors.light.surface,
            },
            headerTintColor: theme === 'dark' ? Colors.dark.text : Colors.light.text,
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});