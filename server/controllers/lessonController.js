const db = require("../database/db");

exports.getLessons = (req, res) => {
  const lessons = db.prepare("SELECT * FROM lessons").all();

  res.json(lessons);
};

exports.createLesson = (req, res) => {
  const { course_id, title, subject, content, language, video_url, thumbnail } =
    req.body;

  db.prepare(
    `
 INSERT INTO lessons
 (course_id, title, subject, content, language, video_url, thumbnail)
 VALUES (?, ?, ?, ?, ?, ?, ?)
 `,
  ).run(course_id, title, subject, content, language, video_url, thumbnail);

  res.json({
    message: "Lesson created successfully",
  });
};
exports.getLessonsByCourse = (req, res) => {
  const courseId = req.params.courseId;

  const lessons = db
    .prepare(
      `
  SELECT * FROM lessons
  WHERE course_id = ?
 `,
    )
    .all(courseId);

  res.json(lessons);
};
exports.deleteLesson = (req, res) => {
  const id = req.params.id;

  db.prepare(
    `
 DELETE FROM lessons
 WHERE id = ?
 `,
  ).run(id);

  res.json({
    message: "Lesson deleted",
  });
};

exports.updateLesson = (req, res) => {
  const id = req.params.id;

  const { title, subject, content, video_url, thumbnail } = req.body;

  db.prepare(
    `
 UPDATE lessons
 SET
 title=?,
 subject=?,
 content=?,
 video_url=?,
 thumbnail=?
 WHERE id=?
 `,
  ).run(title, subject, content, video_url, thumbnail, id);

  res.json({
    message: "Lesson updated",
  });
};

exports.getLessonById = (req, res) => {
  const lessonId = req.params.id;
  const studentId = req.user.id;

  const lesson = db
    .prepare(
      `
 SELECT * FROM lessons
 WHERE id = ?
 `,
    )
    .get(lessonId);

  if (!lesson) {
    return res.status(404).json({
      error: "Lesson not found",
    });
  }

  const enrollment = db
    .prepare(
      `
 SELECT * FROM enrollments
 WHERE student_id = ? AND course_id = ?
 `,
    )
    .get(studentId, lesson.course_id);

  if (!enrollment) {
    return res.status(403).json({
      error: "You must enroll in this course first",
    });
  }

  res.json(lesson);
};
exports.getEnrolledLessons = (req, res) => {
  const studentId = req.user.id;

  const lessons = db
    .prepare(
      `
    SELECT lessons.*
    FROM lessons
    JOIN enrollments 
      ON lessons.course_id = enrollments.course_id
    WHERE enrollments.student_id = ?
  `,
    )
    .all(studentId);

  res.json(lessons);
};
exports.uploadLessonVideo = (req,res)=>{

 try{

  const {title,course_id,subject,content} = req.body

  const videoUrl = req.files.video
   ? req.files.video[0].path
   : null

  const thumbnailUrl = req.files.thumbnail
   ? req.files.thumbnail[0].path
   : null

  db.prepare(`
   INSERT INTO lessons
   (title,subject,content,video_url,thumbnail,course_id)
   VALUES (?,?,?,?,?,?)
  `).run(
   title,
   subject,
   content,
   videoUrl,
   thumbnailUrl,
   course_id
  )

  res.json({
   message:"Lesson created successfully",
   videoUrl,
   thumbnailUrl
  })

 }catch(err){

  res.status(500).json({
   error:err.message
  })

 }

}
