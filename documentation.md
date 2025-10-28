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
- Custom navigation header with back/close controls (no default navigation)

**Features:**
- Detailed subject descriptions
- Grid layout for core subjects with cards
- Custom header with back navigation and close button
- **No default navigation header** (custom implementation)
- Direct navigation to topic selection (planned feature)

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
- Streak calendar showing daily activity with accurate day tracking
- Badges collection display
- Settings navigation

**Features:**
- Avatar customization options
- Theme toggle between light and dark modes
- Detailed statistics tracking
- Badge showcase with unlock status
- Direct navigation to settings
- **Accurate streak visualization** showing completed days of the current week
- **Real-time streak data** fetched from the database
- **Pull-to-refresh** functionality to update streak information
- **Visual checkmark indicators** showing which days the user was active for at least 3 consecutive minutes

**Streak Visualization:**
The profile page displays a visual calendar showing the user's login activity for the current week. Each day is represented with:
- Day abbreviation (Mon, Tue, Wed, etc.)
- Circular indicator that is colored when the user logged in on that day
- Checkmark icon for completed days
- **Small green checkmark in the bottom-right corner** indicating the user was active for at least 3 consecutive minutes
- **Legend explaining the visual indicators**

The streak calculation accurately tracks consecutive login days and updates the user's current and longest streak values accordingly, ensuring the streak only increments once per calendar day regardless of login frequency.

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
The initial screen for user authentication and registration with enhanced UI/UX.

**Key Components:**
- App branding with gradient header and logo
- Tab switcher for login/register with improved indicator
- Comprehensive registration form with validation
- Modern login form with email/password
- Guest mode access option

**Features:**
- **Enhanced Visual Design** with gradient headers, shadows, and improved spacing
- **Tab-based Navigation** between login and registration with smooth indicator animation
- **Form Validation** with real-time error feedback
- **Password Strength Indicator** with visual feedback
- **Gender Selection** with themed color options
- **Education Level Selection** with grade-specific options
- **Age Restrictions** (10-20 years) with validation
- **Guest Mode** for limited access without registration
- **Responsive Layout** optimized for various screen sizes
- **Animated Feedback** for form errors and interactions
- **Accessibility Features** with proper contrast and readable fonts

**UI Improvements:**
- Modern gradient header with app logo and tagline
- Enhanced input fields with icons and improved styling
- Visual feedback for selected options in gender and education pickers
- Password strength indicator with color-coded feedback
- Consistent spacing and typography throughout
- Shadow effects for depth and visual hierarchy
- Smooth animations for tab switching and error states
- **Fixed tab indicator positioning** for accurate login/register tab highlighting

```
