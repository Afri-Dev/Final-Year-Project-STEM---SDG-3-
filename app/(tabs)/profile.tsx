import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore, useThemeStore } from '../../services/store';
import { Colors, Typography, Spacing, BorderRadius, Shadows, getLevelInfo, getColorScheme } from '../../constants/theme';
import database from '../../services/database';
import { User } from '../../types';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, refreshUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  // Use gender-based theme for consistent colors
  const colors = getColorScheme(theme === 'dark', user?.gender);

  const [refreshing, setRefreshing] = React.useState(false);
  const [streakData, setStreakData] = React.useState<{ day: string; date: string; completed: boolean; wasActiveForThreeMinutes: boolean }[]>([]);

  useEffect(() => {
    refreshUser();
    loadStreakData();
  }, []);

  useEffect(() => {
    if (user) {
      loadStreakData();
    }
  }, [user]);

  const loadStreakData = async () => {
    if (!user) return;
    
    try {
      const data = await database.getWeeklyStreakData(user.id);
      setStreakData(data);
    } catch (error) {
      console.error('Failed to load streak data:', error);
      // Fallback to sample data if there's an error
      setStreakData([
        { day: 'Mon', date: '', completed: false, wasActiveForThreeMinutes: false },
        { day: 'Tue', date: '', completed: false, wasActiveForThreeMinutes: false },
        { day: 'Wed', date: '', completed: false, wasActiveForThreeMinutes: false },
        { day: 'Thu', date: '', completed: false, wasActiveForThreeMinutes: false },
        { day: 'Fri', date: '', completed: false, wasActiveForThreeMinutes: false },
        { day: 'Sat', date: '', completed: false, wasActiveForThreeMinutes: false },
        { day: 'Sun', date: '', completed: false, wasActiveForThreeMinutes: false },
      ]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    await loadStreakData();
    setRefreshing(false);
  };

  if (!user) {
    return null;
  }

  const levelInfo = getLevelInfo(user.xp);

  // Sample badges (replace with actual data from database)
  const sampleBadges = [
    { id: 1, name: 'Biology Basics', icon: 'science', unlocked: false, color: colors.science },
    { id: 2, name: 'Physics Pro', icon: 'bolt', unlocked: false, color: colors.primary },
    { id: 3, name: 'Chemistry Champion', icon: 'biotech', unlocked: false, color: colors.technology },
    { id: 4, name: 'Earth Explorer', icon: 'public', unlocked: false, color: colors.textSecondary },
    { id: 5, name: 'Math Master', icon: 'calculate', unlocked: false, color: colors.textSecondary },
    { id: 6, name: 'Space Cadet', icon: 'rocket-launch', unlocked: false, color: colors.textSecondary },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <MaterialIcons name="settings" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
              <MaterialIcons name="person" size={64} color={colors.primary} />
            </View>
            <TouchableOpacity
              style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}
              onPress={() => {/* Edit avatar */}}
            >
              <MaterialIcons name="edit" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>
            {(user as User).middleName 
              ? `${(user as User).firstName} ${(user as User).middleName} ${(user as User).lastName}` 
              : `${(user as User).firstName} ${(user as User).lastName}`}
          </Text>
          <Text style={[styles.userLevel, { color: colors.textSecondary }]}>
            Level {levelInfo.currentLevel.level} - {levelInfo.currentLevel.title}
          </Text>

          <View style={styles.profileActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primaryLight }]}
              onPress={() => {/* Edit avatar */}}
            >
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                Edit Avatar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={toggleTheme}
            >
              <MaterialIcons
                name={theme === 'dark' ? 'light-mode' : 'dark-mode'}
                size={18}
                color="#ffffff"
              />
              <Text style={styles.actionButtonTextWhite}>
                {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Level Progress */}
        <View style={[styles.levelCard, { backgroundColor: colors.surface }, Shadows.md]}>
          <View style={styles.levelHeader}>
            <Text style={[styles.levelTitle, { color: colors.text }]}>Next Level</Text>
            <Text style={[styles.levelXP, { color: colors.textSecondary }]}>
              {user.xp} / {levelInfo.nextLevel.xpRequired} XP
            </Text>
          </View>
          <View style={[styles.progressBarBackground, { backgroundColor: colors.primaryLight }]}>
            <View
              style={[
                styles.progressBar,
                {
                  backgroundColor: colors.primary,
                  width: `${levelInfo.progress}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }, Shadows.sm]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>XP Points</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {user.xp.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }, Shadows.sm]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Badges Earned</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {user.totalBadges}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }, Shadows.sm]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Longest Streak</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {user.longestStreak} Days
            </Text>
          </View>
        </View>

        {/* Streak Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Streak</Text>
          <View style={[styles.streakCard, { backgroundColor: colors.surface }, Shadows.sm]}>
            <View style={styles.streakDays}>
              {streakData.map((day, index) => (
                <View key={index} style={styles.streakDay}>
                  <Text style={[styles.streakDayLabel, { color: colors.textSecondary }]}>
                    {day.day}
                  </Text>
                  <View
                    style={[
                      styles.streakDayCircle,
                      {
                        backgroundColor: day.completed
                          ? colors.primary
                          : colors.disabled,
                      },
                    ]}
                  >
                    {day.completed && (
                      <MaterialIcons name="check" size={16} color="#ffffff" />
                    )}
                  </View>
                  {/* Checkmark indicator for 3+ minutes of activity */}
                  {day.wasActiveForThreeMinutes && (
                    <View style={[styles.threeMinuteIndicator, { borderColor: colors.success }]}>
                      <MaterialIcons name="check" size={12} color={colors.success} />
                    </View>
                  )}
                </View>
              ))}
            </View>
            <View style={styles.streakLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: colors.primary }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>Logged in</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: colors.success, borderWidth: 2, borderColor: colors.success }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>3+ min active</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges</Text>
          <View style={styles.badgesGrid}>
            {sampleBadges.map((badge) => (
              <TouchableOpacity
                key={badge.id}
                style={styles.badgeItem}
                onPress={() => {/* Show badge details */}}
              >
                <View
                  style={[
                    styles.badgeIcon,
                    {
                      backgroundColor: badge.unlocked ? `${badge.color}20` : colors.disabled,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={badge.icon as any}
                    size={32}
                    color={badge.unlocked ? badge.color : colors.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.badgeName,
                    { color: badge.unlocked ? colors.text : colors.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {badge.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

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
            onPress={() => {/* Notifications */}}
          >
            <MaterialIcons name="notifications" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }, Shadows.sm]}
            onPress={() => {/* Privacy */}}
          >
            <MaterialIcons name="privacy-tip" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>Privacy</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }, Shadows.sm]}
            onPress={() => {/* About */}}
          >
            <MaterialIcons name="info" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>About</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, styles.logoutButton, { backgroundColor: colors.error }]}
            onPress={async () => {
              await logout();
              router.replace('/welcome');
            }}
          >
            <MaterialIcons name="logout" size={24} color="#ffffff" />
            <Text style={[styles.settingText, { color: '#ffffff' }]}>Logout</Text>
          </TouchableOpacity>
        </View>

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
    paddingTop: Spacing.xl + 20,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 4,
  },
  userLevel: {
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.lg,
  },
  profileActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  actionButtonTextWhite: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: '#ffffff',
  },
  levelCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  levelTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  levelXP: {
    fontSize: Typography.fontSize.sm,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  badgeItem: {
    width: '30%',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badgeName: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  streakCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  streakDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  streakDay: {
    alignItems: 'center',
    gap: Spacing.sm,
    position: 'relative',
  },
  streakDayLabel: {
    fontSize: Typography.fontSize.xs,
  },
  streakDayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  threeMinuteIndicator: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendColorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: Typography.fontSize.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  settingText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  logoutButton: {
    marginTop: Spacing.md,
  },
});