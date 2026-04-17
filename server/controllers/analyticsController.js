const pool = require("../database/db");

exports.getStudentAnalytics = async (req, res) => {
  const studentId = req.user.id;

  try {
    // ✅ Enrolled Courses Count
    const enrolledCoursesResult = await pool.query(
      `
      SELECT COUNT(*) as total
      FROM enrollments
      WHERE student_id = $1
      `,
      [studentId]
    );

    // ✅ Completed Lessons
    const completedLessonsResult = await pool.query(
      `
      SELECT COUNT(*) as total
      FROM progress
      WHERE student_id = $1 AND completed = true
      `,
      [studentId]
    );

    // ✅ Total Lessons
    const totalLessonsResult = await pool.query(
      `
      SELECT COUNT(*) as total
      FROM lessons
      WHERE course_id IN (
        SELECT course_id FROM enrollments WHERE student_id = $1
      )
      `,
      [studentId]
    );

    // ✅ Courses Progress
    const coursesProgressResult = await pool.query(
      `
      SELECT 
        c.id,
        c.title,
        COUNT(l.id) as "totalLessons",
        COALESCE(SUM(CASE WHEN p.completed = true THEN 1 ELSE 0 END), 0) as "completedLessons"
      FROM courses c
      LEFT JOIN lessons l ON l.course_id = c.id
      LEFT JOIN progress p 
        ON p.lesson_id = l.id AND p.student_id = $1
      WHERE c.id IN (
        SELECT course_id FROM enrollments WHERE student_id = $1
      )
      GROUP BY c.id
      `,
      [studentId]
    );

    res.json({
      enrolledCourses: parseInt(enrolledCoursesResult.rows[0].total),
      totalLessons: parseInt(totalLessonsResult.rows[0].total),
      completedLessons: parseInt(completedLessonsResult.rows[0].total),
      coursesProgress: coursesProgressResult.rows,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};