/**
 * Core Type Definitions for STEM Learning App
 * Contains all interfaces, types, and enums used throughout the application
 */

// ==================== User Types ====================

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  age: number;
  gender: "male" | "female";
  educationLevel: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "form1" | "form2" | "form3" | "form4" | "form5" | "none";
  avatarId: string;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalBadges: number;
  createdAt: string;
  lastActive: string;
  theme: "light" | "dark" | "auto";
  themeColor?: string; // Gender-based thematic color
}

export interface UserProgress {
  id: string;
  userId: string;
  subjectId: string;
  topicId: string;
  completionPercentage: number;
  lastAccessedAt: string;
  timeSpentMinutes: number;
}

// ==================== Subject & Topic Types ====================

export type SubjectCategory =
  | "science"
  | "technology"
  | "engineering"
  | "mathematics";

export interface Subject {
  id: string;
  name: string;
  category: SubjectCategory;
  description: string;
  icon: string;
  color: string;
  totalTopics: number;
  order: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  order: number;
  prerequisiteTopicIds?: string[];
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  content: string;
  mediaType?: "image" | "video" | "animation";
  mediaUrl?: string;
  xpReward: number;
  order: number;
}

// ==================== Quiz Types ====================

export type DifficultyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export interface Quiz {
  id: string;
  topicId: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  passingScore: number;
  xpReward: number;
  timeLimit?: number; // in seconds, optional
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  questionType: "multiple_choice" | "true_false" | "fill_blank";
  options: QuestionOption[];
  correctAnswerId: string;
  explanation?: string;
  difficulty: DifficultyLevel;
  order: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

// ==================== Gamification Types ====================

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: SubjectCategory | "general";
  requirement: string;
  xpRequired?: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  progress: number; // 0-100
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  avatarId: string;
  totalXp: number;
  level: number;
  rank: number;
  weeklyXp: number;
}

export interface Streak {
  id: string;
  userId: string;
  date: string; // ISO date string
  completed: boolean;
  xpEarned: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'badge' | 'quiz' | 'streak' | 'lesson' | 'leaderboard' | 'general';
  read: boolean;
  createdAt: string;
}

// ==================== AI Types ====================

export interface AIRecommendation {
  id: string;
  userId: string;
  topicId: string;
  topicTitle: string;
  reason: string;
  confidenceScore: number; // 0-1
  recommendedDifficulty: DifficultyLevel;
  estimatedTime: number;
  createdAt: string;
}

export interface PerformanceMetrics {
  userId: string;
  subjectId: string;
  averageScore: number;
  totalAttempts: number;
  improvementRate: number;
  weakAreas: string[];
  strongAreas: string[];
  suggestedDifficulty: DifficultyLevel;
}

// ==================== Database Types ====================

export interface DatabaseSchema {
  users: User;
  user_progress: UserProgress;
  subjects: Subject;
  topics: Topic;
  lessons: Lesson;
  quizzes: Quiz;
  questions: Question;
  quiz_attempts: QuizAttempt;
  badges: Badge;
  achievements: Achievement;
  streaks: Streak;
  leaderboard: LeaderboardEntry;
  notifications: Notification;
}

// ==================== State Management Types ====================

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
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
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export interface ThemeState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

export interface LearningState {
  currentTopic: Topic | null;
  currentLesson: Lesson | null;
  progress: Record<string, number>; // topicId -> percentage
  setCurrentTopic: (topic: Topic) => void;
  setCurrentLesson: (lesson: Lesson) => void;
  updateProgress: (topicId: string, percentage: number) => void;
}

export interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestion: Question | null;
  questionIndex: number;
  answers: QuizAnswer[];
  timeRemaining: number;
  isQuizActive: boolean;
  startQuiz: (quiz: Quiz) => void;
  answerQuestion: (answer: QuizAnswer) => void;
  nextQuestion: () => void;
  endQuiz: () => Promise<QuizAttempt>;
}

// ==================== Component Props Types ====================

export interface CardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  color?: string;
  progress?: number;
  onPress?: () => void;
  disabled?: boolean;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
}

export interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
  onPress?: () => void;
}

export interface QuestionCardProps {
  question: Question;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  showFeedback?: boolean;
}

// ==================== Navigation Types ====================

export type RootStackParamList = {
  index: undefined;
  welcome: undefined;
  "(tabs)": undefined;
  "lesson/[id]": { id: string };
  "quiz/[id]": { id: string };
  "quiz-result": { attemptId: string };
  "subject/[category]": { category: SubjectCategory };
};

export type TabParamList = {
  home: undefined;
  learn: undefined;
  quiz: undefined;
  profile: undefined;
};

// ==================== Utility Types ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface SortParams {
  field: string;
  order: "asc" | "desc";
}

export interface FilterParams {
  category?: SubjectCategory;
  difficulty?: DifficultyLevel;
  searchTerm?: string;
}

// ==================== Content Management Types ====================

export interface ContentPackage {
  version: string;
  subjects: Subject[];
  topics: Topic[];
  lessons: Lesson[];
  quizzes: Quiz[];
  questions: Question[];
  badges: Badge[];
}

export interface ImportResult {
  success: boolean;
  imported: {
    subjects: number;
    topics: number;
    lessons: number;
    quizzes: number;
    questions: number;
  };
  errors: string[];
}
