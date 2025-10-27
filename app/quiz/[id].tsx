/**
 * Quiz Screen
 * Interactive quiz taking interface with timer and navigation
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore, useThemeStore } from '../../services/store';
import database from '../../services/database';
import { Quiz, Question, QuizAnswer } from '../../types';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!id || typeof id !== 'string') {
          throw new Error('Invalid quiz ID');
        }

        const quizData = await database.getQuiz(id);
        if (!quizData) {
          throw new Error('Quiz not found');
        }

        const questionsData = await database.getQuestionsByQuiz(id);
        if (!questionsData.length) {
          throw new Error('No questions found for this quiz');
        }

        setQuiz(quizData);
        setQuestions(questionsData);
        setTimeRemaining(quizData.timeLimit || 600); // Default 10 minutes
      } catch (error) {
        console.error('Error fetching quiz:', error);
        Alert.alert('Error', 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (!quiz || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, timeRemaining]);

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    if (selectedOption && currentQuestionIndex < questions.length - 1) {
      // Save answer
      const newAnswer: QuizAnswer = {
        questionId: questions[currentQuestionIndex].id,
        selectedOptionId: selectedOption,
        isCorrect: questions[currentQuestionIndex].options.find(
          opt => opt.id === selectedOption
        )?.isCorrect || false,
        timeSpentSeconds: 0, // TODO: Implement timing
      };

      setAnswers([...answers, newAnswer]);
      setSelectedOption(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // TODO: Handle answer navigation
    }
  };

  const handleSubmitQuiz = async () => {
    if (!user || !quiz) return;

    try {
      // Save final answer if there's one
      if (selectedOption) {
        const newAnswer: QuizAnswer = {
          questionId: questions[currentQuestionIndex].id,
          selectedOptionId: selectedOption,
          isCorrect: questions[currentQuestionIndex].options.find(
            opt => opt.id === selectedOption
          )?.isCorrect || false,
          timeSpentSeconds: 0, // TODO: Implement timing
        };

        setAnswers([...answers, newAnswer]);
      }

      // Calculate score
      const correctAnswers = answers.filter(a => a.isCorrect).length + 
        (selectedOption && questions[currentQuestionIndex].options.find(
          opt => opt.id === selectedOption
        )?.isCorrect ? 1 : 0);
      
      const score = Math.round((correctAnswers / questions.length) * 100);

      // Create quiz attempt
      const attempt: any = {
        id: `attempt-${Date.now()}`,
        userId: user.id,
        quizId: quiz.id,
        score,
        totalQuestions: questions.length,
        correctAnswers,
        timeSpentSeconds: quiz.timeLimit ? quiz.timeLimit - timeRemaining : 0,
        completedAt: new Date().toISOString(),
        answers: [...answers, selectedOption ? {
          questionId: questions[currentQuestionIndex].id,
          selectedOptionId: selectedOption,
          isCorrect: questions[currentQuestionIndex].options.find(
            opt => opt.id === selectedOption
          )?.isCorrect || false,
          timeSpentSeconds: 0,
        } : null].filter(Boolean),
      };

      await database.saveQuizAttempt(attempt);

      // Award XP if passed
      if (score >= quiz.passingScore) {
        await database.addXP(user.id, quiz.xpReward);
        useAuthStore.getState().refreshUser();
      }

      // Navigate to results
      router.push({
        pathname: '/quiz-result',
        params: { attemptId: attempt.id }
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Alert.alert('Error', 'Failed to submit quiz');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading quiz...</Text>
      </View>
    );
  }

  if (!quiz || !questions.length) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Quiz not found</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: quiz.title,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }} 
      />
      
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.questionCounter, { color: colors.textSecondary }]}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          {quiz.timeLimit && (
            <View style={styles.timer}>
              <MaterialIcons name="timer" size={16} color={timeRemaining < 60 ? '#ef4444' : colors.textSecondary} />
              <Text style={[styles.timerText, { color: timeRemaining < 60 ? '#ef4444' : colors.textSecondary }]}>
                {formatTime(timeRemaining)}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={[styles.questionText, { color: colors.text }]}>
          {currentQuestion.questionText}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                {
                  backgroundColor: selectedOption === option.id ? colors.primary : colors.surface,
                  borderColor: selectedOption === option.id ? colors.primary : colors.border,
                },
              ]}
              onPress={() => handleSelectOption(option.id)}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.optionCircle,
                  { 
                    backgroundColor: selectedOption === option.id ? '#ffffff' : 'transparent',
                    borderColor: selectedOption === option.id ? '#ffffff' : colors.textSecondary,
                  }
                ]}>
                  {selectedOption === option.id && (
                    <MaterialIcons name="check" size={16} color={colors.primary} />
                  )}
                </View>
                <Text style={[
                  styles.optionText,
                  { color: selectedOption === option.id ? '#ffffff' : colors.text }
                ]}>
                  {option.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
            <Text style={[styles.navButtonText, { color: colors.text }]}>Previous</Text>
          </TouchableOpacity>

          {currentQuestionIndex < questions.length - 1 ? (
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: colors.primary }]}
              onPress={handleNextQuestion}
              disabled={!selectedOption}
            >
              <Text style={styles.navButtonText}>Next</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmitQuiz}
              disabled={!selectedOption}
            >
              <Text style={styles.navButtonText}>Submit Quiz</Text>
              <MaterialIcons name="send" size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
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
    borderBottomWidth: 1,
    padding: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  questionCounter: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timerText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  questionText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  optionsContainer: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  option: {
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    padding: Spacing.lg,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  navButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: '#ffffff',
  },
});