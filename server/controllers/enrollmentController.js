const pool = require("../database/db");

/* ENROLL STUDENT */
exports.enrollCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { course_id } = req.body;

    // ✅ Check if already enrolled
    const exists = await pool.query(
      `
      SELECT * FROM enrollments
      WHERE student_id = $1 AND course_id = $2
      `,
      [studentId, course_id]
    );

    if (exists.rows.length > 0) {
      return res.json({ message: "Already enrolled" });
    }

    // ✅ Insert enrollment
    await pool.query(
      `
      INSERT INTO enrollments (student_id, course_id)
      VALUES ($1, $2)
      `,
      [studentId, course_id]
    );

    res.json({ message: "Enrollment successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


/* GET STUDENT COURSES */
exports.getMyCourses = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(
      `
      SELECT courses.*
      FROM enrollments
      JOIN courses ON enrollments.course_id = courses.id
      WHERE enrollments.student_id = $1
      `,
      [studentId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};