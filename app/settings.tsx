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
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const { logout } = useAuthStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;

  const handleLogout = async () => {
    await logout();
    router.replace('/welcome');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  settingText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: Spacing.md,
  },
  logoutButton: {
    marginTop: Spacing.lg,
    justifyContent: 'center',
  },
});