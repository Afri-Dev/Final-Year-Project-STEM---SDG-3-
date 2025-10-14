/**
 * Theme Constants for STEM Learning App
 * Defines color palette, typography, spacing, and theme configurations
 */

// ==================== Color Palette ====================

export const Colors = {
  light: {
    primary: '#13a4ec',
    primaryLight: '#13a4ec33', // 20% opacity
    primaryDark: '#0f8bc9',
    background: '#f6f7f8',
    surface: '#ffffff',
    text: '#111618',
    textSecondary: '#617c89',
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',

    // Subject Colors
    science: '#3b82f6',
    technology: '#22c55e',
    engineering: '#a855f7',
    mathematics: '#ef4444',

    // UI Elements
    card: '#ffffff',
    overlay: '#00000080',
    disabled: '#d1d5db',
    divider: '#f0f3f4',
    placeholder: '#9ca3af',
  },
  dark: {
    primary: '#13a4ec',
    primaryLight: '#13a4ec33', // 20% opacity
    primaryDark: '#0f8bc9',
    background: '#101c22',
    surface: '#1a2830',
    text: '#ffffff',
    textSecondary: '#94a3b8',
    border: '#334155',
    error: '#f87171',
    success: '#4ade80',
    warning: '#fbbf24',
    info: '#60a5fa',

    // Subject Colors
    science: '#60a5fa',
    technology: '#4ade80',
    engineering: '#c084fc',
    mathematics: '#f87171',

    // UI Elements
    card: '#1e293b',
    overlay: '#000000cc',
    disabled: '#475569',
    divider: '#334155',
    placeholder: '#64748b',
  },
};

// ==================== Gender-Based Theme Colors ====================

export const GenderThemeColors = {
  male: {
    primary: '#13a4ec',
    primaryLight: '#13a4ec33',
    primaryDark: '#0f8bc9',
  },
  female: {
    primary: '#FF48E3',
    primaryLight: '#FF48E333',
    primaryDark: '#E03CCB',
  },
  default: {
    primary: '#13a4ec',
    primaryLight: '#13a4ec33',
    primaryDark: '#0f8bc9',
  },
};

// ==================== Typography ====================

export const Typography = {
  fontFamily: {
    display: 'SpaceGrotesk-Regular',
    displayBold: 'SpaceGrotesk-Bold',
    displayMedium: 'SpaceGrotesk-Medium',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ==================== Spacing ====================

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

// ==================== Border Radius ====================

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// ==================== Shadows ====================

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
};

// ==================== Gamification Constants ====================

export const XP_LEVELS = [
  { level: 1, xpRequired: 0, title: 'Beginner' },
  { level: 2, xpRequired: 100, title: 'Learner' },
  { level: 3, xpRequired: 250, title: 'Explorer' },
  { level: 4, xpRequired: 500, title: 'Scholar' },
  { level: 5, xpRequired: 800, title: 'Scientist' },
  { level: 6, xpRequired: 1200, title: 'Researcher' },
  { level: 7, xpRequired: 1700, title: 'Expert' },
  { level: 8, xpRequired: 2300, title: 'Innovator' },
  { level: 9, xpRequired: 3000, title: 'Pioneer' },
  { level: 10, xpRequired: 3800, title: 'Master' },
  { level: 11, xpRequired: 4700, title: 'Genius' },
  { level: 12, xpRequired: 5700, title: 'Legend' },
  { level: 13, xpRequired: 6800, title: 'Sage' },
  { level: 14, xpRequired: 8000, title: 'Virtuoso' },
  { level: 15, xpRequired: 9300, title: 'Prodigy' },
  { level: 16, xpRequired: 10700, title: 'Luminary' },
  { level: 17, xpRequired: 12200, title: 'Visionary' },
  { level: 18, xpRequired: 13800, title: 'Oracle' },
  { level: 19, xpRequired: 15500, title: 'Titan' },
  { level: 20, xpRequired: 17300, title: 'Einstein' },
];

export const XP_REWARDS = {
  lessonComplete: 50,
  quizPassBeginner: 75,
  quizPassIntermediate: 100,
  quizPassAdvanced: 150,
  quizPassExpert: 200,
  perfectQuiz: 50, // bonus for 100% score
  dailyStreak: 25,
  weeklyStreak: 100,
  badgeEarned: 150,
  topicComplete: 200,
  subjectComplete: 500,
};

export const BADGE_REQUIREMENTS = {
  scienceBasics: { xp: 500, subject: 'science' },
  techWizard: { xp: 500, subject: 'technology' },
  engineeringPro: { xp: 500, subject: 'engineering' },
  mathMaster: { xp: 500, subject: 'mathematics' },
  firstQuiz: { quizCount: 1 },
  quizMarathon: { quizCount: 50 },
  perfectScore: { perfectQuizzes: 1 },
  weekStreak: { streakDays: 7 },
  monthStreak: { streakDays: 30 },
  speedLearner: { lessonsInDay: 5 },
  earlyBird: { xp: 100 }, // Activity before 9 AM
  nightOwl: { xp: 100 }, // Activity after 9 PM
};

// ==================== Subject Configurations ====================

export const SUBJECT_CONFIG = {
  science: {
    name: 'Science',
    icon: 'science',
    color: '#3b82f6',
    darkColor: '#60a5fa',
    gradient: ['#3b82f6', '#2563eb'],
  },
  technology: {
    name: 'Technology',
    icon: 'devices',
    color: '#22c55e',
    darkColor: '#4ade80',
    gradient: ['#22c55e', '#16a34a'],
  },
  engineering: {
    name: 'Engineering',
    icon: 'engineering',
    color: '#a855f7',
    darkColor: '#c084fc',
    gradient: ['#a855f7', '#9333ea'],
  },
  mathematics: {
    name: 'Mathematics',
    icon: 'calculate',
    color: '#ef4444',
    darkColor: '#f87171',
    gradient: ['#ef4444', '#dc2626'],
  },
};

// ==================== Animation Durations ====================

export const AnimationDuration = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// ==================== Quiz Settings ====================

export const QUIZ_SETTINGS = {
  defaultTimePerQuestion: 60, // seconds
  passingScore: 70, // percentage
  questionsPerQuiz: 10,
  showExplanation: true,
  allowRetry: true,
  maxRetries: 3,
};

// ==================== App Configuration ====================

export const APP_CONFIG = {
  version: '1.0.0',
  databaseVersion: 1,
  minAge: 10,
  maxAge: 20,
  offlineMode: true,
  enableAI: true,
  enableSpeech: false,
  enableHaptics: true,
  autoSave: true,
  autoSaveInterval: 30000, // 30 seconds
};

// ==================== Icon Mapping ====================

export const ICON_MAP = {
  // Material Symbols
  home: 'home',
  learn: 'school',
  quiz: 'quiz',
  profile: 'person',
  leaderboard: 'leaderboard',
  badges: 'emoji_events',
  streak: 'local_fire_department',
  settings: 'settings',
  notifications: 'notifications',
  search: 'search',
  close: 'close',
  back: 'arrow_back',
  forward: 'arrow_forward',
  check: 'check',
  info: 'info',
  help: 'help',
  edit: 'edit',
  delete: 'delete',
  visibility: 'visibility',
  visibilityOff: 'visibility_off',
  darkMode: 'dark_mode',
  lightMode: 'light_mode',

  // Subjects
  science: 'science',
  technology: 'devices',
  engineering: 'engineering',
  mathematics: 'calculate',

  // Badges
  biology: 'biotech',
  physics: 'bolt',
  chemistry: 'science',
  earth: 'public',
  space: 'rocket_launch',
};

// ==================== Helper Functions ====================

export const getColorScheme = (isDark: boolean, gender?: 'male' | 'female') => {
  const baseColors = isDark ? Colors.dark : Colors.light;
  
  // Apply gender-based theme colors
  if (gender === 'female') {
    return {
      ...baseColors,
      primary: GenderThemeColors.female.primary,
      primaryLight: GenderThemeColors.female.primaryLight,
      primaryDark: GenderThemeColors.female.primaryDark,
    };
  } else if (gender === 'male') {
    return {
      ...baseColors,
      primary: GenderThemeColors.male.primary,
      primaryLight: GenderThemeColors.male.primaryLight,
      primaryDark: GenderThemeColors.male.primaryDark,
    };
  }
  
  return baseColors;
};

export const getPrimaryColorForGender = (gender: 'male' | 'female' | string): string => {
  if (gender === 'female') {
    return GenderThemeColors.female.primary;
  } else if (gender === 'male') {
    return GenderThemeColors.male.primary;
  }
  return GenderThemeColors.default.primary;
};

export const getLevelInfo = (xp: number) => {
  let currentLevel = XP_LEVELS[0];
  let nextLevel = XP_LEVELS[1];

  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].xpRequired) {
      currentLevel = XP_LEVELS[i];
      nextLevel = XP_LEVELS[i + 1] || XP_LEVELS[i];
      break;
    }
  }

  return {
    currentLevel,
    nextLevel,
    progress: nextLevel.xpRequired > currentLevel.xpRequired
      ? ((xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100
      : 100,
  };
};

export const getSubjectColor = (category: string, isDark: boolean) => {
  const config = SUBJECT_CONFIG[category as keyof typeof SUBJECT_CONFIG];
  return config ? (isDark ? config.darkColor : config.color) : Colors.light.primary;
};

export const getDifficultyColor = (difficulty: string, isDark: boolean) => {
  const colors = isDark ? Colors.dark : Colors.light;
  switch (difficulty) {
    case 'beginner':
      return colors.success;
    case 'intermediate':
      return colors.warning;
    case 'advanced':
      return colors.error;
    case 'expert':
      return colors.engineering;
    default:
      return colors.primary;
  }
};
