# STEM Learning App - Complete Build Guide

## 🎯 Current Status

### ✅ Completed (70% of Core Infrastructure)

#### Core Systems
- [x] **Database Layer** (`services/database.ts`)
  - 12 SQLite tables
  - Full CRUD operations
  - Seeded with 20 topics, 40+ lessons, 80+ quiz questions
  - Badge system, leaderboard, streaks
  
- [x] **State Management** (`services/store.ts`)
  - Auth store (login, register, user management)
  - Theme store (light/dark mode)
  - Learning store (subjects, topics, lessons)
  - Quiz store (quiz flow, scoring)
  
- [x] **Type System** (`types/index.ts`)
  - 40+ TypeScript interfaces
  - Type-safe throughout
  
- [x] **Theme System** (`constants/theme.ts`)
  - Color palette (light/dark)
  - Typography system
  - Spacing, shadows, borders
  - XP levels (1-20)
  - Badge requirements
  
- [x] **Navigation** (`app/_layout.tsx`, `app/(tabs)/_layout.tsx`)
  - Expo Router configured
  - Tab navigation
  - Stack navigation
  
#### UI Screens
- [x] **Splash Screen** (`app/index.tsx`)
- [x] **Dashboard** (`app/(tabs)/home.tsx`) - FULLY FUNCTIONAL
- [x] **Learn Screen** (`app/(tabs)/learn.tsx`) - FULLY FUNCTIONAL
- [x] **Button Component** (`components/Button.tsx`)

---

## 🚧 What Needs to Be Built (30% Remaining)

### Priority 1: Essential Screens (Must Have for MVP)

#### 1. Welcome/Auth Screen
**File:** `app/welcome.tsx`  
**Reference:** `assets/PHOTOS/welcome_/_sign_in/code.html`

```typescript
Features Required:
- Tab-based interface (Login / Register)
- Login form (username/email, password)
- Register form (name, age, gender, grade level)
- Avatar selection (male, female, neutral options)
- Form validation
- "Guest Mode" button
- Integration with useAuthStore

Components Needed:
- Input fields with icons
- Password visibility toggle
- Dropdown for gender/grade
- Avatar selector component
- Submit buttons

Data Flow:
1. User fills form
2. Call authStore.register(userData)
3. Creates user in database
4. Stores credentials in SecureStore
5. Navigates to dashboard
```

**Implementation Steps:**
1. Create form state with useState
2. Add validation (age 10-20, required fields)
3. Create avatar selection modal
4. Wire up authStore.register() and authStore.login()
5. Handle errors with Toast/Alert
6. Navigate to `/(tabs)/home` on success

---

#### 2. Quiz Screen
**File:** `app/quiz/[id].tsx`  
**Reference:** `assets/PHOTOS/quiz_page/code.html`

```typescript
Features Required:
- Load quiz by ID
- Display question with progress (2 of 10)
- Multiple choice radio buttons
- Progress bar
- Timer (optional)
- Next/Previous buttons
- Submit quiz button

Components Needed:
- QuestionCard component
- RadioButton component
- ProgressBar component
- Timer component

Data Flow:
1. Get quizId from route params
2. Call quizStore.loadQuiz(quizId)
3. quizStore.startQuiz()
4. Display questions one by one
5. quizStore.answerQuestion(questionId, answerId)
6. quizStore.nextQuestion()
7. quizStore.endQuiz() on last question
8. Navigate to quiz-result with attemptId
```

**Implementation Steps:**
1. Extract quizId from useLocalSearchParams()
2. Load quiz data from quizStore
3. Create question display with options
4. Handle option selection (highlight selected)
5. Implement navigation between questions
6. Add timer countdown (if quiz has timeLimit)
7. Calculate score and save attempt
8. Navigate to results screen

---

#### 3. Quiz Result Screen
**File:** `app/quiz-result.tsx`  
**Reference:** `assets/PHOTOS/quiz_results/code.html`

```typescript
Features Required:
- Display score (e.g., 8/10 correct)
- Show percentage and pass/fail
- XP earned display
- Breakdown of correct/incorrect answers
- Review answers button
- Retry button
- Continue learning button

Data Flow:
1. Get attemptId from route params
2. Load attempt from database
3. Display results
4. Award XP if passed
5. Check and unlock badges
6. Update leaderboard
```

**Implementation Steps:**
1. Fetch quiz attempt data
2. Calculate and display statistics
3. Show confetti animation if passed
4. Display XP earned with animation
5. Show any badges unlocked
6. Add action buttons (Retry, Review, Continue)

---

#### 4. Profile Screen
**File:** `app/(tabs)/profile.tsx`  
**Reference:** `assets/PHOTOS/user_profile_summary/code.html`

```typescript
Features Required:
- User avatar and name
- Level and title (e.g., "Level 12 - Science Whiz")
- Edit avatar button
- XP progress bar to next level
- Stats cards (XP, Badges, Longest Streak)
- Badge grid (showing locked/unlocked)
- Streak calendar (7-day view)
- Theme toggle button
- Settings/Logout button

Components Needed:
- ProfileHeader component
- LevelProgressBar component
- StatCard component
- BadgeGrid component
- StreakCalendar component
- ThemeToggle component
```

**Implementation Steps:**
1. Fetch user data from authStore
2. Fetch badges and achievements
3. Fetch streak data (last 7 days)
4. Calculate level progress
5. Display badges with locked state
6. Implement theme toggle
7. Add edit profile modal
8. Add logout functionality

---

### Priority 2: Additional Screens

#### 5. Topic List Screen
**File:** `app/subject/[category].tsx`

```typescript
Features Required:
- List topics for selected subject
- Show topic card with:
  - Title and description
  - Difficulty badge (Beginner/Intermediate/Advanced)
  - Estimated time (e.g., "30 min")
  - Progress percentage
  - Lock icon if prerequisite not met
- Navigate to lesson or quiz

Data Flow:
1. Get category from params (science/technology/engineering/mathematics)
2. Load topics for subject
3. Load user progress for each topic
4. Check prerequisites
5. Navigate to first lesson or quiz selection
```

---

#### 6. Lesson Screen
**File:** `app/lesson/[id].tsx`  
**Reference:** `assets/PHOTOS/lesson_page/code.html`

```typescript
Features Required:
- Lesson title and description
- Content display (text, images, videos)
- Navigation (previous/next lesson)
- Complete button
- Progress indicator (Lesson X of Y)
- XP reward display
- "Try Quiz" button at end

Data Flow:
1. Get lessonId from params
2. Load lesson data
3. Display content
4. Track time spent
5. On complete: award XP, update progress
6. Navigate to next lesson or quiz
```

---

#### 7. Leaderboard Screen
**File:** `app/(tabs)/leaderboard.tsx` (replace quiz.tsx or add 5th tab)  
**Reference:** `assets/PHOTOS/local_leaderboard/code.html`

```typescript
Features Required:
- Ranked list of users (1st, 2nd, 3rd...)
- Show avatar, name, level, XP
- Highlight current user
- Toggle between Weekly/All-time
- Pull-to-refresh

Data Flow:
1. Load leaderboard from database
2. Get current user's rank
3. Display sorted by XP
4. Highlight current user's row
```

---

#### 8. Achievements Screen
**File:** `app/achievements.tsx`  
**Reference:** `assets/PHOTOS/achievements_&_badges/code.html`

```typescript
Features Required:
- Grid of all badges
- Locked badges (grayscale + lock icon)
- Unlocked badges (full color + checkmark)
- Progress bars for in-progress badges
- Badge detail modal (name, description, requirement)
- Total badges earned count

Data Flow:
1. Load all badges
2. Load user achievements
3. Calculate progress for each badge
4. Display in grid
5. Show modal on badge press
```

---

### Priority 3: Reusable Components

#### Components to Build in `components/` folder:

```typescript
// 1. Card.tsx
export function Card({ children, style, onPress })

// 2. ProgressBar.tsx
export function ProgressBar({ progress, color, height, label })

// 3. CircularProgress.tsx
export function CircularProgress({ percentage, size, color })

// 4. StatCard.tsx
export function StatCard({ label, value, icon, color })

// 5. SubjectCard.tsx
export function SubjectCard({ subject, progress, onPress })

// 6. TopicCard.tsx
export function TopicCard({ topic, progress, locked, onPress })

// 7. BadgeCard.tsx
export function BadgeCard({ badge, unlocked, progress, onPress })

// 8. QuizOption.tsx
export function QuizOption({ option, selected, correct, showFeedback, onSelect })

// 9. StreakCalendar.tsx
export function StreakCalendar({ streaks, currentStreak })

// 10. LevelBadge.tsx
export function LevelBadge({ level, title, size })

// 11. XPDisplay.tsx
export function XPDisplay({ xp, animated })

// 12. ThemeToggle.tsx
export function ThemeToggle({ theme, onToggle })

// 13. EmptyState.tsx
export function EmptyState({ icon, title, description, action })

// 14. LoadingSpinner.tsx
export function LoadingSpinner({ size, color })

// 15. Toast.tsx
export function Toast({ message, type, visible, onHide })
```

---

### Priority 4: Custom Hooks

#### Hooks to Build in `hooks/` folder:

```typescript
// 1. useDatabase.ts
export function useDatabase() {
  // Wrapper for common database operations
}

// 2. useProgress.ts
export function useProgress(userId: string, topicId: string) {
  // Get and update progress
}

// 3. useXP.ts
export function useXP() {
  // XP calculations and level info
}

// 4. useBadges.ts
export function useBadges(userId: string) {
  // Check badge requirements, unlock badges
}

// 5. useStreak.ts
export function useStreak(userId: string) {
  // Manage daily streaks
}

// 6. useQuiz.ts
export function useQuiz(quizId: string) {
  // Simplified quiz management
}

// 7. useTimer.ts
export function useTimer(duration: number, onComplete) {
  // Countdown timer
}

// 8. useAnimation.ts
export function useAnimation() {
  // Reusable animations
}
```

---

### Priority 5: Utilities

#### Utils to Build in `utils/` folder:

```typescript
// 1. formatters.ts
export function formatDate(date: string): string
export function formatDuration(minutes: number): string
export function formatNumber(num: number): string
export function formatXP(xp: number): string

// 2. validators.ts
export function validateEmail(email: string): boolean
export function validateAge(age: number): boolean
export function validateName(name: string): boolean
export function validateGrade(grade: string): boolean

// 3. levelCalculator.ts
export function calculateLevel(xp: number): number
export function getXPForLevel(level: number): number
export function getXPToNextLevel(currentXP: number): number
export function getLevelProgress(xp: number): number

// 4. badgeChecker.ts
export function checkBadgeRequirement(userId: string, badgeId: string): boolean
export function getBadgeProgress(userId: string, badgeId: string): number
export function awardBadge(userId: string, badgeId: string): Promise<void>

// 5. timeUtils.ts
export function getTimeSpent(startTime: number): number
export function formatTimeSpent(seconds: number): string
export function isToday(date: string): boolean
export function getStreakDates(days: number): string[]

// 6. colorUtils.ts
export function hexToRgba(hex: string, alpha: number): string
export function getDifficultyColor(difficulty: string): string
export function getSubjectGradient(category: string): string[]

// 7. animations.ts
export function fadeIn(duration: number): Animated.Value
export function slideUp(duration: number): Animated.Value
export function confetti(): void
export function pulse(): Animated.Value
```

---

## 📋 Development Workflow

### Day 1-2: Welcome Screen
```bash
# Create welcome screen
touch app/welcome.tsx

# Steps:
1. Create form layout (Login/Register tabs)
2. Add input fields with validation
3. Create avatar selection modal
4. Wire up authentication
5. Add error handling
6. Test registration and login flows
7. Ensure navigation to dashboard works
```

### Day 3-4: Quiz Flow
```bash
# Create quiz screens
touch app/quiz/[id].tsx
touch app/quiz-result.tsx

# Steps:
1. Build question display
2. Add multiple choice options
3. Implement quiz state management
4. Add timer (optional)
5. Calculate and save results
6. Build results screen with animations
7. Test complete quiz flow
```

### Day 5-6: Profile & Gamification
```bash
# Create profile screen
touch app/(tabs)/profile.tsx

# Build components:
touch components/BadgeGrid.tsx
touch components/StreakCalendar.tsx
touch components/LevelProgressBar.tsx

# Steps:
1. Build profile header
2. Add stats display
3. Create badge grid
4. Build streak calendar
5. Add theme toggle
6. Implement edit profile
7. Test all profile features
```

### Day 7-8: Topic & Lesson Screens
```bash
# Create topic and lesson screens
touch app/subject/[category].tsx
touch app/lesson/[id].tsx

# Steps:
1. Build topic list view
2. Add prerequisite checking
3. Create lesson viewer
4. Add media support (images)
5. Implement lesson navigation
6. Track progress
7. Test complete learning flow
```

### Day 9-10: Leaderboard & Achievements
```bash
# Create additional screens
touch app/achievements.tsx
# Rename app/(tabs)/quiz.tsx to leaderboard.tsx

# Steps:
1. Build leaderboard view
2. Add ranking algorithm
3. Create achievements screen
4. Build badge detail modal
5. Add progress tracking
6. Test gamification features
```

### Day 11-12: Components & Polish
```bash
# Create all reusable components
mkdir -p components
touch components/{Card,ProgressBar,StatCard,BadgeCard,...}.tsx

# Steps:
1. Build all UI components
2. Add animations
3. Implement error states
4. Add loading indicators
5. Create empty states
6. Test all components
```

### Day 13-14: Testing & Bug Fixes
```bash
# Testing phase
1. Test all user flows
2. Test offline functionality
3. Fix bugs
4. Optimize performance
5. Add error boundaries
6. Test on real devices
```

---

## 🎨 Design Implementation Tips

### Using the Reference Designs

All HTML references in `assets/PHOTOS/` use **Tailwind CSS**. Convert to React Native:

```html
<!-- HTML/Tailwind -->
<div class="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm">
  <p class="text-lg font-bold text-gray-900">Hello</p>
</div>
```

```typescript
// React Native equivalent
<View style={[styles.container, { backgroundColor: colors.surface }, Shadows.sm]}>
  <Text style={[styles.text, { color: colors.text }]}>Hello</Text>
</View>

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  text: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
});
```

### Common Conversions

| Tailwind | React Native StyleSheet |
|----------|------------------------|
| `flex` | `flexDirection: 'row'` |
| `flex-col` | `flexDirection: 'column'` |
| `items-center` | `alignItems: 'center'` |
| `justify-between` | `justifyContent: 'space-between'` |
| `p-4` | `padding: Spacing.lg` |
| `rounded-lg` | `borderRadius: BorderRadius.lg` |
| `text-lg` | `fontSize: Typography.fontSize.lg` |
| `font-bold` | `fontWeight: Typography.fontWeight.bold` |
| `bg-blue-500` | `backgroundColor: Colors.light.primary` |
| `text-gray-900` | `color: colors.text` |

---

## 🔧 Quick Code Templates

### Screen Template
```typescript
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeStore } from '../../services/store';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function MyScreen() {
  const { theme } = useThemeStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;

  useEffect(() => {
    // Load data
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <Text style={[styles.title, { color: colors.text }]}>
          My Screen
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    padding: Spacing.lg,
  },
});
```

### Component Template
```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../services/store';
import { Colors, Typography, Spacing } from '../constants/theme';

interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  const { theme } = useThemeStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: 12,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
});
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Database Not Initialized
```typescript
// Solution: Initialize in _layout.tsx
useEffect(() => {
  database.initialize().then(() => {
    console.log('Database ready');
  });
}, []);
```

### Issue 2: Theme Not Updating
```typescript
// Solution: Always use theme from store
const { theme } = useThemeStore();
const colors = theme === 'dark' ? Colors.dark : Colors.light;
```

### Issue 3: Navigation Not Working
```typescript
// Solution: Use expo-router correctly
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/path'); // Use push, not navigate
```

### Issue 4: Icons Not Showing
```typescript
// Solution: Use MaterialIcons from @expo/vector-icons
import { MaterialIcons } from '@expo/vector-icons';
<MaterialIcons name="home" size={24} color={colors.primary} />
```

---

## ✅ Testing Checklist

### User Flow Testing
- [ ] User can register with valid data
- [ ] User can login with credentials
- [ ] User sees dashboard after login
- [ ] User can browse subjects
- [ ] User can view topics
- [ ] User can read lessons
- [ ] User can take quizzes
- [ ] User earns XP for activities
- [ ] User can view profile
- [ ] User can toggle theme
- [ ] User can view leaderboard
- [ ] User can view achievements
- [ ] Badges unlock automatically
- [ ] Streak updates daily

### Edge Cases
- [ ] Empty states (no progress yet)
- [ ] Network offline (should work)
- [ ] Invalid form inputs
- [ ] Quiz timeout
- [ ] Failed quiz (score < 70%)
- [ ] Level up animation
- [ ] Badge unlock animation
- [ ] Database errors handled
- [ ] App restart preserves data

---

## 🚀 Final Steps

### Before Launch
1. **Test on real devices** (not just emulator)
2. **Test with low-end Android** (performance)
3. **Test offline mode** (airplane mode)
4. **Clear app data and test fresh install**
5. **Test all user journeys end-to-end**
6. **Fix all console warnings**
7. **Run TypeScript check** (`npm run type-check`)
8. **Run linter** (`npm run lint`)

### Build Release
```bash
# Android APK
eas build --platform android --profile preview

# Test APK
adb install path/to/app.apk

# If successful, build production
eas build --platform android --profile production
```

---

## 📚 Additional Resources

- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **Expo Router**: https://docs.expo.dev/router/introduction/
- **Material Icons**: https://fonts.google.com/icons
- **React Navigation**: https://reactnavigation.org/
- **Zustand**: https://zustand-demo.pmnd.rs/

---

## 💡 Pro Tips

1. **Start with one complete flow**: Registration → Dashboard → Learn → Quiz → Profile
2. **Use the reference designs**: Copy the HTML structure, convert to RN
3. **Test frequently**: Run on device after each feature
4. **Use TypeScript**: It will catch bugs early
5. **Keep components small**: Each should do one thing well
6. **Use the stores**: Don't prop drill, use Zustand
7. **Handle loading states**: Always show spinners during data loads
8. **Handle errors gracefully**: Show user-friendly messages
9. **Use constants**: Never hardcode colors, use theme
10. **Comment your code**: Explain complex logic

---

**You've got a solid foundation. Now build something amazing! 🚀**