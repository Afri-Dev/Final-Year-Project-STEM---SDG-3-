/**
 * Subject Detail Screen
 * Displays detailed information about a specific subject
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useLearningStore, useThemeStore, useAuthStore } from '../../services/store';
import { Colors, Typography, Spacing, BorderRadius, Shadows, SUBJECT_CONFIG, getColorScheme } from '../../constants/theme';

// Detailed subject information
const SUBJECT_DETAILS: Record<string, { focus: string; coreSubjects: string[] }> = {
  science: {
    focus: 'Understanding natural phenomena through observation and experimentation.',
    coreSubjects: [
      'Physics',
      'Chemistry',
      'Biology',
      'Environmental Science',
      'Earth Science (Geology, Meteorology, Oceanography)',
      'Astronomy',
      'Anatomy and Physiology',
      'Ecology',
      'Forensic Science',
      'Agricultural Science'
    ]
  },
  technology: {
    focus: 'Using scientific knowledge to create tools, systems, and digital solutions.',
    coreSubjects: [
      'Computer Science',
      'Information and Communication Technology (ICT)',
      'Software Engineering',
      'Artificial Intelligence (AI)',
      'Data Science',
      'Robotics',
      'Cybersecurity',
      'Web and Mobile App Development',
      'Game Design and Development',
      'Digital Media and Animation',
      'Networking and Cloud Computing'
    ]
  },
  engineering: {
    focus: 'Designing, building, and maintaining systems, structures, and machines.',
    coreSubjects: [
      'Mechanical Engineering',
      'Civil Engineering',
      'Electrical and Electronic Engineering',
      'Computer Engineering',
      'Chemical Engineering',
      'Industrial and Systems Engineering',
      'Mechatronics',
      'Biomedical Engineering',
      'Environmental Engineering',
      'Aerospace Engineering',
      'Structural Engineering'
    ]
  },
  mathematics: {
    focus: 'Abstract reasoning, logic, and quantitative analysis.',
    coreSubjects: [
      'Algebra',
      'Geometry',
      'Trigonometry',
      'Calculus',
      'Statistics and Probability',
      'Discrete Mathematics',
      'Linear Algebra',
      'Mathematical Modeling',
      'Applied Mathematics',
      'Computational Mathematics',
      'Operations Research'
    ]
  }
};

// Subject descriptions
const SUBJECT_DESCRIPTIONS: Record<string, string> = {
  science: 'Explore biology, chemistry, physics, and earth science',
  technology: 'Learn programming, web development, and digital literacy',
  engineering: 'Discover mechanical, electrical, and civil engineering',
  mathematics: 'Master algebra, geometry, calculus, and statistics'
};

export default function SubjectDetailScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const { subjects } = useLearningStore();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const colors = getColorScheme(theme === 'dark', user?.gender);

  // Find the subject based on category
  const subject = subjects.find(s => s.category === category) || {
    name: SUBJECT_CONFIG[category as keyof typeof SUBJECT_CONFIG]?.name || 'Unknown Subject',
    category: category || 'science',
    description: SUBJECT_DESCRIPTIONS[category || 'science'] || 'Subject details not available',
    icon: SUBJECT_CONFIG[category as keyof typeof SUBJECT_CONFIG]?.icon || 'school',
    id: 'unknown',
    color: '#3b82f6',
    totalTopics: 0,
    order: 0
  };

  const subjectConfig = SUBJECT_CONFIG[category as keyof typeof SUBJECT_CONFIG] || SUBJECT_CONFIG.science;
  const subjectColor = theme === 'dark' ? subjectConfig.darkColor : subjectConfig.color;
  const subjectDetails = SUBJECT_DETAILS[category || 'science'] || SUBJECT_DETAILS.science;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/learn')}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.subjectHeader}>
          <View
            style={[
              styles.subjectIcon,
              { backgroundColor: `${subjectColor}20` },
            ]}
          >
            <MaterialIcons
              name={subject.icon as any}
              size={40}
              color={subjectColor}
            />
          </View>
          <Text style={[styles.subjectTitle, { color: colors.text }]}>
            {subject.name}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Focus Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }, Shadows.sm]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Focus
          </Text>
          <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
            {subjectDetails.focus}
          </Text>
        </View>

        {/* Core Subjects Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }, Shadows.sm]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Core Subjects
          </Text>
          <View style={styles.coreSubjectsGrid}>
            {subjectDetails.coreSubjects.map((coreSubject: string, index: number) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.coreSubjectCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => {
                  // TODO: Navigate to topic selection for this core subject
                  console.log('Selected core subject:', coreSubject);
                }}
              >
                <View style={[styles.coreSubjectIcon, { backgroundColor: `${subjectColor}20` }]}>
                  <MaterialIcons name="book" size={20} color={subjectColor} />
                </View>
                <Text style={[styles.coreSubjectText, { color: colors.text }]} numberOfLines={2}>
                  {coreSubject}
                </Text>
              </TouchableOpacity>
            ))}
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
    paddingBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  subjectHeader: {
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
  subjectTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  sectionContent: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  coreSubjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  coreSubjectCard: {
    width: '48%', // Two cards per row with some gap
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  coreSubjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  coreSubjectText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
});