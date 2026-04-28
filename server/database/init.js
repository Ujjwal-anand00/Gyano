const bcrypt = require("bcryptjs");
const pool = require("./db");

const seedAdminUser = async () => {
  const adminName = process.env.ADMIN_NAME || "Gyano Admin";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@gyano.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await pool.query(
    `
    INSERT INTO users (name, email, password, role, created_by)
    VALUES ($1, $2, $3, 'admin', NULL)
    ON CONFLICT (email)
    DO UPDATE SET
      name = EXCLUDED.name,
      password = EXCLUDED.password,
      role = 'admin',
      created_by = NULL
    `,
    [adminName, adminEmail, hashedPassword]
  );
};

const initDB = async () => {
  try {
    await pool.query(`

    -- USERS
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE SET NULL;

    ALTER TABLE users
    ALTER COLUMN role SET DEFAULT 'student';

    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS phone VARCHAR(15);

    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS bio TEXT;

    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS profile_pic TEXT;

    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_role_check'
      ) THEN
        ALTER TABLE users
        ADD CONSTRAINT users_role_check
        CHECK (role IN ('admin', 'teacher', 'student'));
      END IF;
    END $$;

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

    CREATE INDEX IF NOT EXISTS idx_courses_title
    ON courses USING gin(to_tsvector('english', COALESCE(title, '')));

    CREATE INDEX IF NOT EXISTS idx_lessons_title
    ON lessons USING gin(to_tsvector('english', COALESCE(title, '')));

    `);

    await seedAdminUser();

    console.log("PostgreSQL tables created successfully");
    console.log("Admin user seeded successfully");
  } catch (err) {
    console.error("DB Init Error:", err);
  }
};

module.exports = initDB;
