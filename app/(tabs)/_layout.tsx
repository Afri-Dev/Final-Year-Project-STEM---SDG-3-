/**
 * Tab Navigation Layout
 * Bottom tab navigation for main app sections
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore, useAuthStore } from '../../services/store';
import { Colors, getColorScheme } from '../../constants/theme';

export default function TabLayout() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  // Use gender-based theme for consistent colors in tab bar
  const colors = getColorScheme(theme === 'dark', user?.gender);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'home' : 'home'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'school' : 'school'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'leaderboard' : 'leaderboard'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
