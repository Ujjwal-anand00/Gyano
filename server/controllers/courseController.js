const db = require("../database/db")

exports.createCourse = (req, res) => {

  const { title, description, thumbnail } = req.body

  if (!title) {
    return res.status(400).json({ error: "Title required" })
  }

  db.prepare(`
    INSERT INTO courses
    (title, description, thumbnail)
    VALUES (?, ?, ?)
  `).run(title, description, thumbnail)

  res.json({
    message: "Course created successfully"
  })

}

exports.getCourses = (req,res)=>{

 const courses = db.prepare(`
 SELECT * FROM courses
 `).all()

 res.json(courses)

}
exports.deleteCourse = (req,res)=>{

 const id = req.params.id

 db.prepare(`
 DELETE FROM courses
 WHERE id = ?
 `).run(id)

 res.json({
  message:"Course deleted"
 })

}

exports.updateCourse = (req,res)=>{

 const id = req.params.id
 const { title, description, thumbnail } = req.body

 db.prepare(`
 UPDATE courses
 SET title = ?, description = ?, thumbnail = ?
 WHERE id = ?
 `).run(title,description,thumbnail,id)

 res.json({
  message:"Course updated"
 })

}

exports.getCourseById = (req,res)=>{

 const id = req.params.id

 const course = db.prepare(`
 SELECT * FROM courses
 WHERE id = ?
 `).get(id)

 res.json(course)

}

exports.getPopularCourses = (req, res) => {

  const courses = db.prepare(`
    SELECT courses.*, COUNT(enrollments.course_id) as students
    FROM courses
    LEFT JOIN enrollments 
    ON courses.id = enrollments.course_id
    GROUP BY courses.id
    ORDER BY students DESC
    LIMIT 3
  `).all()

  res.json(courses)
}

exports.searchCourses = (req, res) => {

  const query = req.query.query || "";

  const courses = db.prepare(`
    SELECT * FROM courses
    WHERE LOWER(title) LIKE LOWER(?)
  `).all(`%${query}%`);

  res.json(courses);
};