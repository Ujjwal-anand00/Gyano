const pool = require("../database/db");

exports.getTeacherAnalytics = async (req, res) => {
  try {

    // ✅ Total Courses
    const totalCoursesResult = await pool.query(
      `SELECT COUNT(*) as total FROM courses`
    );

    // ✅ Total Lessons
    const totalLessonsResult = await pool.query(
      `SELECT COUNT(*) as total FROM lessons`
    );

    // ✅ Total Students (unique)
    const totalStudentsResult = await pool.query(
      `SELECT COUNT(DISTINCT student_id) as total FROM enrollments`
    );

    // ✅ Completed Lessons
    const completedLessonsResult = await pool.query(
      `
      SELECT COUNT(*) as total
      FROM progress
      WHERE completed = true
      `
    );

    // ✅ Course Performance
    const coursePerformanceResult = await pool.query(
      `
      SELECT 
        c.title,
        COUNT(DISTINCT e.id) as students,
        COUNT(DISTINCT l.id) as lessons
      FROM courses c
      LEFT JOIN enrollments e ON e.course_id = c.id
      LEFT JOIN lessons l ON l.course_id = c.id
      GROUP BY c.id
      `
    );

    res.json({
      totalCourses: parseInt(totalCoursesResult.rows[0].total),
      totalLessons: parseInt(totalLessonsResult.rows[0].total),
      totalStudents: parseInt(totalStudentsResult.rows[0].total),
      completedLessons: parseInt(completedLessonsResult.rows[0].total),
      coursePerformance: coursePerformanceResult.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};