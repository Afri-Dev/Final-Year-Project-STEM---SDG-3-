/**
 * Notifications Screen
 * Displays user notifications and alerts
 */

import React, { useState, useEffect } from 'react';
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
import database from '../services/database';
import { Colors, Typography, Spacing, BorderRadius, Shadows, getColorScheme } from '../constants/theme';

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const colors = getColorScheme(theme === 'dark', user?.gender);

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      const userNotifications = await database.getNotifications(user.id);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'badge':
        return 'emoji-events';
      case 'quiz':
        return 'quiz';
      case 'streak':
        return 'local-fire-department';
      case 'lesson':
        return 'school';
      case 'leaderboard':
        return 'leaderboard';
      default:
        return 'notifications';
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'badge':
        return colors.primary;
      case 'quiz':
        return colors.technology;
      case 'streak':
        return colors.error;
      case 'lesson':
        return colors.science;
      case 'leaderboard':
        return colors.engineering;
      default:
        return colors.textSecondary;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await database.markNotificationAsRead(id);
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: 1 } : notification
      ));
      // Refresh the unread count on the home screen
      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await database.markAllNotificationsAsRead(user.id);
      setNotifications(notifications.map(notification => ({ ...notification, read: 1 })));
      // Refresh the unread count on the home screen
      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const clearAll = async () => {
    if (!user) return;
    
    try {
      await database.clearAllNotifications(user.id);
      setNotifications([]);
      // Refresh the unread count on the home screen
      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await database.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
      // Refresh the unread count on the home screen
      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Notifications
          </Text>
        </View>
        <View style={styles.headerRight}>
          {notifications.some(n => !n.read) && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={[styles.headerAction, { color: colors.primary }]}>
                Mark All Read
              </Text>
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
              <Text style={[styles.headerAction, { color: colors.error }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-off" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Notifications
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              You're all caught up! Check back later for new notifications.
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsContainer}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  { backgroundColor: colors.surface },
                  !notification.read && styles.unreadNotification,
                  Shadows.sm,
                ]}
                onPress={() => markAsRead(notification.id)}
              >
                <View style={styles.notificationIconContainer}>
                  <View style={[
                    styles.notificationIcon,
                    { backgroundColor: `${getColorForType(notification.type)}20` }
                  ]}>
                    <MaterialIcons
                      name={getIconForType(notification.type)}
                      size={24}
                      color={getColorForType(notification.type)}
                    />
                  </View>
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={[
                      styles.notificationTitle,
                      { color: colors.text },
                      !notification.read && styles.unreadTitle
                    ]}>
                      {notification.title}
                    </Text>
                    {!notification.read && (
                      <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
                    {notification.message}
                  </Text>
                  <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.dismissButton}
                  onPress={() => deleteNotification(notification.id)}
                >
                  <MaterialIcons name="close" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    paddingTop: Spacing.xl + 20,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  headerAction: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  clearButton: {
    marginLeft: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['2xl'],
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  notificationsContainer: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  notificationCard: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'flex-start',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  notificationIconContainer: {
    marginRight: Spacing.md,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  notificationTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: Typography.fontWeight.bold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationMessage: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  notificationTime: {
    fontSize: Typography.fontSize.xs,
  },
  dismissButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
});