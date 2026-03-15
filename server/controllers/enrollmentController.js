const db = require("../database/db")

/* ENROLL STUDENT */

exports.enrollCourse = (req,res)=>{

 const studentId = req.user.id
 const { course_id } = req.body

 const exists = db.prepare(`
  SELECT * FROM enrollments
  WHERE student_id = ? AND course_id = ?
 `).get(studentId,course_id)

 if(exists){
  return res.json({message:"Already enrolled"})
 }

 db.prepare(`
 INSERT INTO enrollments
 (student_id,course_id)
 VALUES (?,?)
 `).run(studentId,course_id)

 res.json({message:"Enrollment successful"})
}


/* GET STUDENT COURSES */

exports.getMyCourses = (req,res)=>{

 const studentId = req.user.id

 const courses = db.prepare(`
 SELECT courses.*
 FROM enrollments
 JOIN courses ON enrollments.course_id = courses.id
 WHERE enrollments.student_id = ?
 `).all(studentId)

 res.json(courses)

}