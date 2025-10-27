/**
 * Database Service - Version 1.0
 * SQLite database management for STEM Learning App
 * 
 * FEATURES:
 * - User authentication (email/password)
 * - Progress tracking
 * - Quiz management
 * - Gamification (XP, levels, badges, streaks)
 * - Leaderboard
 * - Offline-first architecture
 */

import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';
import {
  User,
  Subject,
  Topic,
  Lesson,
  Quiz,
  Question,
  QuizAttempt,
  Badge,
  Achievement,
  UserProgress,
  Streak,
  LeaderboardEntry,
  SubjectCategory,
  DifficultyLevel,
} from '../types';

// Database version for migrations
const DATABASE_VERSION = 9;

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;

  /**
   * Initialize database and create tables
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if we need to delete old database due to schema changes
      const needsReset = await this.checkNeedsSchemaReset();
      
      if (needsReset) {
        console.log('🔄 Detected old schema with breaking changes, resetting database...');
        try {
          await SQLite.deleteDatabaseAsync('stem_learning.db');
          console.log('✅ Old database deleted successfully');
        } catch (deleteError) {
          console.log('⚠️  Database delete failed or file does not exist:', deleteError);
        }
      }

      // Open database
      this.db = await SQLite.openDatabaseAsync('stem_learning.db');
      console.log('✅ Database opened successfully');

      // Create tables
      await this.createTables();
      console.log('✅ Tables created');

      // Run migrations
      await this.runMigrations();
      console.log('✅ Migrations completed');

      // Seed initial data
      await this.seedData();
      console.log('✅ Data seeded');

      this.isInitialized = true;
      console.log('✅ Database initialization complete');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Check if database needs to be reset due to schema changes
   */
  private async checkNeedsSchemaReset(): Promise<boolean> {
    try {
      const db = await SQLite.openDatabaseAsync('stem_learning.db');
      
      // Try to query with the old backtick syntax
      // If this succeeds, we have an old schema
      try {
        await db.getFirstAsync('SELECT * FROM subjects LIMIT 1');
        
        // Check if the order column exists with old syntax
        const tableInfo = await db.getAllAsync('PRAGMA table_info(subjects)');
        const hasOldOrderColumn = tableInfo.some((col: any) => col.name === '`order`' || col.name === 'order');
        
        await db.closeAsync();
        
        // If we found the table, assume it needs reset for v6
        return true;
      } catch (error) {
        // If query fails, database might be corrupt or have old schema
        await db.closeAsync();
        return true;
      }
    } catch (error) {
      // Database doesn't exist yet
      return false;
    }
  }

  /**
   * Create all database tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Users table
    await this.db.execAsync(`
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
    `);

    // Subjects table
    await this.db.execAsync(`
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
    `);

    // Topics table
    await this.db.execAsync(`
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
    `);

    // Lessons table
    await this.db.execAsync(`
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
    `);

    // Quizzes table
    await this.db.execAsync(`
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
    `);

    // Questions table
    await this.db.execAsync(`
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
    `);

    // Quiz attempts table
    await this.db.execAsync(`
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
    `);

    // Badges table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS badges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        category TEXT NOT NULL,
        requirement TEXT NOT NULL,
        xpRequired INTEGER DEFAULT 0
      );
    `);

    // Achievements table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        badgeId TEXT NOT NULL,
        earnedAt TEXT,
        progress INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (badgeId) REFERENCES badges(id)
      );
    `);

    // User progress table
    await this.db.execAsync(`
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
    `);

    // Streaks table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS streaks (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        date TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        xpEarned INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id)
      );
    `);

    // Leaderboard table
    await this.db.execAsync(`
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
    `);

    // Database version table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS database_version (
        version INTEGER PRIMARY KEY
      );
    `);
    
    // Notifications table
    await this.db.execAsync(`
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
    `);
  }

  /**
   * Run database migrations
   */
  private async runMigrations(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<{ version: number }>(
      'SELECT version FROM database_version ORDER BY version DESC LIMIT 1'
    );
    const currentVersion = result?.version || 0;

    if (currentVersion < DATABASE_VERSION) {
      console.log(`📦 Migrating from v${currentVersion} to v${DATABASE_VERSION}`);

      // Migration v4: Add auth columns
      if (currentVersion < 4) {
        try {
          await this.db.execAsync(`
            ALTER TABLE users ADD COLUMN email TEXT;
            ALTER TABLE users ADD COLUMN username TEXT;
            ALTER TABLE users ADD COLUMN password TEXT;
          `);
          console.log('✅ Migration v4: Added auth columns');
        } catch (error) {
          console.log('⚠️  Migration v4: Columns may already exist');
        }
      }

      // Migration v5: Add educationLevel
      if (currentVersion < 5) {
        try {
          await this.db.execAsync(`ALTER TABLE users ADD COLUMN educationLevel TEXT;`);
          
          const users = await this.db.getAllAsync<any>('SELECT id, gradeLevel, educationLevel FROM users');
          for (const user of users) {
            if (!user.educationLevel && user.gradeLevel) {
              let educationLevel = 'none';
              const grade = user.gradeLevel;

              // Map grades to new education level structure
              if (['1', '2', '3', '4', '5', '6', '7'].includes(grade)) {
                educationLevel = grade; // Primary grades 1-7
              } else if (['form1', 'form2', 'form3', 'form4', 'form5'].includes(grade.toLowerCase())) {
                educationLevel = grade.toLowerCase(); // Secondary forms 1-5
              } else if (['none'].includes(grade.toLowerCase())) {
                educationLevel = 'none';
              }

              await this.db.runAsync(
                'UPDATE users SET educationLevel = ? WHERE id = ?',
                [educationLevel, user.id]
              );
            }
          }
          console.log('✅ Migration v5: Added educationLevel');
        } catch (error) {
          console.log('⚠️  Migration v5: May already be applied');
        }
      }

      // Migration v6: Fix order column (backticks to double quotes)
      // Note: Schema reset is handled at initialization for breaking changes
      if (currentVersion < 6) {
        console.log('✅ Migration v6: Schema reset completed at initialization');
      }

      // Migration v7: Add themeColor column for gender-based themes
      if (currentVersion < 7) {
        try {
          await this.db.execAsync(`ALTER TABLE users ADD COLUMN themeColor TEXT;`);
          
          // Update existing users with theme color based on gender
          const users = await this.db.getAllAsync<any>('SELECT id, gender FROM users');
          for (const user of users) {
            const themeColor = user.gender === 'female' ? '#FF48E3' : '#13a4ec';
            await this.db.runAsync(
              'UPDATE users SET themeColor = ? WHERE id = ?',
              [themeColor, user.id]
            );
          }
          console.log('✅ Migration v7: Added themeColor column');
        } catch (error) {
          console.log('⚠️  Migration v7: May already be applied');
        }
      }

      // Migration v8: Update educationLevel for users with old format
      if (currentVersion < 8) {
        try {
          const users = await this.db.getAllAsync<any>('SELECT id, educationLevel FROM users');
          for (const user of users) {
            let educationLevel = user.educationLevel || 'none';
            
            // Map old education levels to new format
            if (['primary'].includes(educationLevel)) {
              educationLevel = '1'; // Default to grade 1 for primary
            } else if (['secondary'].includes(educationLevel)) {
              educationLevel = 'form1'; // Default to form 1 for secondary
            } else if (['undergraduate', 'masters', 'phd'].includes(educationLevel)) {
              educationLevel = 'none'; // Map higher education to none
            }
            
            await this.db.runAsync(
              'UPDATE users SET educationLevel = ? WHERE id = ?',
              [educationLevel, user.id]
            );
          }
          console.log('✅ Migration v8: Updated educationLevel format');
        } catch (error) {
          console.log('⚠️  Migration v8: May already be applied');
        }
      }

      // Migration v9: Add notifications table
      if (currentVersion < 9) {
        try {
          await this.db.execAsync(`
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
          `);
          console.log('✅ Migration v9: Added notifications table');
        } catch (error) {
          console.log('⚠️  Migration v9: May already be applied');
        }
      }

      await this.db.runAsync('DELETE FROM database_version');
      await this.db.runAsync('INSERT INTO database_version (version) VALUES (?)', [DATABASE_VERSION]);
    }
  }

  /**
   * Seed initial data
   */
  private async seedData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const subjectCount = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM subjects'
    );

    if (subjectCount && subjectCount.count > 0) {
      console.log('⏭️  Data already seeded');
      return;
    }

    console.log('🌱 Seeding data...');
    await this.seedSubjects();
    await this.seedTopics();
    await this.seedLessons();
    await this.seedQuizzes();
    await this.seedBadges();
    console.log('✅ Seeding complete');
  }

  private async seedSubjects(): Promise<void> {
    const subjects = [
      { id: 'sci', name: 'Science', category: 'science', description: 'Explore biology, chemistry, physics, and earth science', icon: 'science', color: '#3b82f6', totalTopics: 5, order: 1 },
      { id: 'tech', name: 'Technology', category: 'technology', description: 'Learn programming, web development, and digital literacy', icon: 'computer', color: '#22c55e', totalTopics: 5, order: 2 },
      { id: 'eng', name: 'Engineering', category: 'engineering', description: 'Discover mechanical, electrical, and civil engineering', icon: 'build', color: '#a855f7', totalTopics: 5, order: 3 },
      { id: 'math', name: 'Mathematics', category: 'mathematics', description: 'Master algebra, geometry, calculus, and statistics', icon: 'calculate', color: '#ef4444', totalTopics: 5, order: 4 },
    ];

    for (const s of subjects) {
      await this.db!.runAsync(
        `INSERT OR IGNORE INTO subjects (id, name, category, description, icon, color, totalTopics, "order") VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [s.id, s.name, s.category, s.description, s.icon, s.color, s.totalTopics, s.order]
      );
    }
  }

  private async seedTopics(): Promise<void> {
    const topics = [
      { id: 'sci-topic-001', subjectId: 'sci', title: 'The Cell', description: 'Cell structure and function', difficulty: 'beginner', estimatedMinutes: 30, order: 1 },
      { id: 'sci-topic-002', subjectId: 'sci', title: 'Photosynthesis', description: 'How plants make food', difficulty: 'beginner', estimatedMinutes: 25, order: 2 },
      { id: 'tech-topic-001', subjectId: 'tech', title: 'Intro to Programming', description: 'Learn coding basics', difficulty: 'beginner', estimatedMinutes: 40, order: 1 },
      { id: 'tech-topic-002', subjectId: 'tech', title: 'HTML & CSS', description: 'Build web pages', difficulty: 'beginner', estimatedMinutes: 50, order: 2 },
      { id: 'eng-topic-001', subjectId: 'eng', title: 'Simple Machines', description: 'Levers, pulleys, planes', difficulty: 'beginner', estimatedMinutes: 35, order: 1 },
      { id: 'math-topic-001', subjectId: 'math', title: 'Fractions', description: 'Parts of numbers', difficulty: 'beginner', estimatedMinutes: 30, order: 1 },
    ];

    for (const t of topics) {
      await this.db!.runAsync(
        `INSERT OR IGNORE INTO topics (id, subjectId, title, description, difficulty, estimatedMinutes, "order") VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [t.id, t.subjectId, t.title, t.description, t.difficulty, t.estimatedMinutes, t.order]
      );
    }
  }

  private async seedLessons(): Promise<void> {
    const lessons = [
      { id: 'sci-topic-001-lesson-001', topicId: 'sci-topic-001', title: 'Cell Structure', content: 'Cells are the basic building blocks of all living things...', xpReward: 50, order: 1 },
      { id: 'tech-topic-001-lesson-001', topicId: 'tech-topic-001', title: 'What is Programming?', content: 'Programming is creating instructions for computers...', xpReward: 50, order: 1 },
    ];

    for (const l of lessons) {
      await this.db!.runAsync(
        `INSERT OR IGNORE INTO lessons (id, topicId, title, content, xpReward, "order") VALUES (?, ?, ?, ?, ?, ?)`,
        [l.id, l.topicId, l.title, l.content, l.xpReward, l.order]
      );
    }
  }

  private async seedQuizzes(): Promise<void> {
    await this.db!.runAsync(
      `INSERT OR IGNORE INTO quizzes (id, topicId, title, description, difficulty, totalQuestions, passingScore, xpReward) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['sci-topic-001-quiz-001', 'sci-topic-001', 'Cell Structure Quiz', 'Test your knowledge', 'beginner', 5, 70, 75]
    );

    const questions = [
      { id: 'q1', quizId: 'sci-topic-001-quiz-001', text: 'What is the basic unit of life?', options: [{ id: 'a', text: 'Cell', isCorrect: true }, { id: 'b', text: 'Atom', isCorrect: false }], answer: 'a', difficulty: 'beginner', order: 1 },
    ];

    for (const q of questions) {
      await this.db!.runAsync(
        `INSERT OR IGNORE INTO questions (id, quizId, questionText, questionType, options, correctAnswerId, difficulty, "order") VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [q.id, q.quizId, q.text, 'multiple_choice', JSON.stringify(q.options), q.answer, q.difficulty, q.order]
      );
    }
  }

  private async seedBadges(): Promise<void> {
    const badges = [
      { id: 'badge-first-steps', name: 'First Steps', description: 'Complete first lesson', icon: 'emoji-events', category: 'general', requirement: 'Complete 1 lesson', xpRequired: 0 },
      { id: 'badge-science-star', name: 'Science Star', description: 'Earn 500 XP in Science', icon: 'science', category: 'science', requirement: 'Earn 500 XP', xpRequired: 500 },
    ];

    for (const b of badges) {
      await this.db!.runAsync(
        `INSERT OR IGNORE INTO badges (id, name, description, icon, category, requirement, xpRequired) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [b.id, b.name, b.description, b.icon, b.category, b.requirement, b.xpRequired]
      );
    }
  }

  // ==================== USER METHODS ====================

  async createUser(userData: Omit<User, 'id' | 'xp' | 'level' | 'currentStreak' | 'longestStreak' | 'totalBadges' | 'createdAt' | 'lastActive'>, password: string): Promise<User> {
    if (!this.db) throw new Error('Database not initialized');

    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const username = userData.email.split('@')[0].toLowerCase();
    const now = new Date().toISOString();
    
    // Set theme color based on gender
    const themeColor = userData.gender === 'female' ? '#FF48E3' : '#13a4ec';

    const user: User = {
      id,
      ...userData,
      username,
      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      totalBadges: 0,
      createdAt: now,
      lastActive: now,
      themeColor,
    };

    await this.db.runAsync(
      `INSERT INTO users (id, name, email, username, password, age, gender, educationLevel, avatarId, xp, level, currentStreak, longestStreak, totalBadges, createdAt, lastActive, theme, themeColor)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.name, user.email, username, password, user.age, user.gender, user.educationLevel, user.avatarId, user.xp, user.level, user.currentStreak, user.longestStreak, user.totalBadges, user.createdAt, user.lastActive, user.theme, themeColor]
    );

    await SecureStore.setItemAsync('current_user_id', id);
    return user;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const user = await this.db.getFirstAsync<User>(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email.toLowerCase(), password]
    );

    if (user) {
      await SecureStore.setItemAsync('current_user_id', user.id);
    }

    return user || null;
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const userId = await SecureStore.getItemAsync('current_user_id');
    if (!userId) return null;

    const user = await this.db.getFirstAsync<User>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    return user || null;
  }

  async getUser(userId: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const user = await this.db.getFirstAsync<User>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    return user || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), userId];

    await this.db.runAsync(
      `UPDATE users SET ${fields} WHERE id = ?`,
      values
    );
  }

  async addXP(userId: string, xp: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const user = await this.getUser(userId);
    if (!user) return;

    const newXP = user.xp + xp;
    const newLevel = this.calculateLevel(newXP);

    await this.updateUser(userId, { xp: newXP, level: newLevel });
  }

  private calculateLevel(xp: number): number {
    if (xp < 100) return 1;
    if (xp < 250) return 2;
    if (xp < 500) return 3;
    if (xp < 800) return 4;
    if (xp < 1200) return 5;
    if (xp < 1700) return 6;
    if (xp < 2300) return 7;
    if (xp < 3000) return 8;
    if (xp < 3800) return 9;
    if (xp < 4700) return 10;
    return Math.floor(10 + (xp - 4700) / 1000);
  }

  // ==================== SUBJECT METHODS ====================

  async getAllSubjects(): Promise<Subject[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllAsync<Subject>('SELECT * FROM subjects ORDER BY "order"');
  }

  async getSubject(subjectId: string): Promise<Subject | null> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getFirstAsync<Subject>('SELECT * FROM subjects WHERE id = ?', [subjectId]);
  }

  // ==================== TOPIC METHODS ====================

  async getTopicsBySubject(subjectId: string): Promise<Topic[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllAsync<Topic>('SELECT * FROM topics WHERE subjectId = ? ORDER BY "order"', [subjectId]);
  }

  async getTopic(topicId: string): Promise<Topic | null> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getFirstAsync<Topic>('SELECT * FROM topics WHERE id = ?', [topicId]);
  }

  // ==================== LESSON METHODS ====================

  async getLessonsByTopic(topicId: string): Promise<Lesson[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllAsync<Lesson>('SELECT * FROM lessons WHERE topicId = ? ORDER BY "order"', [topicId]);
  }

  async getLesson(lessonId: string): Promise<Lesson | null> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getFirstAsync<Lesson>('SELECT * FROM lessons WHERE id = ?', [lessonId]);
  }

  // ==================== QUIZ METHODS ====================

  async getQuizzesByTopic(topicId: string): Promise<Quiz[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllAsync<Quiz>('SELECT * FROM quizzes WHERE topicId = ?', [topicId]);
  }

  async getQuiz(quizId: string): Promise<Quiz | null> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getFirstAsync<Quiz>('SELECT * FROM quizzes WHERE id = ?', [quizId]);
  }

  async getQuestionsByQuiz(quizId: string): Promise<Question[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const questions = await this.db.getAllAsync<any>('SELECT * FROM questions WHERE quizId = ? ORDER BY "order"', [quizId]);
    
    return questions.map(q => ({
      ...q,
      options: JSON.parse(q.options),
    }));
  }

  async saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT INTO quiz_attempts (id, userId, quizId, score, totalQuestions, correctAnswers, timeSpentSeconds, completedAt, answers)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [attempt.id, attempt.userId, attempt.quizId, attempt.score, attempt.totalQuestions, attempt.correctAnswers, attempt.timeSpentSeconds, attempt.completedAt, JSON.stringify(attempt.answers)]
    );
  }

  async getQuizAttempts(userId: string): Promise<QuizAttempt[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const attempts = await this.db.getAllAsync<any>('SELECT * FROM quiz_attempts WHERE userId = ? ORDER BY completedAt DESC', [userId]);
    
    return attempts.map(a => ({
      ...a,
      answers: JSON.parse(a.answers),
    }));
  }

  async getQuizAttempt(attemptId: string): Promise<QuizAttempt | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const attempt = await this.db.getFirstAsync<any>('SELECT * FROM quiz_attempts WHERE id = ?', [attemptId]);
    
    if (!attempt) return null;
    
    return {
      ...attempt,
      answers: JSON.parse(attempt.answers),
    };
  }

  // ==================== PROGRESS METHODS ====================

  async updateProgress(userId: string, subjectId: string, topicId: string, percentage: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const existing = await this.db.getFirstAsync<UserProgress>(
      'SELECT * FROM user_progress WHERE userId = ? AND topicId = ?',
      [userId, topicId]
    );

    if (existing) {
      await this.db.runAsync(
        'UPDATE user_progress SET completionPercentage = ?, lastAccessedAt = ? WHERE id = ?',
        [percentage, new Date().toISOString(), existing.id]
      );
    } else {
      const id = `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await this.db.runAsync(
        'INSERT INTO user_progress (id, userId, subjectId, topicId, completionPercentage, lastAccessedAt, timeSpentMinutes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, userId, subjectId, topicId, percentage, new Date().toISOString(), 0]
      );
    }
  }

  async getProgress(userId: string): Promise<UserProgress[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllAsync<UserProgress>('SELECT * FROM user_progress WHERE userId = ?', [userId]);
  }

  // ==================== STREAK METHODS ====================

  async updateStreak(userId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const today = new Date().toISOString().split('T')[0];
    const existing = await this.db.getFirstAsync<Streak>(
      'SELECT * FROM streaks WHERE userId = ? AND date = ?',
      [userId, today]
    );

    if (!existing) {
      const id = `streak-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await this.db.runAsync(
        'INSERT INTO streaks (id, userId, date, completed, xpEarned) VALUES (?, ?, ?, ?, ?)',
        [id, userId, today, 1, 25]
      );

      const user = await this.getUser(userId);
      if (user) {
        const newStreak = user.currentStreak + 1;
        const longestStreak = Math.max(newStreak, user.longestStreak);
        await this.updateUser(userId, { currentStreak: newStreak, longestStreak });
        await this.addXP(userId, 25);
      }
    }
  }

  // ==================== BADGE METHODS ====================

  async getAllBadges(): Promise<Badge[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllAsync<Badge>('SELECT * FROM badges');
  }

  async checkAndUnlockBadges(userId: string): Promise<Badge[]> {
    if (!this.db) throw new Error('Database not initialized');

    const user = await this.getUser(userId);
    if (!user) return [];

    const badges = await this.getAllBadges();
    const unlocked: Badge[] = [];

    for (const badge of badges) {
      const existing = await this.db.getFirstAsync<Achievement>(
        'SELECT * FROM achievements WHERE userId = ? AND badgeId = ?',
        [userId, badge.id]
      );

      if (!existing && user.xp >= (badge.xpRequired ?? 0)) {
        const id = `achievement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await this.db.runAsync(
          'INSERT INTO achievements (id, userId, badgeId, earnedAt, progress) VALUES (?, ?, ?, ?, ?)',
          [id, userId, badge.id, new Date().toISOString(), 100]
        );
        unlocked.push(badge);
      }
    }

    if (unlocked.length > 0) {
      await this.updateUser(userId, { totalBadges: user.totalBadges + unlocked.length });
    }

    return unlocked;
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllAsync<Achievement>('SELECT * FROM achievements WHERE userId = ?', [userId]);
  }

  // ==================== LEADERBOARD METHODS ====================

  async updateLeaderboard(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Clear existing leaderboard
    await this.db.execAsync('DELETE FROM leaderboard');

    // Get all users ordered by XP
    const users = await this.db.getAllAsync<User>('SELECT * FROM users ORDER BY xp DESC');

    // Insert users into leaderboard with proper unique IDs
    let rank = 1;
    for (const user of users) {
      const id = `leaderboard-${user.id}`;
      await this.db.runAsync(
        'INSERT OR REPLACE INTO leaderboard (id, userId, userName, avatarId, totalXp, level, rank, weeklyXp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, user.id, user.name, user.avatarId, user.xp, user.level, rank, 0]
      );
      rank++;
    }
  }

  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAllAsync<LeaderboardEntry>('SELECT * FROM leaderboard ORDER BY rank LIMIT ?', [limit]);
  }

  async getUserRank(userId: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const entry = await this.db.getFirstAsync<LeaderboardEntry>(
      'SELECT rank FROM leaderboard WHERE userId = ?',
      [userId]
    );

    return entry?.rank || 0;
  }

  // ==================== NOTIFICATION METHODS ====================

  async createNotification(userId: string, title: string, message: string, type: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();

    await this.db.runAsync(
      'INSERT INTO notifications (id, userId, title, message, type, read, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, userId, title, message, type, 0, createdAt]
    );
  }

  async getNotifications(userId: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return await this.db.getAllAsync<any>(
      'SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
  }

  async getUnreadNotificationsCount(userId: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND read = 0',
      [userId]
    );
    
    return result?.count || 0;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync(
      'UPDATE notifications SET read = 1 WHERE id = ?',
      [notificationId]
    );
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync(
      'UPDATE notifications SET read = 1 WHERE userId = ?',
      [userId]
    );
  }

  async deleteNotification(notificationId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync(
      'DELETE FROM notifications WHERE id = ?',
      [notificationId]
    );
  }

  async clearAllNotifications(userId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync(
      'DELETE FROM notifications WHERE userId = ?',
      [userId]
    );
  }
}

const database = new DatabaseService();
export default database;
