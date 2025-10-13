/**
 * SQLite Database Service for STEM Learning App
 * Handles all database operations including initialization, CRUD operations, and migrations
 */

import * as SQLite from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
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
} from "../types";

const DATABASE_NAME = "stem_learning_final.db";
const DATABASE_VERSION = 5;

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * Initialize database connection and create tables
   */
  async initialize(): Promise<void> {
    try {
      console.log("Initializing database:", DATABASE_NAME);

      // Close existing connection if any
      if (this.db) {
        await this.db.closeAsync();
        this.db = null;
      }

      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      console.log("Database connection opened");

      await this.createTables();
      console.log("Tables created");

      await this.migrateDatabase();
      console.log("Migration completed");

      await this.seedInitialData();
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Failed to initialize database:", error);
      this.db = null;
      throw error;
    }
  }

  /**
   * Migrate existing database to add username and password columns
   */
  private async migrateDatabase(): Promise<void> {
    if (!this.db) return;

    try {
      // Check if columns exist
      const tableInfo = await this.db.getAllAsync("PRAGMA table_info(users)");

      const hasEmail = tableInfo.some((col: any) => col.name === "email");
      const hasUsername = tableInfo.some((col: any) => col.name === "username");
      const hasPassword = tableInfo.some((col: any) => col.name === "password");
      const hasEducationLevel = tableInfo.some((col: any) => col.name === "educationLevel");
      const hasGradeLevel = tableInfo.some((col: any) => col.name === "gradeLevel");

      // Add email column if it doesn't exist
      if (!hasEmail) {
        await this.db.execAsync("ALTER TABLE users ADD COLUMN email TEXT");
        console.log("Added email column to users table");
      }

      // Add username column if it doesn't exist
      if (!hasUsername) {
        await this.db.execAsync("ALTER TABLE users ADD COLUMN username TEXT");
        console.log("Added username column to users table");
      }

      // Add password column if it doesn't exist
      if (!hasPassword) {
        await this.db.execAsync("ALTER TABLE users ADD COLUMN password TEXT");
        console.log("Added password column to users table");
      }

      // Migrate gradeLevel to educationLevel
      if (hasGradeLevel && !hasEducationLevel) {
        // Add new educationLevel column
        await this.db.execAsync("ALTER TABLE users ADD COLUMN educationLevel TEXT");
        console.log("Added educationLevel column to users table");

        // Migrate data from gradeLevel to educationLevel
        const users = await this.db.getAllAsync<any>("SELECT id, gradeLevel FROM users WHERE educationLevel IS NULL");
        
        for (const user of users) {
          let educationLevel = "secondary"; // default
          
          // Map grade numbers to education levels
          const grade = parseInt(user.gradeLevel);
          if (grade >= 1 && grade <= 6) {
            educationLevel = "primary";
          } else if (grade >= 7 && grade <= 12) {
            educationLevel = "secondary";
          } else if (user.gradeLevel === "undergraduate" || user.gradeLevel === "college") {
            educationLevel = "undergraduate";
          } else if (user.gradeLevel === "postgraduate" || user.gradeLevel === "graduate") {
            educationLevel = "postgraduate";
          } else if (user.gradeLevel === "none" || user.gradeLevel === "no formal") {
            educationLevel = "none";
          }
          
          await this.db.runAsync(
            "UPDATE users SET educationLevel = ? WHERE id = ?",
            [educationLevel, user.id]
          );
        }
        
        if (users.length > 0) {
          console.log(`Migrated ${users.length} users from gradeLevel to educationLevel`);
        }
      }

      // Update existing users with email, username and default password
      if (!hasEmail || !hasUsername || !hasPassword) {
        const users = await this.db.getAllAsync<any>(
          "SELECT id, name FROM users WHERE email IS NULL OR username IS NULL OR password IS NULL",
        );

        for (const user of users) {
          const username = user.name.toLowerCase().replace(/\s+/g, "");
          const email = `${username}@example.com`; // Default email for existing users
          const defaultPassword = "password123"; // Default password for existing users

          await this.db.runAsync(
            "UPDATE users SET email = ?, username = ?, password = ? WHERE id = ?",
            [email, username, defaultPassword, user.id],
          );
        }

        if (users.length > 0) {
          console.log(
            `Updated ${users.length} existing users with username and password`,
          );
        }
      }

      // Make email and username unique (best effort - may fail if duplicates exist)
      try {
        await this.db.execAsync(
          "CREATE UNIQUE INDEX IF NOT EXISTS idx_email ON users(email)",
        );
        await this.db.execAsync(
          "CREATE UNIQUE INDEX IF NOT EXISTS idx_username ON users(username)",
        );
      } catch (e) {
        console.warn("Could not create unique indexes (may have duplicates)");
      }
    } catch (error) {
      console.error("Migration error:", error);
      // Don't throw - migration is optional for existing databases
    }
  }

  /**
   * Create all database tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const queries = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        username TEXT UNIQUE,
        password TEXT,
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
        theme TEXT DEFAULT 'light'
      )`,

      // Subjects table
      `CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        totalTopics INTEGER DEFAULT 0,
        displayOrder INTEGER NOT NULL
      )`,

      // Topics table
      `CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY,
        subjectId TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        estimatedMinutes INTEGER NOT NULL,
        displayOrder INTEGER NOT NULL,
        prerequisiteTopicIds TEXT,
        FOREIGN KEY (subjectId) REFERENCES subjects(id)
      )`,

      // Lessons table
      `CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY,
        topicId TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        mediaType TEXT,
        mediaUrl TEXT,
        xpReward INTEGER DEFAULT 50,
        displayOrder INTEGER NOT NULL,
        FOREIGN KEY (topicId) REFERENCES topics(id)
      )`,

      // Quizzes table
      `CREATE TABLE IF NOT EXISTS quizzes (
        id TEXT PRIMARY KEY,
        topicId TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        totalQuestions INTEGER NOT NULL,
        passingScore INTEGER DEFAULT 70,
        xpReward INTEGER DEFAULT 100,
        timeLimit INTEGER,
        FOREIGN KEY (topicId) REFERENCES topics(id)
      )`,

      // Questions table
      `CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        quizId TEXT NOT NULL,
        questionText TEXT NOT NULL,
        questionType TEXT NOT NULL,
        options TEXT NOT NULL,
        correctAnswerId TEXT NOT NULL,
        explanation TEXT,
        difficulty TEXT NOT NULL,
        displayOrder INTEGER NOT NULL,
        FOREIGN KEY (quizId) REFERENCES quizzes(id)
      )`,

      // Quiz attempts table
      `CREATE TABLE IF NOT EXISTS quiz_attempts (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        quizId TEXT NOT NULL,
        score INTEGER NOT NULL,
        totalQuestions INTEGER NOT NULL,
        correctAnswers INTEGER NOT NULL,
        timeSpentSeconds INTEGER NOT NULL,
        completedAt TEXT NOT NULL,
        answers TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (quizId) REFERENCES quizzes(id)
      )`,

      // Badges table
      `CREATE TABLE IF NOT EXISTS badges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        category TEXT NOT NULL,
        requirement TEXT NOT NULL,
        xpRequired INTEGER
      )`,

      // Achievements table
      `CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        badgeId TEXT NOT NULL,
        earnedAt TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (badgeId) REFERENCES badges(id)
      )`,

      // User progress table
      `CREATE TABLE IF NOT EXISTS user_progress (
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
      )`,

      // Streaks table
      `CREATE TABLE IF NOT EXISTS streaks (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        date TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        xpEarned INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`,

      // Leaderboard table
      `CREATE TABLE IF NOT EXISTS leaderboard (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        userName TEXT NOT NULL,
        avatarId TEXT NOT NULL,
        totalXp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        rank INTEGER DEFAULT 0,
        weeklyXp INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`,

      // Create indexes for better performance
      `CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subjectId)`,
      `CREATE INDEX IF NOT EXISTS idx_lessons_topic ON lessons(topicId)`,
      `CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions(quizId)`,
      `CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(userId)`,
      `CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(userId)`,
      `CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(userId)`,
      `CREATE INDEX IF NOT EXISTS idx_streaks_user_date ON streaks(userId, date)`,
      `CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard(rank)`,
    ];

    for (const query of queries) {
      await this.db.execAsync(query);
    }
  }

  /**
   * Seed initial data (subjects, badges, sample content)
   */
  private async seedInitialData(): Promise<void> {
    if (!this.db) {
      console.error("Cannot seed data: database not initialized");
      return;
    }

    try {
      // Check if data already exists
      const result = await this.db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM subjects",
      );

      if (result && result.count > 0) {
        console.log("Database already seeded");
        return;
      }

      console.log("Starting to seed initial data...");

      // Seed subjects
      const subjects: Subject[] = [
        {
          id: "sci-001",
          name: "Science",
          category: "science",
          description:
            "Explore the natural world through biology, physics, and chemistry",
          icon: "science",
          color: "#3b82f6",
          totalTopics: 5,
          order: 1,
        },
        {
          id: "tech-001",
          name: "Technology",
          category: "technology",
          description: "Learn about computers, coding, and digital innovation",
          icon: "devices",
          color: "#22c55e",
          totalTopics: 5,
          order: 2,
        },
        {
          id: "eng-001",
          name: "Engineering",
          category: "engineering",
          description: "Discover how things are designed, built, and improved",
          icon: "engineering",
          color: "#a855f7",
          totalTopics: 5,
          order: 3,
        },
        {
          id: "math-001",
          name: "Mathematics",
          category: "mathematics",
          description: "Master numbers, patterns, and problem-solving",
          icon: "calculate",
          color: "#ef4444",
          totalTopics: 5,
          order: 4,
        },
      ];

      for (const subject of subjects) {
        await this.db.runAsync(
          `INSERT INTO subjects (id, name, category, description, icon, color, totalTopics, displayOrder)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            subject.id,
            subject.name,
            subject.category,
            subject.description,
            subject.icon,
            subject.color,
            subject.totalTopics,
            subject.order,
          ],
        );
      }

      // Seed topics and lessons for Science
      await this.seedScienceContent();
      await this.seedTechnologyContent();
      await this.seedEngineeringContent();
      await this.seedMathematicsContent();

      // Seed badges
      await this.seedBadges();

      console.log("Initial data seeded successfully");
    } catch (error) {
      console.error("Error seeding initial data:", error);
    }
  }

  private async seedScienceContent(): Promise<void> {
    if (!this.db) return;

    const topics = [
      {
        id: "sci-topic-001",
        subjectId: "sci-001",
        title: "The Cell",
        description: "Understanding the basic unit of life",
        difficulty: "beginner",
        estimatedMinutes: 30,
        order: 1,
      },
      {
        id: "sci-topic-002",
        subjectId: "sci-001",
        title: "Forces and Motion",
        description: "Learn about Newton's laws and movement",
        difficulty: "beginner",
        estimatedMinutes: 45,
        order: 2,
      },
      {
        id: "sci-topic-003",
        subjectId: "sci-001",
        title: "Chemical Reactions",
        description: "Explore how substances interact and change",
        difficulty: "intermediate",
        estimatedMinutes: 40,
        order: 3,
      },
      {
        id: "sci-topic-004",
        subjectId: "sci-001",
        title: "The Solar System",
        description: "Journey through our cosmic neighborhood",
        difficulty: "beginner",
        estimatedMinutes: 35,
        order: 4,
      },
      {
        id: "sci-topic-005",
        subjectId: "sci-001",
        title: "Energy and Matter",
        description: "Understanding the building blocks of the universe",
        difficulty: "intermediate",
        estimatedMinutes: 50,
        order: 5,
      },
    ];

    for (const topic of topics) {
      await this.db.runAsync(
        `INSERT INTO topics (id, subjectId, title, description, difficulty, estimatedMinutes, displayOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          topic.id,
          topic.subjectId,
          topic.title,
          topic.description,
          topic.difficulty,
          topic.estimatedMinutes,
          topic.order,
        ],
      );

      // Add a lesson for each topic
      await this.db.runAsync(
        `INSERT INTO lessons (id, topicId, title, content, xpReward, displayOrder)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          `${topic.id}-lesson-001`,
          topic.id,
          `Introduction to ${topic.title}`,
          `This is an introduction to ${topic.title}. ${topic.description}`,
          50,
          1,
        ],
      );

      // Add a quiz for each topic
      await this.seedQuizForTopic(topic.id, topic.title, topic.difficulty);
    }
  }

  private async seedTechnologyContent(): Promise<void> {
    if (!this.db) return;

    const topics = [
      {
        id: "tech-topic-001",
        subjectId: "tech-001",
        title: "Introduction to Programming",
        description: "Learn the basics of coding and algorithms",
        difficulty: "beginner",
        estimatedMinutes: 40,
        order: 1,
      },
      {
        id: "tech-topic-002",
        subjectId: "tech-001",
        title: "How Computers Work",
        description: "Understand hardware, software, and data processing",
        difficulty: "beginner",
        estimatedMinutes: 35,
        order: 2,
      },
      {
        id: "tech-topic-003",
        subjectId: "tech-001",
        title: "Internet and Networks",
        description: "Discover how devices connect and communicate",
        difficulty: "intermediate",
        estimatedMinutes: 45,
        order: 3,
      },
      {
        id: "tech-topic-004",
        subjectId: "tech-001",
        title: "Artificial Intelligence",
        description: "Explore machine learning and smart systems",
        difficulty: "advanced",
        estimatedMinutes: 50,
        order: 4,
      },
      {
        id: "tech-topic-005",
        subjectId: "tech-001",
        title: "Digital Safety",
        description: "Learn to stay safe online and protect your data",
        difficulty: "beginner",
        estimatedMinutes: 30,
        order: 5,
      },
    ];

    for (const topic of topics) {
      await this.db.runAsync(
        `INSERT INTO topics (id, subjectId, title, description, difficulty, estimatedMinutes, displayOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          topic.id,
          topic.subjectId,
          topic.title,
          topic.description,
          topic.difficulty,
          topic.estimatedMinutes,
          topic.order,
        ],
      );

      await this.db.runAsync(
        `INSERT INTO lessons (id, topicId, title, content, xpReward, displayOrder)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          `${topic.id}-lesson-001`,
          topic.id,
          `Introduction to ${topic.title}`,
          `This is an introduction to ${topic.title}. ${topic.description}`,
          50,
          1,
        ],
      );

      await this.seedQuizForTopic(topic.id, topic.title, topic.difficulty);
    }
  }

  private async seedEngineeringContent(): Promise<void> {
    if (!this.db) return;

    const topics = [
      {
        id: "eng-topic-001",
        subjectId: "eng-001",
        title: "Simple Machines",
        description: "Levers, pulleys, and wheels that make work easier",
        difficulty: "beginner",
        estimatedMinutes: 35,
        order: 1,
      },
      {
        id: "eng-topic-002",
        subjectId: "eng-001",
        title: "Structures and Stability",
        description: "How buildings and bridges stand strong",
        difficulty: "intermediate",
        estimatedMinutes: 40,
        order: 2,
      },
      {
        id: "eng-topic-003",
        subjectId: "eng-001",
        title: "Electrical Circuits",
        description: "Understanding current, voltage, and circuits",
        difficulty: "intermediate",
        estimatedMinutes: 45,
        order: 3,
      },
      {
        id: "eng-topic-004",
        subjectId: "eng-001",
        title: "Renewable Energy",
        description: "Solar, wind, and sustainable power sources",
        difficulty: "intermediate",
        estimatedMinutes: 40,
        order: 4,
      },
      {
        id: "eng-topic-005",
        subjectId: "eng-001",
        title: "Robotics Basics",
        description: "Introduction to robots and automation",
        difficulty: "advanced",
        estimatedMinutes: 55,
        order: 5,
      },
    ];

    for (const topic of topics) {
      await this.db.runAsync(
        `INSERT INTO topics (id, subjectId, title, description, difficulty, estimatedMinutes, displayOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          topic.id,
          topic.subjectId,
          topic.title,
          topic.description,
          topic.difficulty,
          topic.estimatedMinutes,
          topic.order,
        ],
      );

      await this.db.runAsync(
        `INSERT INTO lessons (id, topicId, title, content, xpReward, displayOrder)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          `${topic.id}-lesson-001`,
          topic.id,
          `Introduction to ${topic.title}`,
          `This is an introduction to ${topic.title}. ${topic.description}`,
          50,
          1,
        ],
      );

      await this.seedQuizForTopic(topic.id, topic.title, topic.difficulty);
    }
  }

  private async seedMathematicsContent(): Promise<void> {
    if (!this.db) return;

    const topics = [
      {
        id: "math-topic-001",
        subjectId: "math-001",
        title: "Number Patterns",
        description: "Discover sequences and mathematical patterns",
        difficulty: "beginner",
        estimatedMinutes: 30,
        order: 1,
      },
      {
        id: "math-topic-002",
        subjectId: "math-001",
        title: "Fractions and Decimals",
        description: "Understanding parts of a whole",
        difficulty: "beginner",
        estimatedMinutes: 40,
        order: 2,
      },
      {
        id: "math-topic-003",
        subjectId: "math-001",
        title: "Geometry Basics",
        description: "Shapes, angles, and spatial reasoning",
        difficulty: "intermediate",
        estimatedMinutes: 45,
        order: 3,
      },
      {
        id: "math-topic-004",
        subjectId: "math-001",
        title: "Algebra Introduction",
        description: "Variables, equations, and problem solving",
        difficulty: "intermediate",
        estimatedMinutes: 50,
        order: 4,
      },
      {
        id: "math-topic-005",
        subjectId: "math-001",
        title: "Probability and Statistics",
        description: "Data analysis and chance",
        difficulty: "advanced",
        estimatedMinutes: 55,
        order: 5,
      },
    ];

    for (const topic of topics) {
      await this.db.runAsync(
        `INSERT INTO topics (id, subjectId, title, description, difficulty, estimatedMinutes, displayOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          topic.id,
          topic.subjectId,
          topic.title,
          topic.description,
          topic.difficulty,
          topic.estimatedMinutes,
          topic.order,
        ],
      );

      await this.db.runAsync(
        `INSERT INTO lessons (id, topicId, title, content, xpReward, displayOrder)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          `${topic.id}-lesson-001`,
          topic.id,
          `Introduction to ${topic.title}`,
          `This is an introduction to ${topic.title}. ${topic.description}`,
          50,
          1,
        ],
      );

      await this.seedQuizForTopic(topic.id, topic.title, topic.difficulty);
    }
  }

  private async seedQuizForTopic(
    topicId: string,
    topicTitle: string,
    difficulty: string,
  ): Promise<void> {
    if (!this.db) return;

    const quizId = `${topicId}-quiz-001`;

    await this.db.runAsync(
      `INSERT INTO quizzes (id, topicId, title, description, difficulty, totalQuestions, passingScore, xpReward)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quizId,
        topicId,
        `${topicTitle} Quiz`,
        `Test your knowledge of ${topicTitle}`,
        difficulty,
        5,
        70,
        100,
      ],
    );

    // Add sample questions
    const questions = [
      {
        id: `${quizId}-q1`,
        questionText: `What is the main concept of ${topicTitle}?`,
        options: [
          { id: "opt1", text: "Option A", isCorrect: true },
          { id: "opt2", text: "Option B", isCorrect: false },
          { id: "opt3", text: "Option C", isCorrect: false },
          { id: "opt4", text: "Option D", isCorrect: false },
        ],
        correctAnswerId: "opt1",
      },
      {
        id: `${quizId}-q2`,
        questionText: `Which of the following is related to ${topicTitle}?`,
        options: [
          { id: "opt1", text: "Choice A", isCorrect: false },
          { id: "opt2", text: "Choice B", isCorrect: true },
          { id: "opt3", text: "Choice C", isCorrect: false },
          { id: "opt4", text: "Choice D", isCorrect: false },
        ],
        correctAnswerId: "opt2",
      },
    ];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await this.db.runAsync(
        `INSERT INTO questions (id, quizId, questionText, questionType, options, correctAnswerId, difficulty, displayOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          q.id,
          quizId,
          q.questionText,
          "multiple_choice",
          JSON.stringify(q.options),
          q.correctAnswerId,
          difficulty,
          i + 1,
        ],
      );
    }
  }

  private async seedBadges(): Promise<void> {
    if (!this.db) return;

    const badges = [
      {
        id: "badge-001",
        name: "First Steps",
        description: "Complete your first lesson",
        icon: "school",
        category: "general",
        requirement: "Complete 1 lesson",
      },
      {
        id: "badge-002",
        name: "Science Star",
        description: "Master Science basics",
        icon: "science",
        category: "science",
        requirement: "Complete 5 Science lessons",
        xpRequired: 500,
      },
      {
        id: "badge-003",
        name: "Tech Wizard",
        description: "Excel in Technology",
        icon: "devices",
        category: "technology",
        requirement: "Complete 5 Technology lessons",
        xpRequired: 500,
      },
      {
        id: "badge-004",
        name: "Engineering Pro",
        description: "Build your Engineering skills",
        icon: "engineering",
        category: "engineering",
        requirement: "Complete 5 Engineering lessons",
        xpRequired: 500,
      },
      {
        id: "badge-005",
        name: "Math Master",
        description: "Conquer Mathematics",
        icon: "calculate",
        category: "mathematics",
        requirement: "Complete 5 Math lessons",
        xpRequired: 500,
      },
      {
        id: "badge-006",
        name: "Quiz Champion",
        description: "Pass 10 quizzes",
        icon: "emoji_events",
        category: "general",
        requirement: "Pass 10 quizzes",
      },
      {
        id: "badge-007",
        name: "Perfect Score",
        description: "Get 100% on any quiz",
        icon: "star",
        category: "general",
        requirement: "Score 100% on a quiz",
      },
      {
        id: "badge-008",
        name: "Week Warrior",
        description: "Maintain a 7-day streak",
        icon: "local_fire_department",
        category: "general",
        requirement: "7 day streak",
      },
    ];

    for (const badge of badges) {
      await this.db.runAsync(
        `INSERT INTO badges (id, name, description, icon, category, requirement, xpRequired)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          badge.id,
          badge.name,
          badge.description,
          badge.icon,
          badge.category,
          badge.requirement,
          badge.xpRequired || null,
        ],
      );
    }
  }

  // ==================== User Operations ====================

  async createUser(
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
  ): Promise<User> {
    if (!this.db) throw new Error("Database not initialized");

    const id = `user-${Date.now()}`;
    const now = new Date().toISOString();
    const username = userData.name.toLowerCase().replace(/\s+/g, "");

    const user: User = {
      ...userData,
      id,
      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      totalBadges: 0,
      createdAt: now,
      lastActive: now,
    };

    await this.db.runAsync(
      `INSERT INTO users (id, name, email, username, password, age, gender, educationLevel, avatarId, xp, level, currentStreak, longestStreak, totalBadges, createdAt, lastActive, theme)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.name,
        user.email || "",
        username,
        password,
        user.age,
        user.gender,
        user.educationLevel,
        user.avatarId,
        user.xp,
        user.level,
        user.currentStreak,
        user.longestStreak,
        user.totalBadges,
        user.createdAt,
        user.lastActive,
        user.theme,
      ],
    );

    // Store user credentials securely
    await SecureStore.setItemAsync("current_user_id", id);
    if (user.email) {
      // Sanitize email for SecureStore key (remove special characters)
      const sanitizedEmail = user.email.replace(/[^a-zA-Z0-9._-]/g, "_");
      await SecureStore.setItemAsync(
        `user_${sanitizedEmail}_password`,
        password,
      );
    }

    return user;
  }

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    if (!this.db) throw new Error("Database not initialized");

    const user = await this.db.getFirstAsync<any>(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email.toLowerCase(), password],
    );

    if (user) {
      await SecureStore.setItemAsync("current_user_id", user.id);
      await this.updateUser(user.id, {
        lastActive: new Date().toISOString(),
      });

      // Return typed user object with email guaranteed
      return {
        ...user,
        email: user.email || email,
      } as User;
    }

    return null;
  }

  async getUser(userId: string): Promise<User | null> {
    if (!this.db) throw new Error("Database not initialized");

    const user = await this.db.getFirstAsync<User>(
      "SELECT * FROM users WHERE id = ?",
      [userId],
    );
    return user || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updates), userId];

    await this.db.runAsync(`UPDATE users SET ${fields} WHERE id = ?`, values);
  }

  async getCurrentUser(): Promise<User | null> {
    const userId = await SecureStore.getItemAsync("current_user_id");
    if (!userId) return null;
    return this.getUser(userId);
  }

  // ==================== Subject & Topic Operations ====================

  async getAllSubjects(): Promise<Subject[]> {
    if (!this.db) throw new Error("Database not initialized");

    const subjects = await this.db.getAllAsync<Subject>(
      "SELECT * FROM subjects ORDER BY displayOrder",
    );
    return subjects;
  }

  async getTopicsBySubject(subjectId: string): Promise<Topic[]> {
    if (!this.db) throw new Error("Database not initialized");

    const topics = await this.db.getAllAsync<any>(
      "SELECT * FROM topics WHERE subjectId = ? ORDER BY displayOrder",
      [subjectId],
    );
    return topics.map((t) => ({
      ...t,
      prerequisiteTopicIds: t.prerequisiteTopicIds
        ? JSON.parse(t.prerequisiteTopicIds)
        : undefined,
    }));
  }

  async getTopic(topicId: string): Promise<Topic | null> {
    if (!this.db) throw new Error("Database not initialized");

    const topic = await this.db.getFirstAsync<any>(
      "SELECT * FROM topics WHERE id = ?",
      [topicId],
    );
    if (!topic) return null;

    return {
      ...topic,
      prerequisiteTopicIds: topic.prerequisiteTopicIds
        ? JSON.parse(topic.prerequisiteTopicIds)
        : undefined,
    };
  }

  async getLessonsByTopic(topicId: string): Promise<Lesson[]> {
    if (!this.db) throw new Error("Database not initialized");

    const lessons = await this.db.getAllAsync<Lesson>(
      "SELECT * FROM lessons WHERE topicId = ? ORDER BY displayOrder",
      [topicId],
    );
    return lessons;
  }

  async getLesson(lessonId: string): Promise<Lesson | null> {
    if (!this.db) throw new Error("Database not initialized");

    const lesson = await this.db.getFirstAsync<Lesson>(
      "SELECT * FROM lessons WHERE id = ?",
      [lessonId],
    );
    return lesson || null;
  }

  // ==================== Quiz Operations ====================

  async getQuizzesByTopic(topicId: string): Promise<Quiz[]> {
    if (!this.db) throw new Error("Database not initialized");

    const quizzes = await this.db.getAllAsync<Quiz>(
      "SELECT * FROM quizzes WHERE topicId = ?",
      [topicId],
    );
    return quizzes;
  }

  async getQuiz(quizId: string): Promise<Quiz | null> {
    if (!this.db) throw new Error("Database not initialized");

    const quiz = await this.db.getFirstAsync<Quiz>(
      "SELECT * FROM quizzes WHERE id = ?",
      [quizId],
    );
    return quiz || null;
  }

  async getQuestionsByQuiz(quizId: string): Promise<Question[]> {
    if (!this.db) throw new Error("Database not initialized");

    const questions = await this.db.getAllAsync<any>(
      "SELECT * FROM questions WHERE quizId = ? ORDER BY displayOrder",
      [quizId],
    );
    return questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options),
    }));
  }

  async saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      `INSERT INTO quiz_attempts (id, userId, quizId, score, totalQuestions, correctAnswers, timeSpentSeconds, completedAt, answers)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        attempt.id,
        attempt.userId,
        attempt.quizId,
        attempt.score,
        attempt.totalQuestions,
        attempt.correctAnswers,
        attempt.timeSpentSeconds,
        attempt.completedAt,
        JSON.stringify(attempt.answers),
      ],
    );
  }

  async getQuizAttempts(
    userId: string,
    quizId?: string,
  ): Promise<QuizAttempt[]> {
    if (!this.db) throw new Error("Database not initialized");

    const query = quizId
      ? "SELECT * FROM quiz_attempts WHERE userId = ? AND quizId = ? ORDER BY completedAt DESC"
      : "SELECT * FROM quiz_attempts WHERE userId = ? ORDER BY completedAt DESC";

    const params = quizId ? [userId, quizId] : [userId];
    const attempts = await this.db.getAllAsync<any>(query, params);
    return attempts.map((a) => ({
      ...a,
      answers: JSON.parse(a.answers),
    }));
  }

  // ==================== Progress Operations ====================

  async updateProgress(
    userId: string,
    subjectId: string,
    topicId: string,
    completionPercentage: number,
  ): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const existing = await this.db.getFirstAsync<UserProgress>(
      "SELECT * FROM user_progress WHERE userId = ? AND topicId = ?",
      [userId, topicId],
    );

    const now = new Date().toISOString();

    if (existing) {
      await this.db.runAsync(
        "UPDATE user_progress SET completionPercentage = ?, lastAccessedAt = ? WHERE userId = ? AND topicId = ?",
        [completionPercentage, now, userId, topicId],
      );
    } else {
      const id = `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await this.db.runAsync(
        `INSERT INTO user_progress (id, userId, subjectId, topicId, completionPercentage, lastAccessedAt, timeSpentMinutes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, userId, subjectId, topicId, completionPercentage, now, 0],
      );
    }
  }

  async getProgress(
    userId: string,
    subjectId?: string,
  ): Promise<UserProgress[]> {
    if (!this.db) throw new Error("Database not initialized");

    const query = subjectId
      ? "SELECT * FROM user_progress WHERE userId = ? AND subjectId = ?"
      : "SELECT * FROM user_progress WHERE userId = ?";

    const params = subjectId ? [userId, subjectId] : [userId];
    const progress = await this.db.getAllAsync<UserProgress>(query, params);
    return progress;
  }

  // ==================== Badge & Achievement Operations ====================

  async getAllBadges(): Promise<Badge[]> {
    if (!this.db) throw new Error("Database not initialized");

    const badges = await this.db.getAllAsync<Badge>("SELECT * FROM badges");
    return badges.map((b) => ({ ...b, isUnlocked: false }));
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    if (!this.db) throw new Error("Database not initialized");

    const achievements = await this.db.getAllAsync<Achievement>(
      "SELECT * FROM achievements WHERE userId = ?",
      [userId],
    );
    return achievements;
  }

  async unlockBadge(userId: string, badgeId: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const id = `achievement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    await this.db.runAsync(
      "INSERT INTO achievements (id, userId, badgeId, earnedAt, progress) VALUES (?, ?, ?, ?, ?)",
      [id, userId, badgeId, now, 100],
    );

    // Update user's total badges count
    await this.db.runAsync(
      "UPDATE users SET totalBadges = totalBadges + 1 WHERE id = ?",
      [userId],
    );
  }

  // ==================== Streak Operations ====================

  async updateStreak(userId: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const today = new Date().toISOString().split("T")[0];

    const existing = await this.db.getFirstAsync<Streak>(
      "SELECT * FROM streaks WHERE userId = ? AND date = ?",
      [userId, today],
    );

    if (!existing) {
      const id = `streak-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await this.db.runAsync(
        "INSERT INTO streaks (id, userId, date, completed, xpEarned) VALUES (?, ?, ?, ?, ?)",
        [id, userId, today, 1, 25],
      );

      // Update user's current streak
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];
      const yesterdayStreak = await this.db.getFirstAsync<Streak>(
        "SELECT * FROM streaks WHERE userId = ? AND date = ? AND completed = 1",
        [userId, yesterday],
      );

      if (yesterdayStreak) {
        await this.db.runAsync(
          "UPDATE users SET currentStreak = currentStreak + 1, longestStreak = MAX(longestStreak, currentStreak + 1) WHERE id = ?",
          [userId],
        );
      } else {
        await this.db.runAsync(
          "UPDATE users SET currentStreak = 1 WHERE id = ?",
          [userId],
        );
      }
    }
  }

  async getStreaks(userId: string, days: number = 7): Promise<Streak[]> {
    if (!this.db) throw new Error("Database not initialized");

    const streaks = await this.db.getAllAsync<Streak>(
      "SELECT * FROM streaks WHERE userId = ? ORDER BY date DESC LIMIT ?",
      [userId, days],
    );
    return streaks;
  }

  // ==================== Leaderboard Operations ====================

  async updateLeaderboard(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    // Clear existing leaderboard
    await this.db.runAsync("DELETE FROM leaderboard");

    // Fetch all users and rank them
    const users = await this.db.getAllAsync<User>(
      "SELECT * FROM users ORDER BY xp DESC",
    );

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      await this.db.runAsync(
        `INSERT INTO leaderboard (id, userId, userName, avatarId, totalXp, level, rank, weeklyXp)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `leaderboard-${user.id}`,
          user.id,
          user.name,
          user.avatarId,
          user.xp,
          user.level,
          i + 1,
          0,
        ],
      );
    }
  }

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    if (!this.db) throw new Error("Database not initialized");

    const entries = await this.db.getAllAsync<LeaderboardEntry>(
      "SELECT * FROM leaderboard ORDER BY rank ASC LIMIT ?",
      [limit],
    );
    return entries;
  }

  async getUserRank(userId: string): Promise<number> {
    if (!this.db) throw new Error("Database not initialized");

    const entry = await this.db.getFirstAsync<LeaderboardEntry>(
      "SELECT rank FROM leaderboard WHERE userId = ?",
      [userId],
    );
    return entry?.rank || 0;
  }

  // ==================== XP Operations ====================

  async addXP(userId: string, amount: number): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync("UPDATE users SET xp = xp + ? WHERE id = ?", [
      amount,
      userId,
    ]);

    // Check if user leveled up
    const user = await this.getUser(userId);
    if (user) {
      const { XP_LEVELS } = await import("../constants/theme");
      const newLevel = XP_LEVELS.findIndex((l) => user.xp < l.xpRequired);
      const level = newLevel === -1 ? XP_LEVELS.length : newLevel;

      if (level !== user.level) {
        await this.db.runAsync("UPDATE users SET level = ? WHERE id = ?", [
          level,
          userId,
        ]);
      }
    }
  }

  // ==================== Utility Operations ====================

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const tables = [
      "quiz_attempts",
      "achievements",
      "user_progress",
      "streaks",
      "leaderboard",
      "users",
    ];

    for (const table of tables) {
      await this.db.runAsync(`DELETE FROM ${table}`);
    }

    await SecureStore.deleteItemAsync("current_user_id");
  }

  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export default new DatabaseService();
