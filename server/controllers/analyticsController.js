const db = require("../database/db")

exports.getStudentAnalytics = (req, res) => {
  const studentId = req.user.id

  try {

    const enrolledCourses = db.prepare(`
      SELECT COUNT(*) as total
      FROM enrollments
      WHERE student_id = ?
    `).get(studentId)

    const completedLessons = db.prepare(`
      SELECT COUNT(*) as total
      FROM progress
      WHERE student_id = ? AND completed = 1
    `).get(studentId)

    const totalLessons = db.prepare(`
      SELECT COUNT(*) as total
      FROM lessons
      WHERE course_id IN (
        SELECT course_id FROM enrollments WHERE student_id = ?
      )
    `).get(studentId)

    const coursesProgress = db.prepare(`
      SELECT 
        c.id,
        c.title,
        COUNT(l.id) as totalLessons,
        SUM(CASE WHEN p.completed = 1 THEN 1 ELSE 0 END) as completedLessons
      FROM courses c
      LEFT JOIN lessons l ON l.course_id = c.id
      LEFT JOIN progress p 
      ON p.lesson_id = l.id AND p.student_id = ?
      WHERE c.id IN (
        SELECT course_id FROM enrollments WHERE student_id = ?
      )
      GROUP BY c.id
    `).all(studentId, studentId)

    res.json({
      enrolledCourses: enrolledCourses.total,
      totalLessons: totalLessons.total,
      completedLessons: completedLessons.total,
      coursesProgress
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
