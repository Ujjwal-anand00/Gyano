const db = require("../database/db")

// Mark lesson as completed
exports.completeLesson = (req, res) => {

  try {

    const student_id = req.user.id
    const { lesson_id } = req.body

    const lesson = db.prepare(`
      SELECT course_id FROM lessons
      WHERE id = ?
    `).get(lesson_id)

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" })
    }

    const course_id = lesson.course_id

    const existing = db.prepare(`
      SELECT * FROM progress
      WHERE student_id = ? AND lesson_id = ?
    `).get(student_id, lesson_id)

    if (existing) {

      db.prepare(`
        UPDATE progress
        SET completed = 1, completed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(existing.id)

    } else {

      db.prepare(`
        INSERT INTO progress (student_id, lesson_id, course_id, completed, completed_at)
        VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
      `).run(student_id, lesson_id, course_id)

    }

    res.json({ message: "Lesson completed successfully" })

  } catch (error) {

    console.log(error)

    res.status(500).json({ error: error.message })

  }
}


// Get course progress
exports.getCourseProgress = (req, res) => {

  const { student_id, course_id } = req.params

  try {

    const totalLessons = db.prepare(`
      SELECT COUNT(*) as total
      FROM lessons
      WHERE course_id = ?
    `).get(course_id)

    const completedLessons = db.prepare(`
      SELECT COUNT(*) as completed
      FROM progress
      WHERE student_id = ? AND course_id = ? AND completed = 1
    `).get(student_id, course_id)

    const progress = totalLessons.total === 0
      ? 0
      : Math.round((completedLessons.completed / totalLessons.total) * 100)

    res.json({
      totalLessons: totalLessons.total,
      completedLessons: completedLessons.completed,
      progress
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getProgress = (req, res) => {

  const studentId = req.user.id;

  try {

    // Lesson progress
    const lessons = db.prepare(`
      SELECT lesson_id, score
      FROM progress
      WHERE student_id = ? AND completed = 1
    `).all(studentId);

    // Course progress
    const courses = db.prepare(`
      SELECT 
        courses.id as course_id,
        courses.title,
        ROUND(
          COUNT(progress.lesson_id) * 100.0 /
          (SELECT COUNT(*) FROM lessons WHERE lessons.course_id = courses.id),
          0
        ) as progress
      FROM courses
      JOIN lessons ON lessons.course_id = courses.id
      LEFT JOIN progress 
        ON progress.lesson_id = lessons.id
        AND progress.student_id = ?
        AND progress.completed = 1
      GROUP BY courses.id
    `).all(studentId);

    res.json({
      lessons,
      courses
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ error: error.message });

  }

}


exports.saveProgress = (req, res) => {

  const studentId = req.user.id;
  const { lesson_id, score } = req.body;

  const lesson = db.prepare(`
    SELECT course_id FROM lessons
    WHERE id = ?
  `).get(lesson_id);

  const course_id = lesson.course_id;

  const existing = db.prepare(`
    SELECT * FROM progress
    WHERE student_id = ? AND lesson_id = ?
  `).get(studentId, lesson_id);

  if (existing) {

    db.prepare(`
      UPDATE progress
      SET score = ?, completed = 1, completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(score, existing.id);

  } else {

    db.prepare(`
      INSERT INTO progress (student_id, lesson_id, course_id, score, completed, completed_at)
      VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
    `).run(studentId, lesson_id, course_id, score);

  }

  res.json({
    message: "Progress saved"
  });

};

exports.getCourseProgress = (req, res) => {

  const studentId = req.user.id;

  try {

    // total lessons in platform
    const totalLessons = db.prepare(`
      SELECT COUNT(*) as total
      FROM lessons
    `).get();

    // completed lessons by this student
    const completedLessons = db.prepare(`
      SELECT COUNT(*) as completed
      FROM progress
      WHERE student_id = ?
      AND completed = 1
    `).get(studentId);

    const total = totalLessons.total;
    const completed = completedLessons.completed;

    const percentage = total
      ? Math.round((completed / total) * 100)
      : 0;

    res.json({
      totalLessons: total,
      completedLessons: completed,
      progress: percentage
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ error: error.message });

  }

};