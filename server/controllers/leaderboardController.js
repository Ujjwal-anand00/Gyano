const pool = require("../database/db");

exports.getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        u.name,
        COUNT(p.id) AS "completedLessons",
        (
          SELECT COUNT(*) FROM lessons
        ) AS "totalLessons"
      FROM users u
      LEFT JOIN progress p 
        ON p.student_id = u.id AND p.completed = true
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY "completedLessons" DESC
      LIMIT 10
      `
    );

    const leaderboard = result.rows;

    const finalResult = leaderboard.map((student) => {
      const totalLessons = parseInt(student.totalLessons);
      const completedLessons = parseInt(student.completedLessons);

      const progress =
        totalLessons === 0
          ? 0
          : Math.round((completedLessons / totalLessons) * 100);

      return {
        ...student,
        progress,
      };
    });

    res.json(finalResult);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};