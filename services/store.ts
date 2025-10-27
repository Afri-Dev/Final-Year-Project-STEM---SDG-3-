/**
 * Zustand Store for Global State Management
 * Manages authentication, theme, learning state, and quiz state
 */

import { create } from "zustand";
import {
  User,
  Topic,
  Lesson,
  Quiz,
  Question,
  QuizAnswer,
  QuizAttempt,
  Subject,
} from "../types";
import database from "./database";
import * as SecureStore from "expo-secure-store";

// ==================== Auth Store ====================

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionStartTime: number | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    userData: Omit<
      User,
      | "id"
      | "xp"
      | "level"
      | "currentStreak"
      | "longestStreak"
      | "totalBadges"
      | "createdAt"
      | "lastActive"
    >,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  startSession: () => void;
  endSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  sessionStartTime: null,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const user = await database.getCurrentUser();

      if (user) {
        // Update last active
        await database.updateUser(user.id, {
          lastActive: new Date().toISOString(),
        });

        // Check and update streak
        await database.updateStreak(user.id);

        // Refresh user data
        const updatedUser = await database.getCurrentUser();
        set({ user: updatedUser, isAuthenticated: true });
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true });

      // Authenticate user with email and password
      const user = await database.authenticateUser(email, password);

      if (user) {
        // Update last active
        await database.updateUser(user.id, {
          lastActive: new Date().toISOString(),
        });

        // Check and update streak
        await database.updateStreak(user.id);

        // Get updated user data
        const updatedUser = await database.getUser(user.id);
        set({ user: updatedUser, isAuthenticated: true });
        
        // Start session tracking
        set({ sessionStartTime: Date.now() });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData, password) => {
    try {
      set({ isLoading: true });

      // Create user in database with password
      const user = await database.createUser(userData, password);

      // Check and update streak for new user
      await database.updateStreak(user.id);

      set({ user, isAuthenticated: true, sessionStartTime: Date.now() });
    } catch (error: any) {
      console.error("Registration failed:", error);
      
      // Parse and throw more specific error messages
      const errorMessage = error?.message || String(error);
      
      if (errorMessage.includes("UNIQUE constraint")) {
        if (errorMessage.includes("users.email")) {
          throw new Error("Email already exists. This email is already registered.");
        } else if (errorMessage.includes("users.username")) {
          throw new Error("Email already exists. An account with this email already exists.");
        }
        throw new Error("An account with these details already exists.");
      }
      
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      // End session and update streak duration before logout
      const { sessionStartTime, user } = get();
      if (sessionStartTime && user) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
        const today = new Date().toISOString().split('T')[0];
        await database.updateStreakDuration(user.id, today, sessionDuration);
      }
      
      await SecureStore.deleteItemAsync("current_user_id");
      set({ user: null, isAuthenticated: false, sessionStartTime: null });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  updateUser: async (updates) => {
    try {
      const { user } = get();
      if (!user) return;

      await database.updateUser(user.id, updates);
      const updatedUser = await database.getUser(user.id);
      set({ user: updatedUser });
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  },

  refreshUser: async () => {
    try {
      const { user } = get();
      if (!user) return;

      const updatedUser = await database.getUser(user.id);
      set({ user: updatedUser });
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  },

  startSession: () => {
    set({ sessionStartTime: Date.now() });
  },

  endSession: async () => {
    const { sessionStartTime, user } = get();
    if (sessionStartTime && user) {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
      const today = new Date().toISOString().split('T')[0];
      await database.updateStreakDuration(user.id, today, sessionDuration);
      set({ sessionStartTime: null });
    }
  },
}));

// ==================== Theme Store ====================

interface ThemeStore {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  initialize: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "light",

  initialize: async () => {
    try {
      const savedTheme = await SecureStore.getItemAsync("app_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        set({ theme: savedTheme });
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
    }
  },

  setTheme: async (theme) => {
    try {
      await SecureStore.setItemAsync("app_theme", theme);
      set({ theme });

      // Update user preference if logged in
      const authStore = useAuthStore.getState();
      if (authStore.user) {
        await database.updateUser(authStore.user.id, { theme });
      }
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  },

  toggleTheme: () => {
    const { theme, setTheme } = get();
    setTheme(theme === "light" ? "dark" : "light");
  },
}));

// ==================== Learning Store ====================

interface LearningStore {
  subjects: Subject[];
  currentSubject: Subject | null;
  currentTopic: Topic | null;
  currentLesson: Lesson | null;
  topics: Topic[];
  lessons: Lesson[];
  progress: Record<string, number>;
  isLoading: boolean;

  loadSubjects: () => Promise<void>;
  setCurrentSubject: (subject: Subject) => void;
  loadTopics: (subjectId: string) => Promise<void>;
  setCurrentTopic: (topic: Topic) => void;
  loadLessons: (topicId: string) => Promise<void>;
  setCurrentLesson: (lesson: Lesson) => void;
  updateProgress: (topicId: string, percentage: number) => Promise<void>;
  loadProgress: () => Promise<void>;
  completeLesson: (lessonId: string, xpReward: number) => Promise<void>;
}

export const useLearningStore = create<LearningStore>((set, get) => ({
  subjects: [],
  currentSubject: null,
  currentTopic: null,
  currentLesson: null,
  topics: [],
  lessons: [],
  progress: {},
  isLoading: false,

  loadSubjects: async () => {
    try {
      set({ isLoading: true });
      const subjects = await database.getAllSubjects();
      set({ subjects });
    } catch (error) {
      console.error("Failed to load subjects:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentSubject: (subject) => {
    set({ currentSubject: subject });
  },

  loadTopics: async (subjectId) => {
    try {
      set({ isLoading: true });
      const topics = await database.getTopicsBySubject(subjectId);
      set({ topics });
    } catch (error) {
      console.error("Failed to load topics:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentTopic: (topic) => {
    set({ currentTopic: topic });
  },

  loadLessons: async (topicId) => {
    try {
      set({ isLoading: true });
      const lessons = await database.getLessonsByTopic(topicId);
      set({ lessons });
    } catch (error) {
      console.error("Failed to load lessons:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentLesson: (lesson) => {
    set({ currentLesson: lesson });
  },

  updateProgress: async (topicId, percentage) => {
    try {
      const authStore = useAuthStore.getState();
      if (!authStore.user) return;

      const { currentSubject } = get();
      if (!currentSubject) return;

      await database.updateProgress(
        authStore.user.id,
        currentSubject.id,
        topicId,
        percentage,
      );

      // Update local progress state
      set((state) => ({
        progress: {
          ...state.progress,
          [topicId]: percentage,
        },
      }));
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  },

  loadProgress: async () => {
    try {
      const authStore = useAuthStore.getState();
      if (!authStore.user) return;

      const progressData = await database.getProgress(authStore.user.id);
      const progressMap: Record<string, number> = {};

      progressData.forEach((p) => {
        progressMap[p.topicId] = p.completionPercentage;
      });

      set({ progress: progressMap });
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  },

  completeLesson: async (lessonId, xpReward) => {
    try {
      const authStore = useAuthStore.getState();
      if (!authStore.user) return;

      // Add XP
      await database.addXP(authStore.user.id, xpReward);

      // Refresh user data
      await authStore.refreshUser();

      // Update leaderboard
      await database.updateLeaderboard();
    } catch (error) {
      console.error("Failed to complete lesson:", error);
    }
  },
}));

// ==================== Quiz Store ====================

interface QuizStore {
  currentQuiz: Quiz | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  timeRemaining: number;
  startTime: number;
  isQuizActive: boolean;
  isLoading: boolean;

  loadQuiz: (quizId: string) => Promise<void>;
  startQuiz: () => void;
  answerQuestion: (questionId: string, selectedOptionId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  endQuiz: () => Promise<QuizAttempt | null>;
  resetQuiz: () => void;
  getCurrentQuestion: () => Question | null;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentQuiz: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  timeRemaining: 0,
  startTime: 0,
  isQuizActive: false,
  isLoading: false,

  loadQuiz: async (quizId) => {
    try {
      set({ isLoading: true });
      const quiz = await database.getQuiz(quizId);
      const questions = await database.getQuestionsByQuiz(quizId);

      if (quiz && questions) {
        set({
          currentQuiz: quiz,
          questions,
          currentQuestionIndex: 0,
          answers: [],
          timeRemaining: quiz.timeLimit || 0,
          isQuizActive: false,
        });
      }
    } catch (error) {
      console.error("Failed to load quiz:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  startQuiz: () => {
    set({
      isQuizActive: true,
      startTime: Date.now(),
      currentQuestionIndex: 0,
      answers: [],
    });
  },

  answerQuestion: (questionId, selectedOptionId) => {
    const { questions, currentQuestionIndex } = get();
    const question = questions[currentQuestionIndex];

    if (!question) return;

    const isCorrect = question.correctAnswerId === selectedOptionId;
    const answer: QuizAnswer = {
      questionId,
      selectedOptionId,
      isCorrect,
      timeSpentSeconds: 0,
    };

    set((state) => ({
      answers: [...state.answers, answer],
    }));
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  endQuiz: async () => {
    try {
      const { currentQuiz, questions, answers, startTime } = get();
      const authStore = useAuthStore.getState();

      if (!currentQuiz || !authStore.user) return null;

      const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
      const correctAnswers = answers.filter((a) => a.isCorrect).length;
      const score = Math.round((correctAnswers / questions.length) * 100);

      const attempt: QuizAttempt = {
        id: `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: authStore.user.id,
        quizId: currentQuiz.id,
        score,
        totalQuestions: questions.length,
        correctAnswers,
        timeSpentSeconds,
        completedAt: new Date().toISOString(),
        answers,
      };

      // Save attempt to database
      await database.saveQuizAttempt(attempt);

      // Award XP if passed
      if (score >= currentQuiz.passingScore) {
        await database.addXP(authStore.user.id, currentQuiz.xpReward);

        // Bonus XP for perfect score
        if (score === 100) {
          await database.addXP(authStore.user.id, 50);
        }
      }

      // Refresh user data
      await authStore.refreshUser();

      // Update leaderboard
      await database.updateLeaderboard();

      set({ isQuizActive: false });

      return attempt;
    } catch (error) {
      console.error("Failed to end quiz:", error);
      return null;
    }
  },

  resetQuiz: () => {
    set({
      currentQuiz: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: 0,
      startTime: 0,
      isQuizActive: false,
    });
  },

  getCurrentQuestion: () => {
    const { questions, currentQuestionIndex } = get();
    return questions[currentQuestionIndex] || null;
  },
}));

// ==================== App Store (General UI State) ====================

interface AppStore {
  isInitialized: boolean;
  isOnline: boolean;
  notificationCount: number;

  initialize: () => Promise<void>;
  setOnlineStatus: (isOnline: boolean) => void;
  setNotificationCount: (count: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isInitialized: false,
  isOnline: false,
  notificationCount: 0,

  initialize: async () => {
    try {
      // Initialize database
      await database.initialize();

      // Initialize theme
      await useThemeStore.getState().initialize();

      // Initialize auth
      await useAuthStore.getState().initialize();

      // Load subjects
      await useLearningStore.getState().loadSubjects();

      set({ isInitialized: true });
    } catch (error) {
      console.error("Failed to initialize app:", error);
    }
  },

  setOnlineStatus: (isOnline) => {
    set({ isOnline });
  },

  setNotificationCount: (count) => {
    set({ notificationCount: count });
  },
}));

// Add a listener for when the app goes to background/foreground to track session duration
// This would typically be implemented in the app's root component or _layout.tsx
