const pool = require("../database/db");

exports.search = async (req, res) => {
  try {
    const keyword = String(req.query.q || "").trim();

    if (!keyword) {
      return res.json({ courses: [], lessons: [] });
    }

    const searchTerm = `%${keyword}%`;

    const [coursesResult, lessonsResult] = await Promise.all([
      pool.query(
        `
        SELECT id, title, description, thumbnail, instructor_id, created_at
        FROM courses
        WHERE title ILIKE $1
           OR description ILIKE $1
        ORDER BY created_at DESC
        LIMIT 5
        `,
        [searchTerm]
      ),
      pool.query(
        `
        SELECT id, course_id, title, subject, thumbnail, position, created_at
        FROM lessons
        WHERE title ILIKE $1
        ORDER BY created_at DESC
        LIMIT 5
        `,
        [searchTerm]
      ),
    ]);

    return res.json({
      courses: coursesResult.rows,
      lessons: lessonsResult.rows,
    });
  } catch (err) {
    console.error("Search Error:", err);
    return res.status(500).json({ error: "Server error during search" });
  }
};
