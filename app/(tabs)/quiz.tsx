/**
 * Quiz Tab Screen (Placeholder)
 * Browse available quizzes and start quiz sessions
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
import { useThemeStore } from '../../services/store';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function QuizScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;

  const quizCategories = [
    { id: 1, name: 'Science Quizzes', icon: 'science', color: colors.science, count: 12 },
    { id: 2, name: 'Technology Quizzes', icon: 'devices', color: colors.technology, count: 10 },
    { id: 3, name: 'Engineering Quizzes', icon: 'engineering', color: colors.engineering, count: 8 },
    { id: 4, name: 'Math Quizzes', icon: 'calculate', color: colors.mathematics, count: 15 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Test Your Knowledge
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Challenge yourself with quizzes
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface }, Shadows.md]}>
          <Text style={[styles.statsTitle, { color: colors.text }]}>
            Your Quiz Stats
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>24</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Completed
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>18</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Passed
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.warning }]}>75%</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Avg Score
              </Text>
            </View>
          </View>
        </View>

        {/* Quiz Categories */}
        <View style={styles.categoriesContainer}>
          {quizCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: colors.surface }, Shadows.sm]}
              onPress={() => {
                // Navigate to quiz list for this category
                router.push(`/quiz-list/${category.id}`);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                <MaterialIcons name={category.icon as any} size={40} color={category.color} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, { color: colors.text }]}>
                  {category.name}
                </Text>
                <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                  {category.count} quizzes available
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Coming Soon Card */}
        <View style={[styles.comingSoonCard, { backgroundColor: colors.primaryLight }]}>
          <MaterialIcons name="construction" size={48} color={colors.primary} />
          <Text style={[styles.comingSoonTitle, { color: colors.primary }]}>
            Quiz List Coming Soon!
          </Text>
          <Text style={[styles.comingSoonText, { color: colors.text }]}>
            Build the quiz list and quiz detail screens to unlock this feature.
          </Text>
          <Text style={[styles.comingSoonHint, { color: colors.textSecondary }]}>
            See BUILD_GUIDE.md for instructions
          </Text>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
  },
  scrollView: {
    flex: 1,
  },
  statsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  statsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  categoryIcon: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: Typography.fontSize.sm,
  },
  comingSoonCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  comingSoonTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  comingSoonText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  comingSoonHint: {
    fontSize: Typography.fontSize.sm,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
