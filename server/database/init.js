const pool = require("./db");

const initDB = async () => {
  try {
    await pool.query(`

    -- USERS
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'student',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- COURSES
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      thumbnail TEXT,
      instructor_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- LESSONS
    CREATE TABLE IF NOT EXISTS lessons (
      id SERIAL PRIMARY KEY,
      course_id INTEGER,
      title TEXT NOT NULL,
      subject TEXT,
      content TEXT,
      language TEXT,
      video_url TEXT,
      thumbnail TEXT,
      position INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- QUIZZES
    CREATE TABLE IF NOT EXISTS quizzes (
      id SERIAL PRIMARY KEY,
      lesson_id INTEGER,
      question TEXT NOT NULL,
      option1 TEXT,
      option2 TEXT,
      option3 TEXT,
      option4 TEXT,
      answer TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- PROGRESS
    CREATE TABLE IF NOT EXISTS progress (
      id SERIAL PRIMARY KEY,
      student_id INTEGER,
      lesson_id INTEGER,
      course_id INTEGER,
      score INTEGER,
      completed BOOLEAN DEFAULT false,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- ENROLLMENTS
    CREATE TABLE IF NOT EXISTS enrollments (
      id SERIAL PRIMARY KEY,
      student_id INTEGER,
      course_id INTEGER,
      enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (student_id, course_id)
    );

    -- QUIZ ATTEMPTS
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      lesson_id INTEGER,
      score INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- AI NOTES
    CREATE TABLE IF NOT EXISTS ai_notes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      lesson_id INTEGER,
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    `);

    console.log("✅ PostgreSQL tables created successfully");

  } catch (err) {
    console.error("❌ DB Init Error:", err);
  }
};

module.exports = initDB;