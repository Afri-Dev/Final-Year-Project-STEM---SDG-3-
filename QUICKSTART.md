# STEM Learning App - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check
```bash
node --version  # Should be v16+
npm --version   # Should be 8+
```

### Step 1: Install Dependencies
```bash
cd stem_learning_app
npm install
```

### Step 2: Start Development Server
```bash
npm start
```

### Step 3: Run on Device
- **Android**: Press `a` in terminal or run `npm run android`
- **iOS**: Press `i` in terminal or run `npm run ios`
- **Web**: Press `w` in terminal or run `npm run web`

## 📱 First Time User Flow

1. **Splash Screen** → Loads for 2.5 seconds
2. **Welcome Screen** → Sign up or log in
3. **Dashboard** → View XP, badges, streaks
4. **Learn** → Browse subjects and topics
5. **Quiz** → Test your knowledge
6. **Profile** → Track progress and achievements

## 🎯 What's Already Built

### ✅ Core Infrastructure
- [x] TypeScript types and interfaces (`types/index.ts`)
- [x] Theme system with light/dark modes (`constants/theme.ts`)
- [x] SQLite database service (`services/database.ts`)
  - 12 database tables
  - Seeded with 20 topics across 4 subjects
  - 40+ sample lessons and quizzes
- [x] Zustand state management (`services/store.ts`)
  - Auth store
  - Theme store
  - Learning store
  - Quiz store
- [x] Expo Router layout (`app/_layout.tsx`)
- [x] Splash screen (`app/index.tsx`)

### ✅ UI Components
- [x] Button component (`components/Button.tsx`)

### ✅ Database Content
- **4 Subjects**: Science, Technology, Engineering, Mathematics
- **20 Topics**: 5 per subject (e.g., "The Cell", "Forces and Motion")
- **20+ Lessons**: Introduction lessons for each topic
- **40+ Quiz Questions**: Sample questions for each topic
- **8 Badges**: Achievements to unlock

## 🔨 What Needs to Be Built

### Priority 1: Core Screens (Required for MVP)

#### 1. Welcome/Login Screen (`app/welcome.tsx`)
```typescript
// Based on: assets/PHOTOS/welcome_/_sign_in/code.html
Features needed:
- Tab switching (Login/Register)
- Form validation
- Local authentication
- Avatar selection
- Guest mode option
```

#### 2. Dashboard (`app/(tabs)/home.tsx`)
```typescript
// Based on: assets/PHOTOS/home_screen_dashboard/code.html
Features needed:
- XP, Badges, Streak display (3 stat cards)
- Quick action cards (Learn, Quiz, Leaderboard, Profile)
- AI suggestion card
- Bottom tab navigation
```

#### 3. Subject Menu (`app/(tabs)/learn.tsx`)
```typescript
// Based on: assets/PHOTOS/subject_menu/code.html
Features needed:
- Subject cards with progress circles
- Color-coded by subject (Science=blue, Tech=green, etc.)
- Navigate to topic list
```

#### 4. Quiz Screen (`app/quiz/[id].tsx`)
```typescript
// Based on: assets/PHOTOS/quiz_page/code.html
Features needed:
- Question display
- Multiple choice options
- Progress bar (Question X of Y)
- Timer (optional)
- Next button
```

#### 5. Profile Screen (`app/(tabs)/profile.tsx`)
```typescript
// Based on: assets/PHOTOS/user_profile_summary/code.html
Features needed:
- Avatar and user info
- Level progress bar
- XP, Badges, Streak stats
- Badge grid (locked/unlocked)
- Streak calendar
- Theme toggle
- Edit profile
```

### Priority 2: Additional Components

#### 6. Reusable Components (`components/`)
```
- Card.tsx - Generic card wrapper
- ProgressBar.tsx - Circular and linear progress
- StatCard.tsx - XP/Badge/Streak cards
- SubjectCard.tsx - Subject selection cards
- QuizOption.tsx - Quiz answer options
- BadgeCard.tsx - Badge display with locked state
- StreakCalendar.tsx - Weekly streak display
- Icon.tsx - Material Icons wrapper
```

#### 7. Topic List Screen (`app/subject/[category].tsx`)
```typescript
Features needed:
- List of topics for selected subject
- Progress percentage per topic
- Difficulty indicators
- Estimated time
- Lock prerequisites (optional)
```

#### 8. Lesson Screen (`app/lesson/[id].tsx`)
```typescript
Features needed:
- Lesson content display
- Media support (images, videos)
- Navigation (prev/next)
- Complete button
- XP reward notification
```

#### 9. Quiz Result Screen (`app/quiz-result.tsx`)
```typescript
// Based on: assets/PHOTOS/quiz_results/code.html
Features needed:
- Score display
- XP earned
- Correct/incorrect breakdown
- Review answers option
- Retry button
- Continue to next topic
```

#### 10. Leaderboard Screen (`app/(tabs)/leaderboard.tsx`)
```typescript
// Based on: assets/PHOTOS/local_leaderboard/code.html
Features needed:
- Ranked user list
- Avatar, name, XP, level
- Current user highlight
- Weekly/All-time toggle
```

#### 11. Achievements Screen (`app/achievements.tsx`)
```typescript
// Based on: assets/PHOTOS/achievements_&_badges/code.html
Features needed:
- Grid of all badges
- Locked/unlocked state
- Progress bars for in-progress badges
- Badge details modal
```

### Priority 3: Utilities & Hooks

#### 12. Custom Hooks (`hooks/`)
```
- useDatabase.ts - Database queries
- useProgress.ts - Progress tracking
- useXP.ts - XP calculations
- useBadges.ts - Badge checking
- useStreak.ts - Streak management
- useTheme.ts - Theme utilities
```

#### 13. Utilities (`utils/`)
```
- formatters.ts - Date, number formatting
- validators.ts - Form validation
- levelCalculator.ts - XP to level conversion
- badgeChecker.ts - Check badge requirements
- timeUtils.ts - Time tracking
```

### Priority 4: AI Integration (Future)

#### 14. AI Service (`services/ai/`)
```
- recommendations.ts - Topic recommendations
- adaptive.ts - Difficulty adjustment
- analytics.ts - Performance tracking
- model.ts - TensorFlow.js integration
```

## 📋 Development Checklist

### Week 1: Foundation
- [x] Project setup
- [x] Database schema
- [x] State management
- [x] Theme system
- [ ] Welcome screen
- [ ] Dashboard screen

### Week 2: Core Features
- [ ] Subject menu
- [ ] Topic list
- [ ] Lesson viewer
- [ ] Quiz functionality
- [ ] Profile screen

### Week 3: Gamification
- [ ] XP system integration
- [ ] Badge unlocking
- [ ] Streak tracking
- [ ] Leaderboard
- [ ] Achievement screen

### Week 4: Polish
- [ ] Animations
- [ ] Error handling
- [ ] Loading states
- [ ] Offline sync
- [ ] Testing

## 🎨 Design Reference

All UI designs are in `assets/PHOTOS/`:
- `stem_app_splash_screen/` - Splash screen
- `welcome_/_sign_in/` - Login/register
- `home_screen_dashboard/` - Main dashboard
- `subject_menu/` - Subject selection
- `lesson_page/` - Lesson view
- `quiz_menu/` - Quiz selection
- `quiz_page/` - Quiz interface
- `quiz_results/` - Results screen
- `user_profile_summary/` - Profile
- `achievements_&_badges/` - Badges
- `local_leaderboard/` - Rankings

Each folder has:
- `screen.png` - Visual reference
- `code.html` - HTML/Tailwind implementation

## 🔧 Quick Commands

```bash
# Development
npm start              # Start Expo
npm run android        # Run on Android
npm run ios           # Run on iOS
npm run web           # Run in browser

# Testing
npm test              # Run tests
npm run type-check    # TypeScript check
npm run lint          # ESLint

# Database
# Reset database (if needed)
expo start -c         # Clear cache
```

## 🐛 Common Issues

### Issue: Database not seeding
**Solution**: Delete app and reinstall
```bash
# Android
adb uninstall com.stemlearning.app
npm run android
```

### Issue: Metro bundler stuck
**Solution**: Clear cache
```bash
npm start -- --reset-cache
```

### Issue: Expo modules not found
**Solution**: Rebuild
```bash
rm -rf node_modules
npm install
expo prebuild --clean
```

## 📞 Quick Help

### Access Database in Code
```typescript
import database from './services/database';

// Get user
const user = await database.getCurrentUser();

// Get subjects
const subjects = await database.getAllSubjects();

// Add XP
await database.addXP(userId, 50);
```

### Access State
```typescript
import { useAuthStore, useLearningStore, useQuizStore } from './services/store';

// In component
const { user, isAuthenticated } = useAuthStore();
const { subjects, loadSubjects } = useLearningStore();
const { currentQuiz, loadQuiz } = useQuizStore();
```

### Get Theme Colors
```typescript
import { useThemeStore } from './services/store';
import { Colors } from './constants/theme';

const { theme } = useThemeStore();
const colors = theme === 'dark' ? Colors.dark : Colors.light;
```

## 🎯 Next Steps

1. **Build Welcome Screen**: Start with user registration flow
2. **Build Dashboard**: Main hub with stats and navigation
3. **Build Subject Menu**: Browse learning content
4. **Test Flow**: Registration → Dashboard → Learn → Quiz → Profile
5. **Add Polish**: Animations, error handling, loading states

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 💡 Pro Tips

1. **Hot Reload**: Save files to see changes instantly
2. **Debug Menu**: Shake device or press `Ctrl+M` (Android) / `Cmd+D` (iOS)
3. **Remote Debugging**: Use React DevTools and Chrome debugger
4. **Inspect Database**: Use `expo-sqlite` debug tools
5. **Test on Real Device**: More accurate than emulator

## ✨ Quick Win: Build Your First Screen

**Let's build the dashboard in 10 steps:**

1. Create `app/(tabs)/home.tsx`
2. Import theme colors and spacing
3. Add 3 stat cards (XP, Badges, Streak)
4. Add 4 action cards (Learn, Quiz, Leaderboard, Profile)
5. Add AI suggestion card
6. Fetch data from `useAuthStore` and `useLearningStore`
7. Style with theme colors
8. Add press handlers
9. Test navigation
10. Add loading state

**Copy the HTML from `assets/PHOTOS/home_screen_dashboard/code.html` as reference!**

---

**You're all set! Start building amazing STEM learning experiences! 🚀**