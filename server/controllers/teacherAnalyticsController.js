const db = require("../database/db")

exports.getTeacherAnalytics = (req,res)=>{

  try{

    const totalCourses = db.prepare(`
      SELECT COUNT(*) as total
      FROM courses
    `).get()

    const totalLessons = db.prepare(`
      SELECT COUNT(*) as total
      FROM lessons
    `).get()

    const totalStudents = db.prepare(`
      SELECT COUNT(DISTINCT student_id) as total
      FROM enrollments
    `).get()

    const completedLessons = db.prepare(`
      SELECT COUNT(*) as total
      FROM progress
      WHERE completed = 1
    `).get()

    const coursePerformance = db.prepare(`
      SELECT 
        c.title,
        COUNT(e.id) as students,
        COUNT(l.id) as lessons
      FROM courses c
      LEFT JOIN enrollments e ON e.course_id = c.id
      LEFT JOIN lessons l ON l.course_id = c.id
      GROUP BY c.id
    `).all()

    res.json({
      totalCourses: totalCourses.total,
      totalLessons: totalLessons.total,
      totalStudents: totalStudents.total,
      completedLessons: completedLessons.total,
      coursePerformance
    })

  }catch(err){

    res.status(500).json({error:err.message})

  }

}
