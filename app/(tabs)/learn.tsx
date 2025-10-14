/**
 * Learn Screen
 * Browse and select subjects and topics for learning
 * Based on: assets/PHOTOS/subject_menu/code.html
 */

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
import { useLearningStore, useThemeStore, useAuthStore } from '../../services/store';
import { Colors, Typography, Spacing, BorderRadius, Shadows, SUBJECT_CONFIG, getColorScheme } from '../../constants/theme';

export default function LearnScreen() {
  const router = useRouter();
  const { subjects, loadSubjects, progress } = useLearningStore();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  // Use gender-based theme for consistent colors
  const colors = getColorScheme(theme === 'dark', user?.gender);

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSubjects();
    setRefreshing(false);
  };

  const getSubjectProgress = (subjectId: string) => {
    // Calculate average progress across all topics in this subject
    // This is a placeholder - implement actual calculation
    return Math.floor(Math.random() * 100);
  };

  const renderProgressCircle = (percentage: number, color: string) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.progressCircleContainer}>
        <View style={styles.progressCircle}>
          <View
            style={[
              styles.progressCircleBackground,
              { borderColor: theme === 'dark' ? colors.border : '#e5e7eb' },
            ]}
          />
          <View
            style={[
              styles.progressCircleFill,
              {
                borderColor: color,
                borderWidth: 3,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressPercentage, { color: colors.text }]}>
          {percentage}%
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Let's learn something new today!
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Subject Cards */}
        <View style={styles.subjectsContainer}>
          {subjects.map((subject) => {
            const config = SUBJECT_CONFIG[subject.category];
            const subjectColor = theme === 'dark' ? config.darkColor : config.color;
            const progressPercentage = getSubjectProgress(subject.id);

            return (
              <TouchableOpacity
                key={subject.id}
                style={[styles.subjectCard, { backgroundColor: colors.surface }, Shadows.sm]}
                onPress={() => router.push(`/subject/${subject.category}`)}
                activeOpacity={0.7}
              >
                <View style={styles.subjectContent}>
                  <View
                    style={[
                      styles.subjectIcon,
                      { backgroundColor: `${subjectColor}20` },
                    ]}
                  >
                    <MaterialIcons
                      name={subject.icon as any}
                      size={32}
                      color={subjectColor}
                    />
                  </View>

                  <View style={styles.subjectInfo}>
                    <Text style={[styles.subjectName, { color: colors.text }]}>
                      {subject.name}
                    </Text>
                    <Text
                      style={[styles.subjectDescription, { color: colors.textSecondary }]}
                      numberOfLines={2}
                    >
                      {subject.description}
                    </Text>
                    <View style={styles.topicsInfo}>
                      <MaterialIcons
                        name="menu-book"
                        size={14}
                        color={colors.textSecondary}
                      />
                      <Text style={[styles.topicsText, { color: colors.textSecondary }]}>
                        {subject.totalTopics} topics
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.progressSection}>
                  <View style={styles.progressInfo}>
                    <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                      Progress
                    </Text>
                    <Text style={[styles.progressValue, { color: subjectColor }]}>
                      {progressPercentage}%
                    </Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: `${subjectColor}20` }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: subjectColor,
                          width: `${progressPercentage}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Stats Section */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface }, Shadows.md]}>
          <Text style={[styles.statsTitle, { color: colors.text }]}>
            Your Learning Journey
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <MaterialIcons name="menu-book" size={28} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Lessons Completed
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="quiz" size={28} color={colors.technology} />
              <Text style={[styles.statValue, { color: colors.text }]}>8</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Quizzes Passed
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="timer" size={28} color={colors.engineering} />
              <Text style={[styles.statValue, { color: colors.text }]}>4.5h</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Time Spent
              </Text>
            </View>
          </View>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl + 20,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  subjectsContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  subjectCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  subjectContent: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  subjectIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  subjectInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  subjectName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 4,
  },
  subjectDescription: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    marginBottom: Spacing.xs,
  },
  topicsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topicsText: {
    fontSize: Typography.fontSize.xs,
  },
  progressSection: {
    marginTop: Spacing.sm,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    fontSize: Typography.fontSize.sm,
  },
  progressValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressCircleContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    width: 64,
    height: 64,
    position: 'relative',
  },
  progressCircleBackground: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
  },
  progressCircleFill: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  progressPercentage: {
    position: 'absolute',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  statsCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statsTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
});
