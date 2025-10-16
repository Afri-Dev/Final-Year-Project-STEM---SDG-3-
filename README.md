# STEM Learning App - Offline AI-Powered Gamified Learning Platform

A comprehensive React Native (Expo) application designed for offline STEM education, targeting students aged 10-20 in Zambia. Features include gamification, adaptive quizzes, progress tracking, and AI-powered learning recommendations.

## 🚀 Features

### Core Functionality
- **Offline-First Architecture**: Full functionality without internet connection
- **User Management**: Local authentication with secure storage
- **Subject Categories**: Science, Technology, Engineering, Mathematics
- **Interactive Lessons**: Rich content with multimedia support
- **Adaptive Quizzes**: Multiple-choice questions with instant feedback
- **Progress Tracking**: Real-time monitoring of learning progress

### Gamification
- **XP System**: Earn experience points for completing activities
- **20 Level Progression**: From Beginner to Einstein
- **Badge System**: Unlock achievements for milestones
- **Streak Tracking**: Daily learning streaks with rewards
- **Local Leaderboard**: Compete with other users on the device

### AI Integration (Stub Ready)
- **Recommendation Engine**: Suggests next topics based on performance
- **Adaptive Difficulty**: Adjusts quiz difficulty based on user history
- **Performance Analytics**: Tracks strengths and weaknesses
- **TensorFlow.js Integration**: Ready for on-device ML models

### UI/UX
- **Light/Dark Theme**: Automatic theme switching
- **Material Design Icons**: Clean, modern interface
- **Responsive Layout**: Optimized for various screen sizes
- **Smooth Animations**: Enhanced user experience
- **Accessibility**: Color contrast and readable fonts

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## 🛠️ Installation

### 1. Clone the Repository
```bash
cd stem_learning_app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm start
```

### 4. Run on Device/Emulator

#### For Android:
```bash
npm run android
```

#### For iOS (macOS only):
```bash
npm run ios
```

#### For Web:
```bash
npm run web
```

## 📁 Project Structure

```
stem_learning_app/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation
│   │   ├── home.tsx             # Dashboard
│   │   ├── learn.tsx            # Learning modules
│   │   ├── quiz.tsx             # Quiz section
│   │   └── profile.tsx          # User profile
│   ├── index.tsx                # Splash screen
│   ├── welcome.tsx              # Welcome/Login
│   ├── lesson/[id].tsx          # Lesson detail
│   ├── quiz/[id].tsx            # Quiz screen
│   └── quiz-result.tsx          # Quiz results
├── components/                   # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── ProgressBar.tsx
│   └── ...
├── services/                     # Business logic
│   ├── database.ts              # SQLite operations
│   ├── store.ts                 # Zustand state management
│   └── ai/                      # AI services (stub)
├── hooks/                        # Custom React hooks
├── context/                      # React Context providers
├── utils/                        # Utility functions
├── constants/                    # App constants
│   └── theme.ts                 # Theme configuration
├── types/                        # TypeScript definitions
│   └── index.ts
├── assets/                       # Images, icons, fonts
│   ├── PHOTOS/                  # UI reference designs
│   ├── images/
│   └── icons/
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: `#13a4ec` (Cyan Blue)
- **Background Light**: `#f6f7f8`
- **Background Dark**: `#101c22`
- **Subject Colors**:
  - Science: Blue (`#3b82f6`)
  - Technology: Green (`#22c55e`)
  - Engineering: Purple (`#a855f7`)
  - Mathematics: Red (`#ef4444`)

### Typography
- **Font**: Space Grotesk
- **Sizes**: xs (12), sm (14), base (16), lg (18), xl (20), 2xl (24), 3xl (30), 4xl (36)

### Spacing
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px

## 💾 Database Schema

### Tables
1. **users** - User accounts and profiles
2. **subjects** - STEM subject categories
3. **topics** - Learning topics within subjects
4. **lessons** - Educational content
5. **quizzes** - Quiz metadata
6. **questions** - Quiz questions and answers
7. **quiz_attempts** - User quiz history
8. **badges** - Available achievements
9. **achievements** - User-earned badges
10. **user_progress** - Learning progress tracking
11. **streaks** - Daily streak records
12. **leaderboard** - User rankings

## 🎮 Gamification System

### XP Levels
- Level 1: 0 XP - Beginner
- Level 5: 800 XP - Scientist
- Level 10: 3,800 XP - Master
- Level 15: 9,300 XP - Prodigy
- Level 20: 17,300 XP - Einstein

### XP Rewards
- Complete Lesson: 50 XP
- Pass Beginner Quiz: 75 XP
- Pass Intermediate Quiz: 100 XP
- Pass Advanced Quiz: 150 XP
- Perfect Quiz Score: +50 XP bonus
- Daily Streak: 25 XP
- Weekly Streak: 100 XP
- Earn Badge: 150 XP

### Badges
- **First Steps**: Complete your first lesson
- **Science Star**: Complete 5 Science lessons (500 XP)
- **Tech Wizard**: Complete 5 Technology lessons (500 XP)
- **Engineering Pro**: Complete 5 Engineering lessons (500 XP)
- **Math Master**: Complete 5 Mathematics lessons (500 XP)
- **Quiz Champion**: Pass 10 quizzes
- **Perfect Score**: Get 100% on any quiz
- **Week Warrior**: Maintain a 7-day streak

## 🔐 Security

- User credentials stored with `expo-secure-store` (AES-256)
- Local database encryption
- No sensitive data transmitted over network
- Offline-first ensures data privacy

## 📱 Offline Capabilities

All app features work completely offline:
- ✅ User authentication
- ✅ Content access (lessons, quizzes)
- ✅ Progress tracking
- ✅ XP and badge systems
- ✅ Local leaderboard
- ✅ Theme preferences

## 🤖 AI Integration (Future)

The app includes stubs for AI features:

### Recommendation Engine
```typescript
// services/ai/recommendations.ts
export async function getRecommendations(userId: string): Promise<AIRecommendation[]>
```

### Adaptive Learning
```typescript
// services/ai/adaptive.ts
export function predictNextDifficulty(scoreHistory: number[]): DifficultyLevel
```

### To integrate a TensorFlow model:
1. Place model files in `assets/model/`
2. Load model in AI service
3. Run predictions on-device

## 🧪 Testing

Run tests:
```bash
npm test
```

Run type checking:
```bash
npm run type-check
```

Run linting:
```bash
npm run lint
```

## 📦 Building for Production

### Android APK
```bash
eas build --platform android --profile preview
```

### iOS IPA
```bash
eas build --platform ios --profile preview
```

### Generate APK Locally
```bash
expo build:android -t apk
```

## 🔧 Configuration

### App Config
Edit `app.config.ts` to customize:
- App name and slug
- Bundle identifiers
- Splash screen
- Icons
- Permissions

### Theme
Edit `constants/theme.ts` to customize:
- Color palette
- Typography
- Spacing
- XP levels
- Badge requirements

### Database
Edit `services/database.ts` to:
- Add new tables
- Modify schema
- Seed custom content

## 📊 Content Management

### Adding New Content

#### Add a Subject:
```typescript
await database.runAsync(
  `INSERT INTO subjects (id, name, category, description, icon, color, totalTopics, displayOrder)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ['new-subject-id', 'Subject Name', 'category', 'Description', 'icon', '#color', 5, 5]
);
```

#### Add a Topic:
```typescript
await database.runAsync(
  `INSERT INTO topics (id, subjectId, title, description, difficulty, estimatedMinutes, displayOrder)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ['topic-id', 'subject-id', 'Topic Title', 'Description', 'beginner', 30, 1]
);
```

#### Add a Lesson:
```typescript
await database.runAsync(
  `INSERT INTO lessons (id, topicId, title, content, xpReward, displayOrder)
   VALUES (?, ?, ?, ?, ?, ?)`,
  ['lesson-id', 'topic-id', 'Lesson Title', 'Content here...', 50, 1]
);
```

## 🌐 Multi-language Support (Future)

Structure for localization:
```
assets/
  locales/
    en.json
    ny.json (Chichewa/Nyanja)
```

## 🐛 Troubleshooting

### Common Issues

**Database not initializing:**
```bash
# Clear app data and restart
expo start -c
```

**Metro bundler errors:**
```bash
# Clear cache
npm start -- --reset-cache
```

**Build failures:**
```bash
# Clean install
rm -rf node_modules
npm install
```

## 📖 API Reference

### Database Service
```typescript
import database from './services/database';

// User operations
await database.createUser(userData);
await database.getUser(userId);
await database.updateUser(userId, updates);

// Learning operations
await database.getAllSubjects();
await database.getTopicsBySubject(subjectId);
await database.getLessonsByTopic(topicId);

// Quiz operations
await database.getQuiz(quizId);
await database.getQuestionsByQuiz(quizId);
await database.saveQuizAttempt(attempt);

// Progress operations
await database.updateProgress(userId, subjectId, topicId, percentage);
await database.getProgress(userId);

// Gamification
await database.addXP(userId, amount);
await database.unlockBadge(userId, badgeId);
await database.updateStreak(userId);
```

### State Management (Zustand)
```typescript
import { useAuthStore, useThemeStore, useLearningStore, useQuizStore } from './services/store';

// Auth
const { user, isAuthenticated, login, register, logout } = useAuthStore();

// Theme
const { theme, setTheme, toggleTheme } = useThemeStore();

// Learning
const { subjects, loadSubjects, updateProgress } = useLearningStore();

// Quiz
const { currentQuiz, loadQuiz, startQuiz, answerQuestion, endQuiz } = useQuizStore();
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- UI designs inspired by modern educational apps
- Material Symbols for icons
- Space Grotesk font family
- Expo team for the amazing framework
- Zambian education system for context and requirements

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Email: support@stemlearning.app

## 🗺️ Roadmap

### Version 1.1 (Planned)
- [ ] Cloud sync with Supabase
- [ ] Multi-language support (English, Chichewa, Bemba)
- [ ] Voice narration for lessons
- [ ] Offline video lessons
- [ ] Parent/teacher dashboard
- [ ] Certificate generation

### Version 1.2 (Planned)
- [ ] Full AI tutor integration
- [ ] Collaborative learning features
- [ ] Advanced analytics dashboard
- [ ] Custom quiz creation
- [ ] Community content sharing

## 📈 Performance Optimization

- SQLite indexing for fast queries
- Image optimization and lazy loading
- Memoized components
- Zustand for efficient state management
- Offline-first reduces network overhead

## 🔒 Privacy

- No data collection
- No third-party trackers
- All data stored locally
- User controls all information
- COPPA compliant (for users under 13)

---

**Built with ❤️ for STEM education in Zambia**

add a language button in the settings too and add a page for it with radio selection of the languages: Bemba, Nyanja