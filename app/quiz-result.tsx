/**
 * Quiz Result Screen
 * Displays quiz results with score, correct answers, and performance analysis
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore, useThemeStore } from '../services/store';
import database from '../services/database';
import { QuizAttempt } from '../types';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

export default function QuizResultScreen() {
  const { attemptId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        if (!attemptId || typeof attemptId !== 'string') {
          throw new Error('Invalid attempt ID');
        }

        const attemptData = await database.getQuizAttempt(attemptId);
        setAttempt(attemptData);
      } catch (error) {
        console.error('Error fetching quiz attempt:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attemptId]);

  const handleReviewAnswers = () => {
    // TODO: Navigate to answer review screen
    console.log('Review answers');
  };

  const handleRetakeQuiz = () => {
    // TODO: Navigate back to quiz
    router.back();
  };

  const handleGoHome = () => {
    router.replace('/(tabs)/home');
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading results...</Text>
      </View>
    );
  }

  if (!attempt) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Quiz results not found</Text>
      </View>
    );
  }

  const isPassed = attempt.score >= 70; // Assuming 70% is passing
  const percentage = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Quiz Results',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.resultHeader}>
            <MaterialIcons 
              name={isPassed ? "celebration" : "warning"} 
              size={48} 
              color={isPassed ? colors.success : colors.error} 
            />
            <Text style={[styles.resultTitle, { color: colors.text }]}>
              {isPassed ? 'Quiz Passed!' : 'Quiz Failed'}
            </Text>
            <Text style={[styles.resultScore, { color: isPassed ? colors.success : colors.error }]}>
              {attempt.score}%
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{attempt.correctAnswers}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Correct</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{attempt.totalQuestions - attempt.correctAnswers}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Incorrect</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{attempt.totalQuestions}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
            </View>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${percentage}%`,
                  backgroundColor: isPassed ? colors.success : colors.error 
                }
              ]} 
            />
          </View>
          
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {percentage}% Correct Answers
          </Text>
        </View>
        
        <View style={[styles.detailsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Time Spent</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {Math.floor(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Completed</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {new Date(attempt.completedAt).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Status</Text>
            <Text style={[styles.detailValue, { color: isPassed ? colors.success : colors.error }]}>
              {isPassed ? 'Passed' : 'Failed'}
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleReviewAnswers}
        >
          <MaterialIcons name="visibility" size={20} color={colors.text} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>Review Answers</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleRetakeQuiz}
        >
          <MaterialIcons name="refresh" size={20} color={colors.text} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>Retake Quiz</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={handleGoHome}
        >
          <MaterialIcons name="home" size={20} color="#ffffff" />
          <Text style={styles.primaryButtonText}>Go Home</Text>
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
  resultCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  resultTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  resultScore: {
    fontSize: Typography.fontSize["4xl"],
    fontWeight: Typography.fontWeight.bold,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  detailsCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  detailLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
});