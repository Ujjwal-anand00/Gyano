const pool = require("../database/db");

// ✅ Get all lessons
exports.getLessons = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM lessons");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create lesson
exports.createLesson = async (req, res) => {
  try {
    const { course_id, title, subject, content, language, video_url, thumbnail } =
      req.body;

    await pool.query(
      `
      INSERT INTO lessons
      (course_id, title, subject, content, language, video_url, thumbnail)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [course_id, title, subject, content, language, video_url, thumbnail]
    );

    res.json({ message: "Lesson created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get lessons by course
exports.getLessonsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const result = await pool.query(
      `
      SELECT * FROM lessons
      WHERE course_id = $1
      `,
      [courseId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete lesson
exports.deleteLesson = async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query(
      `
      DELETE FROM lessons
      WHERE id = $1
      `,
      [id]
    );

    res.json({ message: "Lesson deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update lesson
exports.updateLesson = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, subject, content, video_url, thumbnail } = req.body;

    await pool.query(
      `
      UPDATE lessons
      SET title = $1,
          subject = $2,
          content = $3,
          video_url = $4,
          thumbnail = $5
      WHERE id = $6
      `,
      [title, subject, content, video_url, thumbnail, id]
    );

    res.json({ message: "Lesson updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get lesson by ID (with enrollment check)
exports.getLessonById = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const studentId = req.user.id;

    const lessonResult = await pool.query(
      `
      SELECT * FROM lessons
      WHERE id = $1
      `,
      [lessonId]
    );

    const lesson = lessonResult.rows[0];

    if (!lesson) {
      return res.status(404).json({
        error: "Lesson not found",
      });
    }

    const enrollmentResult = await pool.query(
      `
      SELECT * FROM enrollments
      WHERE student_id = $1 AND course_id = $2
      `,
      [studentId, lesson.course_id]
    );

    if (enrollmentResult.rows.length === 0) {
      return res.status(403).json({
        error: "You must enroll in this course first",
      });
    }

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all lessons user is enrolled in
exports.getEnrolledLessons = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(
      `
      SELECT lessons.*
      FROM lessons
      JOIN enrollments 
        ON lessons.course_id = enrollments.course_id
      WHERE enrollments.student_id = $1
      `,
      [studentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Upload lesson with video
exports.uploadLessonVideo = async (req, res) => {
  try {
    const { title, course_id, subject, content } = req.body;

    const videoUrl = req.files?.video
      ? req.files.video[0].path
      : null;

    const thumbnailUrl = req.files?.thumbnail
      ? req.files.thumbnail[0].path
      : null;

    await pool.query(
      `
      INSERT INTO lessons
      (title, subject, content, video_url, thumbnail, course_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [title, subject, content, videoUrl, thumbnailUrl, course_id]
    );

    res.json({
      message: "Lesson created successfully",
      videoUrl,
      thumbnailUrl,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};