const pool = require("../database/db");

/* ✅ Create Quiz */
exports.createQuiz = async (req, res) => {
  try {
    const { lesson_id, question, option1, option2, option3, option4, answer } = req.body;

    await pool.query(
      `
      INSERT INTO quizzes
      (lesson_id, question, option1, option2, option3, option4, answer)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [lesson_id, question, option1, option2, option3, option4, answer]
    );

    res.json({ message: "Quiz created" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* ✅ Get All Quizzes */
exports.getQuizzes = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM quizzes`);
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* ✅ Delete Quiz */
exports.deleteQuiz = async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query(
      `DELETE FROM quizzes WHERE id = $1`,
      [id]
    );

    res.json({ message: "Quiz deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* ✅ Get Quiz By Lesson */
exports.getQuizByLesson = async (req, res) => {
  try {
    const lessonId = req.params.lessonId;

    const result = await pool.query(
      `
      SELECT * FROM quizzes
      WHERE lesson_id = $1
      `,
      [lessonId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* ✅ Submit Quiz */
exports.submitQuiz = async (req, res) => {
  try {
    const { user_id, lesson_id, score } = req.body;

    await pool.query(
      `
      INSERT INTO quiz_attempts (user_id, lesson_id, score)
      VALUES ($1, $2, $3)
      `,
      [user_id, lesson_id, score]
    );

    res.json({ message: "Quiz submitted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* ✅ Get Quiz Stats */
exports.getQuizStats = async (req, res) => {
  try {
    const userId = req.params.userId;

    const result = await pool.query(
      `
      SELECT 
        COUNT(*) as "quizzesTaken",
        AVG(score) as "avgScore"
      FROM quiz_attempts
      WHERE user_id = $1
      `,
      [userId]
    );

    const data = result.rows[0];

    res.json({
      quizzesTaken: parseInt(data.quizzesTaken) || 0,
      avgScore: Math.round(data.avgScore || 0),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* ✅ Get Quiz Attempts */
exports.getQuizAttempts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const result = await pool.query(
      `
      SELECT lesson_id, score
      FROM quiz_attempts
      WHERE user_id = $1
      ORDER BY id ASC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};