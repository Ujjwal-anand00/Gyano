const db = require("./db");

// USERS
db.prepare(
  `
CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT UNIQUE NOT NULL,
 password TEXT NOT NULL,
 role TEXT DEFAULT 'student',
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`,
).run();

// COURSES
db.prepare(
  `
CREATE TABLE IF NOT EXISTS courses (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 title TEXT NOT NULL,
 description TEXT,
 thumbnail TEXT,
 instructor_id INTEGER,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`,
).run();

// LESSONS
db.prepare(
  `
CREATE TABLE IF NOT EXISTS lessons (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 course_id INTEGER,
 title TEXT NOT NULL,
 subject TEXT,
 content TEXT,
 language TEXT,
 video_url TEXT,
 thumbnail TEXT,
 position INTEGER
)
`,
).run();

// QUIZ QUESTIONS
db.prepare(
  `
CREATE TABLE IF NOT EXISTS quizzes (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 lesson_id INTEGER,
 question TEXT NOT NULL,
 option1 TEXT,
 option2 TEXT,
 option3 TEXT,
 option4 TEXT,
 answer TEXT
)
`,
).run();

// STUDENT PROGRESS
db.prepare(
  `
CREATE TABLE IF NOT EXISTS progress (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 student_id INTEGER,
 lesson_id INTEGER,
 course_id INTEGER,
 completed INTEGER DEFAULT 0,
 completed_at DATETIME
)
`,
).run();

// COURSE ENROLLMENTS
db.prepare(
  `
CREATE TABLE IF NOT EXISTS enrollments (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 student_id INTEGER,
 course_id INTEGER,
 enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`,
).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS quiz_attempts (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER,
 lesson_id INTEGER,
 score INTEGER
)
`).run();

// Ai Note Taking
db.prepare(`
  CREATE TABLE IF NOT EXISTS ai_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  lesson_id INTEGER,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
  `).run();


console.log("Database initialized");
