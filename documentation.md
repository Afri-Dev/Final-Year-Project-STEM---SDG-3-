# STEM Learning App - Comprehensive Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [User Interface Pages](#user-interface-pages)
5. [Core Features](#core-features)
6. [Database Schema](#database-schema)
7. [API Reference](#api-reference)
8. [Installation Instructions](#installation-instructions)
9. [Configuration Details](#configuration-details)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Contributing](#contributing)

## Overview

The STEM Learning App is a comprehensive offline-first educational platform designed for students aged 10-20, with a focus on the Zambian educational context. Built with React Native and Expo, the app provides an engaging learning experience through gamification, adaptive quizzes, and AI-powered recommendations.

### Key Technologies
- **Framework**: React Native with Expo
- **State Management**: Zustand
- **Database**: SQLite with expo-sqlite
- **Navigation**: Expo Router
- **UI Components**: React Native with Material Icons
- **Security**: expo-secure-store for credential storage

## Features

### Core Functionality
- Offline-first architecture with full functionality without internet
- User authentication and profile management
- Four main STEM subject categories: Science, Technology, Engineering, Mathematics
- Interactive lessons with multimedia support
- Adaptive quizzes with multiple-choice questions
- Real-time progress tracking

### Gamification System
- Experience Points (XP) system for completing activities
- 20-level progression system from Beginner to Einstein
- Badge system with achievements for milestones
- Daily streak tracking with rewards
- Local leaderboard for user rankings

### AI Integration
- Recommendation engine for personalized learning paths
- Adaptive difficulty adjustment based on user performance
- Performance analytics to track strengths and weaknesses
- TensorFlow.js integration ready for on-device machine learning

### UI/UX Features
- Light/dark theme with automatic switching
- Material Design icons for clean, modern interface
- Responsive layout optimized for various screen sizes
- Smooth animations for enhanced user experience
- Accessibility features with proper color contrast and readable fonts

## Architecture

### Project Structure
```
stem_learning_app/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation
│   │   ├── home.tsx             # Dashboard
│   │   ├── learn.tsx            # Learning modules
│   │   ├── quiz.tsx             # Quiz section
│   │   ├── leaderboard.tsx      # Leaderboard
│   │   └── profile.tsx          # User profile
│   ├── index.tsx                # Splash screen
│   ├── welcome.tsx              # Welcome/Login
│   ├── settings.tsx             # Settings
│   ├── notifications.tsx        # Notifications
│   ├── subject/[category].tsx   # Subject details
│   ├── lesson/[id].tsx          # Lesson detail
│   ├── quiz/[id].tsx            # Quiz screen
│   └── quiz-result.tsx          # Quiz results
├── components/                   # Reusable UI components
├── services/                     # Business logic
│   ├── database.ts              # SQLite operations
│   └── store.ts                 # Zustand state management
├── constants/                    # App constants
│   └── theme.ts                 # Theme configuration
├── types/                        # TypeScript definitions
├── assets/                       # Images, icons, fonts
└── documentation.md              # This file
```

### State Management
The app uses Zustand for state management with four main stores:
1. **Auth Store**: Manages user authentication and profile data
2. **Theme Store**: Handles light/dark theme preferences
3. **Learning Store**: Manages learning content and progress
4. **Quiz Store**: Handles quiz state and question flow
5. **App Store**: General application state

### Data Flow
1. User interacts with UI components
2. Actions trigger state updates in Zustand stores
3. Stores communicate with database service for persistence
4. Database service handles all SQLite operations
5. UI re-renders based on updated state

## User Interface Pages

### Home Screen (`app/(tabs)/home.tsx`)
The main dashboard that serves as the entry point for users after authentication.

**Key Components:**
- User avatar and welcome message
- Notification bell with badge counter
- Stats cards showing XP points, badges earned, and current streak
- Level progress bar with XP tracking
- AI suggestion card for personalized learning recommendations

**Features:**
- Real-time notification badge showing unread count (displays "5+" for counts > 5)
- Pull-to-refresh functionality to update user data
- Direct navigation to learning content through AI suggestions

### Learn Screen (`app/(tabs)/learn.tsx`)
Displays all available STEM subjects with progress tracking.

**Key Components:**
- Subject cards for Science, Technology, Engineering, and Mathematics
- Progress circles showing completion percentage for each subject
- Topic count displaying the number of core subjects in each category
- Animated transitions when selecting subjects

**Features:**
- Exclusive animation effects on clicked cards
- Accurate core subjects count for each category
- Visual progress indicators with color-coded circles

### Subject Detail Screen (`app/subject/[category].tsx`)
Provides detailed information about a specific subject category.

**Key Components:**
- Subject header with icon and title
- Focus section explaining the subject's core principles
- Core subjects grid displaying individual subject cards
- Back/close navigation controls

**Features:**
- Detailed subject descriptions
- Grid layout for core subjects with cards
- Navigation to topic selection (planned feature)

### Quiz Screen (`app/quiz/[id].tsx`)
Interactive quiz interface for testing knowledge.

**Key Components:**
- Quiz header with progress indicator
- Question display with multiple-choice options
- Navigation controls (previous/next questions)
- Timer for time-limited quizzes

**Features:**
- Multiple-choice question format
- Real-time answer validation
- Time tracking for quiz completion
- Adaptive difficulty based on user performance

### Leaderboard Screen (`app/(tabs)/leaderboard.tsx`)
Displays user rankings based on XP accumulation.

**Key Components:**
- Podium display for top 3 users with medals
- Full ranking list for all users
- User's personal rank card
- Refresh control for updating rankings

**Features:**
- Visual podium representation for top performers
- Personal rank tracking for current user
- Automatic leaderboard updates when XP changes
- Empty state handling for new users

### Profile Screen (`app/(tabs)/profile.tsx`)
User profile management and personal statistics.

**Key Components:**
- User avatar with edit functionality
- Level information and progress tracking
- Stats cards for XP, badges, and streaks
- Streak calendar showing daily activity
- Badges collection display
- Settings navigation

**Features:**
- Avatar customization options
- Theme toggle between light and dark modes
- Detailed statistics tracking
- Badge showcase with unlock status
- Direct navigation to settings

### Settings Screen (`app/settings.tsx`)
Application configuration and user preferences.

**Key Components:**
- Account management section
- Preferences section with theme toggle
- Privacy and security settings
- About section with app information
- Logout functionality

**Features:**
- Profile editing options
- Password change functionality
- Theme switching between light and dark modes
- Notification preferences
- Privacy policy and terms of service access

### Notifications Screen (`app/notifications.tsx`)
Central hub for all user notifications and alerts.

**Key Components:**
- Notification list with read/unread status
- Notification types with appropriate icons
- Action buttons for marking as read or deleting
- Empty state for no notifications

**Features:**
- Real-time notification badge on home screen
- Notification categorization (badges, quizzes, streaks, etc.)
- Mark individual or all notifications as read
- Delete specific notifications or clear all
- Automatic refresh of unread count on home screen

### Welcome Screen (`app/welcome.tsx`)
Initial screen for user authentication and registration.

**Key Components:**
- App branding and introduction
- Login form with email/password
- Registration form for new users
- Age selection with appropriate restrictions

**Features:**
- Secure user authentication
- Registration with validation
- Age-appropriate content filtering
- Gender-based theme customization

## Core Features

### User Authentication
The app implements a secure local authentication system using expo-secure-store for credential storage.

**Registration Process:**
1. User provides name, email, age, gender, and education level
2. Password is securely stored in the database
3. User profile is created with default values
4. Gender-based theme colors are applied

**Login Process:**
1. User enters email and password
2. Credentials are verified against database
3. User session is established
4. Last active timestamp is updated

### Gamification System
The gamification system motivates learning through rewards and recognition.

**XP System:**
- Users earn XP for completing lessons, quizzes, and maintaining streaks
- XP requirements increase with each level
- 20 distinct levels from Beginner to Einstein

**Badge System:**
- Badges are unlocked based on specific achievements
- Progress tracking for badge requirements
- Visual display in user profile

**Streak Tracking:**
- Daily login rewards with XP bonuses
- Weekly streak bonuses for consistent engagement
- Visual calendar display in profile

### Content Management
The app organizes educational content in a hierarchical structure.

**Subject Categories:**
- Science: Physics, Chemistry, Biology, Environmental Science
- Technology: Programming, Web Development, Digital Literacy
- Engineering: Mechanical, Electrical, Civil Engineering
- Mathematics: Algebra, Geometry, Calculus, Statistics

**Content Structure:**
1. Subjects contain multiple topics
2. Topics contain lessons and quizzes
3. Lessons provide educational content
4. Quizzes test knowledge retention

### Progress Tracking
Real-time progress monitoring helps users track their learning journey.

**Tracking Features:**
- Topic completion percentages
- Time spent on each subject
- Last accessed timestamps
- Overall subject progress

### Offline Functionality
All app features work completely offline:
- User authentication
- Content access (lessons, quizzes)
- Progress tracking
- XP and badge systems
- Local leaderboard
- Theme preferences

## Database Schema

### Database Overview
The app uses SQLite for local data storage with 12 main tables to manage all application data.

### Tables and Fields

#### Users Table
Stores user account information and profile data.
```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  password TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  educationLevel TEXT NOT NULL,
  avatarId TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  currentStreak INTEGER DEFAULT 0,
  longestStreak INTEGER DEFAULT 0,
  totalBadges INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  lastActive TEXT NOT NULL,
  theme TEXT DEFAULT 'light',
  themeColor TEXT
);
```

#### Subjects Table
Contains the four main STEM subject categories.
```sql
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  totalTopics INTEGER DEFAULT 0,
  "order" INTEGER DEFAULT 0
);
```

#### Topics Table
Stores learning topics within each subject.
```sql
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  subjectId TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  estimatedMinutes INTEGER DEFAULT 30,
  "order" INTEGER DEFAULT 0,
  prerequisiteTopicIds TEXT,
  FOREIGN KEY (subjectId) REFERENCES subjects(id)
);
```

#### Lessons Table
Contains educational content for each topic.
```sql
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  topicId TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mediaType TEXT,
  mediaUrl TEXT,
  xpReward INTEGER DEFAULT 50,
  "order" INTEGER DEFAULT 0,
  FOREIGN KEY (topicId) REFERENCES topics(id)
);
```

#### Quizzes Table
Stores quiz metadata and settings.
```sql
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  topicId TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  totalQuestions INTEGER DEFAULT 0,
  passingScore INTEGER DEFAULT 70,
  xpReward INTEGER DEFAULT 100,
  timeLimit INTEGER,
  FOREIGN KEY (topicId) REFERENCES topics(id)
);
```

#### Questions Table
Contains quiz questions and answer options.
```sql
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  quizId TEXT NOT NULL,
  questionText TEXT NOT NULL,
  questionType TEXT NOT NULL,
  options TEXT NOT NULL,
  correctAnswerId TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  FOREIGN KEY (quizId) REFERENCES quizzes(id)
);
```

#### Quiz Attempts Table
Tracks user quiz history and performance.
```sql
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  quizId TEXT NOT NULL,
  score INTEGER NOT NULL,
  totalQuestions INTEGER NOT NULL,
  correctAnswers INTEGER NOT NULL,
  timeSpentSeconds INTEGER DEFAULT 0,
  completedAt TEXT NOT NULL,
  answers TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (quizId) REFERENCES quizzes(id)
);
```

#### Badges Table
Stores available achievements in the system.
```sql
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement TEXT NOT NULL,
  xpRequired INTEGER DEFAULT 0
);
```

#### Achievements Table
Tracks badges earned by users.
```sql
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  badgeId TEXT NOT NULL,
  earnedAt TEXT,
  progress INTEGER DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (badgeId) REFERENCES badges(id)
);
```

#### User Progress Table
Manages learning progress tracking.
```sql
CREATE TABLE IF NOT EXISTS user_progress (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  subjectId TEXT NOT NULL,
  topicId TEXT NOT NULL,
  completionPercentage INTEGER DEFAULT 0,
  lastAccessedAt TEXT NOT NULL,
  timeSpentMinutes INTEGER DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (subjectId) REFERENCES subjects(id),
  FOREIGN KEY (topicId) REFERENCES topics(id)
);
```

#### Streaks Table
Records daily streak information.
```sql
CREATE TABLE IF NOT EXISTS streaks (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  date TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  xpEarned INTEGER DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

#### Leaderboard Table
Maintains user rankings based on XP.
```sql
CREATE TABLE IF NOT EXISTS leaderboard (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  userName TEXT NOT NULL,
  avatarId TEXT NOT NULL,
  totalXp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  rank INTEGER DEFAULT 0,
  weeklyXp INTEGER DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

#### Notifications Table
Stores user notifications and alerts.
```sql
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Database Migrations
The app implements a versioned migration system to handle schema changes:
- Version 4: Added authentication columns (email, username, password)
- Version 5: Added educationLevel column
- Version 6: Fixed order column syntax (backticks to double quotes)
- Version 7: Added themeColor column for gender-based themes
- Version 8: Updated educationLevel format
- Version 9: Added notifications table

## API Reference

### Database Service (`services/database.ts`)
The database service provides all data persistence operations for the app.

#### User Management
```typescript
// Create a new user
async createUser(userData: Omit<User, 'id' | 'xp' | 'level' | 'currentStreak' | 'longestStreak' | 'totalBadges' | 'createdAt' | 'lastActive'>, password: string): Promise<User>

// Authenticate user
async authenticateUser(email: string, password: string): Promise<User | null>

// Get current user
async getCurrentUser(): Promise<User | null>

// Get user by ID
async getUser(userId: string): Promise<User | null>

// Update user information
async updateUser(userId: string, updates: Partial<User>): Promise<void>

// Add XP to user
async addXP(userId: string, xp: number): Promise<void>
```

#### Subject Management
```typescript
// Get all subjects
async getAllSubjects(): Promise<Subject[]>

// Get subject by ID
async getSubject(subjectId: string): Promise<Subject | null>
```

#### Topic Management
```typescript
// Get topics by subject
async getTopicsBySubject(subjectId: string): Promise<Topic[]>

// Get topic by ID
async getTopic(topicId: string): Promise<Topic | null>
```

#### Lesson Management
```typescript
// Get lessons by topic
async getLessonsByTopic(topicId: string): Promise<Lesson[]>

// Get lesson by ID
async getLesson(lessonId: string): Promise<Lesson | null>
```

#### Quiz Management
```typescript
// Get quizzes by topic
async getQuizzesByTopic(topicId: string): Promise<Quiz[]>

// Get quiz by ID
async getQuiz(quizId: string): Promise<Quiz | null>

// Get questions by quiz
async getQuestionsByQuiz(quizId: string): Promise<Question[]>

// Save quiz attempt
async saveQuizAttempt(attempt: QuizAttempt): Promise<void>

// Get quiz attempts
async getQuizAttempts(userId: string): Promise<QuizAttempt[]>

// Get quiz attempt by ID
async getQuizAttempt(attemptId: string): Promise<QuizAttempt | null>
```

#### Progress Management
```typescript
// Update user progress
async updateProgress(userId: string, subjectId: string, topicId: string, percentage: number): Promise<void>

// Get user progress
async getProgress(userId: string): Promise<UserProgress[]>
```

#### Streak Management
```typescript
// Update user streak
async updateStreak(userId: string): Promise<void>
```

#### Badge Management
```

#### Leaderboard Management
```typescript
// Update leaderboard
async updateLeaderboard(): Promise<void>

// Get leaderboard entries
async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]>

// Get user rank
async getUserRank(userId: string): Promise<number>
```

#### Notification Management
```typescript
// Create notification
async createNotification(userId: string, title: string, message: string, type: string): Promise<void>

// Get notifications
async getNotifications(userId: string): Promise<any[]>

// Get unread notifications count
async getUnreadNotificationsCount(userId: string): Promise<number>

// Mark notification as read
async markNotificationAsRead(notificationId: string): Promise<void>

// Mark all notifications as read
async markAllNotificationsAsRead(userId: string): Promise<void>

// Delete notification
async deleteNotification(notificationId: string): Promise<void>

// Clear all notifications
async clearAllNotifications(userId: string): Promise<void>
```

### State Management (Zustand Stores)

#### Auth Store (`services/store.ts`)
```typescript
// Initialize authentication
initialize: () => Promise<void>

// User login
login: (email: string, password: string) => Promise<void>

// User registration
register: (userData: Omit<User, 'id' | 'xp' | 'level' | 'currentStreak' | 'longestStreak' | 'totalBadges' | 'createdAt' | 'lastActive'>, password: string) => Promise<void>

// User logout
logout: () => Promise<void>

// Update user information
updateUser: (updates: Partial<User>) => Promise<void>

// Refresh user data
refreshUser: () => Promise<void>
```

#### Theme Store (`services/store.ts`)
```typescript
// Initialize theme
initialize: () => Promise<void>

// Set theme
setTheme: (theme: "light" | "dark") => void

// Toggle theme
toggleTheme: () => void
```

#### Learning Store (`services/store.ts`)
```typescript
// Load subjects
loadSubjects: () => Promise<void>

// Set current subject
setCurrentSubject: (subject: Subject) => void

// Load topics
loadTopics: (subjectId: string) => Promise<void>

// Set current topic
setCurrentTopic: (topic: Topic) => void

// Load lessons
loadLessons: (topicId: string) => Promise<void>

// Set current lesson
setCurrentLesson: (lesson: Lesson) => void

// Update progress
updateProgress: (topicId: string, percentage: number) => Promise<void>

// Load progress
loadProgress: () => Promise<void>

// Complete lesson
completeLesson: (lessonId: string, xpReward: number) => Promise<void>
```

#### Quiz Store (`services/store.ts`)
```typescript
// Load quiz
loadQuiz: (quizId: string) => Promise<void>

// Start quiz
startQuiz: () => void

// Answer question
answerQuestion: (questionId: string, selectedOptionId: string) => void

// Next question
nextQuestion: () => void

// Previous question
previousQuestion: () => void

// End quiz
endQuiz: () => Promise<QuizAttempt | null>

// Reset quiz
resetQuiz: () => void

// Get current question
getCurrentQuestion: () => Question | null
```

## Installation Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup Process

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd stem_learning_app
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Start the Development Server
```bash
npm start
```

#### 4. Run on Device/Emulator

##### For Android:
```bash
npm run android
```

##### For iOS (macOS only):
```bash
npm run ios
```

##### For Web:
```bash
npm run web
```

### Environment Configuration
The app uses a `.env` file for environment variables. Create a `.env` file in the root directory with the following variables:
```
# Environment variables
ENV=development
```

## Configuration Details

### App Configuration (`app.json`)
The app configuration defines core settings for the Expo application.

#### Key Settings
- **Name**: STEM Learning App
- **Slug**: stem-learning-app
- **Version**: 1.0.0
- **Orientation**: Portrait
- **Scheme**: stemlearning
- **iOS Bundle Identifier**: com.stemlearning.app
- **Android Package**: com.stemlearning.app

### Theme Configuration (`constants/theme.ts`)
The theme system provides a consistent design language throughout the app.

#### Color Palette
- **Primary**: `#13a4ec` (Cyan Blue)
- **Background Light**: `#f6f7f8`
- **Background Dark**: `#101c22`
- **Subject Colors**:
  - Science: Blue (`#3b82f6`)
  - Technology: Green (`#22c55e`)
  - Engineering: Purple (`#a855f7`)
  - Mathematics: Red (`#ef4444`)

#### Typography
- **Font Family**: Space Grotesk
- **Font Sizes**: xs (12), sm (14), base (16), lg (18), xl (20), 2xl (24), 3xl (30), 4xl (36)
- **Font Weights**: normal (400), medium (500), semibold (600), bold (700)

#### Spacing System
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 40px
- 3xl: 48px

### Gamification Settings
The gamification system is configured with specific XP requirements and reward values.

#### XP Levels
- Level 1: 0 XP - Beginner
- Level 5: 800 XP - Scientist
- Level 10: 3,800 XP - Master
- Level 15: 9,300 XP - Prodigy
- Level 20: 17,300 XP - Einstein

#### XP Rewards
- Complete Lesson: 50 XP
- Pass Beginner Quiz: 75 XP
- Pass Intermediate Quiz: 100 XP
- Pass Advanced Quiz: 150 XP
- Perfect Quiz Score: +50 XP bonus
- Daily Streak: 25 XP
- Weekly Streak: 100 XP
- Earn Badge: 150 XP

## Troubleshooting Guide

### Common Issues and Solutions

#### Database Initialization Problems
If the database fails to initialize:
```bash
# Clear app data and restart
expo start -c
```

#### Metro Bundler Errors
For bundler-related issues:
```bash
# Clear cache
npm start -- --reset-cache
```

#### Build Failures
If builds are failing:
```bash
# Clean install
rm -rf node_modules
npm install
```

#### Notification Badge Not Updating
Ensure the database service is properly initialized and the notification methods are correctly implemented:
1. Check that `getUnreadNotificationsCount` is called on component mount
2. Verify that `markNotificationAsRead` updates the database correctly
3. Confirm that the home screen refreshes the unread count

#### Leaderboard Not Updating
If leaderboard rankings aren't updating:
1. Check that `updateLeaderboard` is called after XP changes
2. Verify the INSERT OR REPLACE logic in the database method
3. Ensure the leaderboard screen refreshes data on mount

### Debugging Tips
1. Use console.log statements to trace data flow
2. Check the React Native Debugger for state changes
3. Verify database queries in the SQLite debugger
4. Test offline functionality by disabling network connections

## Testing

### Running Tests
Execute the test suite with:
```bash
npm test
```

### Type Checking
Run TypeScript type checking:
```bash
npm run type-check
```

### Linting
Execute code linting:
```bash
npm run lint
```

### Test Coverage
The app includes unit tests for critical components:
- Database service methods
- State management stores
- UI component rendering
- Business logic functions

### Manual Testing
Perform manual testing on:
- User registration and login flows
- Content navigation through subjects and topics
- Quiz completion and scoring
- Progress tracking and XP accumulation
- Badge unlocking and achievement tracking
- Notification system functionality
- Theme switching between light and dark modes

## Deployment

### Building for Production

#### Prerequisites
First, you need to install EAS CLI:
```bash
npm install -g eas-cli
```

Then log in to your Expo account:
```bash
eas login
```

#### Android APK
```bash
eas build --platform android --profile preview
```

#### iOS IPA
```bash
eas build --platform ios --profile preview
```

#### Generate APK Locally
For local builds, you can use:
```bash
eas build --platform android --local
```

#### Development Build
For development builds, you can use:
```bash
npx expo run:android
```

### Release Process
1. Update version numbers in `app.json`
2. Run tests and ensure all pass
3. Create a build using EAS
4. Test the build on target devices
5. Submit to app stores (Google Play, App Store)

### Performance Optimization
- SQLite indexing for fast queries
- Image optimization and lazy loading
- Memoized components
- Zustand for efficient state management
- Offline-first reduces network overhead

## Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use consistent naming conventions
- Write clear, descriptive comments
- Maintain proper error handling
- Ensure code is well-tested

### Reporting Issues
- Use the GitHub issue tracker
- Provide detailed reproduction steps
- Include screenshots when relevant
- Specify device and OS information

---

**STEM Learning App Documentation v1.0.0**
*Built with ❤️ for STEM education*