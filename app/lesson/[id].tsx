/**
 * Lesson Detail Screen
 * Displays lesson content with interactive elements
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore, useThemeStore } from '../../services/store';
import database from '../../services/database';
import { Lesson, Topic } from '../../types';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        if (!id || typeof id !== 'string') {
          throw new Error('Invalid lesson ID');
        }

        const lessonData = await database.getLesson(id);
        if (!lessonData) {
          throw new Error('Lesson not found');
        }

        const topicData = await database.getTopic(lessonData.topicId);
        if (!topicData) {
          throw new Error('Topic not found');
        }

        setLesson(lessonData);
        setTopic(topicData);
      } catch (error) {
        console.error('Error fetching lesson:', error);
        Alert.alert('Error', 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleCompleteLesson = async () => {
    if (!user || !lesson || !topic) return;

    try {
      // Award XP for completing lesson
      await database.addXP(user.id, lesson.xpReward);
      
      // Update progress
      await database.updateProgress(user.id, topic.subjectId, topic.id, 100);
      
      // Refresh user data
      useAuthStore.getState().refreshUser();
      
      Alert.alert(
        'Lesson Completed!',
        `You earned ${lesson.xpReward} XP for completing this lesson.`,
        [{ text: 'Continue', onPress: () => {} }]
      );
    } catch (error) {
      console.error('Error completing lesson:', error);
      Alert.alert('Error', 'Failed to complete lesson');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading lesson...</Text>
      </View>
    );
  }

  if (!lesson || !topic) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Lesson not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: lesson.title,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.topicTitle, { color: colors.textSecondary }]}>{topic.title}</Text>
          <Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson.title}</Text>
          
          <View style={styles.lessonInfo}>
            <View style={styles.infoItem}>
              <MaterialIcons name="timer" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {lesson.xpReward} XP
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.lessonContent}>
          <Text style={[styles.contentText, { color: colors.text }]}>
            {lesson.content}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.completeButton, { backgroundColor: colors.primary }]}
          onPress={handleCompleteLesson}
        >
          <MaterialIcons name="check" size={20} color="#ffffff" />
          <Text style={styles.completeButtonText}>Complete Lesson</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  loadingText: {
    fontSize: Typography.fontSize.lg,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.fontSize.lg,
    textAlign: 'center',
    marginTop: Spacing.xl,
    color: '#ef4444',
  },
  header: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  topicTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  lessonTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  lessonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  lessonContent: {
    marginBottom: Spacing.xl,
  },
  contentText: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * 1.6,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.lg,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
});