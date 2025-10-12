/**
 * Dashboard/Home Screen
 * Main screen showing user stats, quick actions, and AI recommendations
 * Based on: assets/PHOTOS/home_screen_dashboard/code.html
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore, useLearningStore, useThemeStore } from '../../services/store';
import { Colors, Typography, Spacing, BorderRadius, Shadows, getLevelInfo } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuthStore();
  const { subjects, loadSubjects } = useLearningStore();
  const { theme } = useThemeStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refreshUser(),
      loadSubjects(),
    ]);
    setRefreshing(false);
  };

  if (!user) {
    return null;
  }

  const levelInfo = getLevelInfo(user.xp);

  const quickActions = [
    { id: 'learn', icon: 'school', label: 'Learn', route: '/learn', color: colors.science },
    { id: 'quiz', icon: 'quiz', label: 'Quiz', route: '/quiz', color: colors.technology },
    { id: 'leaderboard', icon: 'leaderboard', label: 'Leaderboard', route: '/leaderboard', color: colors.engineering },
    { id: 'profile', icon: 'person', label: 'Profile', route: '/profile', color: colors.mathematics },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
              <MaterialIcons name="person" size={32} color={colors.primary} />
            </View>
          </View>
          <View>
            <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
              Welcome back!
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push('/notifications')}
        >
          <MaterialIcons name="notifications" size={24} color={colors.text} />
          {/* Notification badge */}
          <View style={[styles.notificationBadge, { backgroundColor: colors.error }]}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
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
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }, Shadows.sm]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              XP Points
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {user.xp.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface }, Shadows.sm]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Badges
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {user.totalBadges}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface }, Shadows.sm]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Streak
            </Text>
            <View style={styles.streakRow}>
              <MaterialIcons name="local-fire-department" size={20} color={colors.error} />
              <Text style={[styles.statValue, { color: colors.text, marginLeft: 4 }]}>
                {user.currentStreak}
              </Text>
            </View>
          </View>
        </View>

        {/* Level Progress */}
        <View style={[styles.levelCard, { backgroundColor: colors.surface }, Shadows.md]}>
          <View style={styles.levelHeader}>
            <View>
              <Text style={[styles.levelTitle, { color: colors.text }]}>
                Level {levelInfo.currentLevel.level}
              </Text>
              <Text style={[styles.levelSubtitle, { color: colors.textSecondary }]}>
                {levelInfo.currentLevel.title}
              </Text>
            </View>
            <View style={styles.levelBadge}>
              <MaterialIcons name="stars" size={32} color={colors.primary} />
            </View>
          </View>

          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              Next Level
            </Text>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
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

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { backgroundColor: colors.surface }, Shadows.sm]}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: `${action.color}20` }]}>
                <MaterialIcons name={action.icon as any} size={48} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Suggestion Card */}
        <View style={[styles.suggestionCard, { backgroundColor: colors.surface }, Shadows.lg]}>
          <View style={styles.suggestionImageContainer}>
            <LinearGradient
              colors={[colors.primary, colors.science]}
              style={styles.suggestionGradient}
            >
              <MaterialIcons name="psychology" size={80} color="#ffffff" />
            </LinearGradient>
          </View>

          <View style={styles.suggestionContent}>
            <View style={styles.aiChip}>
              <MaterialIcons name="auto-awesome" size={14} color={colors.primary} />
              <Text style={[styles.aiChipText, { color: colors.primary }]}>
                AI Suggestion
              </Text>
            </View>

            <Text style={[styles.suggestionTitle, { color: colors.text }]}>
              Continue Learning: The Cell
            </Text>

            <Text style={[styles.suggestionDescription, { color: colors.textSecondary }]}>
              Based on your recent progress in Science, we think you'll love this topic.
              Pick up where you left off!
            </Text>

            <TouchableOpacity
              style={[styles.suggestionButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/lesson/sci-topic-001-lesson-001')}
            >
              <Text style={styles.suggestionButtonText}>Start Learning</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Continue Learning
          </Text>

          {subjects.slice(0, 2).map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={[styles.recentCard, { backgroundColor: colors.surface }, Shadows.sm]}
              onPress={() => router.push(`/subject/${subject.category}`)}
            >
              <View style={[styles.recentIcon, { backgroundColor: `${subject.color}20` }]}>
                <MaterialIcons name={subject.icon as any} size={32} color={subject.color} />
              </View>
              <View style={styles.recentInfo}>
                <Text style={[styles.recentTitle, { color: colors.text }]}>
                  {subject.name}
                </Text>
                <Text style={[styles.recentSubtitle, { color: colors.textSecondary }]}>
                  {subject.totalTopics} topics available
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: Typography.fontSize.sm,
    marginBottom: 2,
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  notificationButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  levelTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  levelSubtitle: {
    fontSize: Typography.fontSize.base,
    marginTop: 2,
  },
  levelBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(19, 164, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  actionLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  suggestionCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  suggestionImageContainer: {
    width: '100%',
    height: 180,
  },
  suggestionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionContent: {
    padding: Spacing.lg,
  },
  aiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(19, 164, 236, 0.1)',
    marginBottom: Spacing.md,
    gap: 4,
  },
  aiChipText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  suggestionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
  },
  suggestionDescription: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    marginBottom: Spacing.lg,
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  suggestionButtonText: {
    color: '#ffffff',
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  recentSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
  recentIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 2,
  },
  recentSubtitle: {
    fontSize: Typography.fontSize.sm,
  },
});
