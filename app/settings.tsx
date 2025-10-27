/**
 * Settings Screen
 * User settings and preferences
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore, useAuthStore } from '../services/store';
import { Colors, Typography, Spacing, BorderRadius, Shadows, getColorScheme } from '../constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  // Use gender-based theme for consistent colors
  const colors = getColorScheme(theme === 'dark', user?.gender);

  const handleLogout = async () => {
    await logout();
    router.replace('/welcome');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header - Match profile header styling */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }, Shadows.sm]}
            onPress={() => {/* Edit profile */}}
          >
            <MaterialIcons name="edit" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>Edit Profile</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }, Shadows.sm]}
            onPress={() => {/* Change Password */}}
          >
            <MaterialIcons name="lock" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>Change Password</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }, Shadows.sm]}
            onPress={toggleTheme}
          >
            <MaterialIcons name={theme === 'dark' ? 'light-mode' : 'dark-mode'} size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }, Shadows.sm]}
            onPress={() => {/* Notifications */}}
          >
            <MaterialIcons name="notifications" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Privacy & Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy & Security</Text>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }, Shadows.sm]}
            onPress={() => {/* Privacy Policy */}}
          >
            <MaterialIcons name="privacy-tip" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>Privacy Policy</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }, Shadows.sm]}
            onPress={() => {/* Terms of Service */}}
          >
            <MaterialIcons name="description" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>Terms of Service</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }, Shadows.sm]}
            onPress={() => {/* About App */}}
          >
            <MaterialIcons name="info" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>About App</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }, Shadows.sm]}
            onPress={() => {/* Help & Support */}}
          >
            <MaterialIcons name="help" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.settingItem, styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={24} color="#ffffff" />
          <Text style={[styles.settingText, { color: '#ffffff' }]}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl + 20, // Match profile header padding
    paddingBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  headerSpacer: {
    width: 40, // Same width as back button for centering title
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  settingText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  logoutButton: {
    marginTop: Spacing.lg,
  },
});