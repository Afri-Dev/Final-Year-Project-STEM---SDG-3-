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
  const { subjects, loadSubjects } = useLearningStore();
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
    // For now, we'll use a placeholder value
    // In a real implementation, this would come from the progress data
    const progressMap: Record<string, number> = {
      'sci': 75,
      'tech': 50,
      'eng': 25,
      'math': 90,
    };
    return progressMap[subjectId] || 0;
  };

  const renderProgressCircle = (percentage: number, color: string) => {
    const radius = 28;
    const strokeWidth = 3;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
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
                borderWidth: strokeWidth,
                transform: [{ rotate: '-90deg' }],
                borderStyle: 'solid',
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
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Choose a subject to start your learning journey
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
                  </View>

                  {renderProgressCircle(progressPercentage, subjectColor)}
                </View>
              </TouchableOpacity>
            );
          })}
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
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
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
    alignItems: 'center',
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
    color: Colors.light.textSecondary,
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
});