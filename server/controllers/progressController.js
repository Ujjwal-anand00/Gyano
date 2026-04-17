const pool = require("../database/db");

/* ✅ Mark Lesson as Completed */
exports.completeLesson = async (req, res) => {
  try {
    const student_id = req.user.id;
    const { lesson_id } = req.body;

    // Get course_id
    const lessonResult = await pool.query(
      `SELECT course_id FROM lessons WHERE id = $1`,
      [lesson_id]
    );

    const lesson = lessonResult.rows[0];

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const course_id = lesson.course_id;

    // Check existing progress
    const existing = await pool.query(
      `SELECT * FROM progress WHERE student_id = $1 AND lesson_id = $2`,
      [student_id, lesson_id]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `
        UPDATE progress
        SET completed = true, completed_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [existing.rows[0].id]
      );
    } else {
      await pool.query(
        `
        INSERT INTO progress (student_id, lesson_id, course_id, completed, completed_at)
        VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP)
        `,
        [student_id, lesson_id, course_id]
      );
    }

    res.json({ message: "Lesson completed successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* ✅ Get Course Progress (specific course) */
exports.getCourseProgress = async (req, res) => {
  try {
    const student_id = req.user.id;
    const course_id = parseInt(req.params.course_id);

    if (isNaN(course_id)) {
      return res.status(400).json({
        error: "Invalid course ID",
      });
    }

    const totalLessonsResult = await pool.query(
      `SELECT COUNT(*) as total FROM lessons WHERE course_id = $1`,
      [course_id]
    );

    const completedLessonsResult = await pool.query(
      `
      SELECT COUNT(*) as completed
      FROM progress
      WHERE student_id = $1 AND course_id = $2 AND completed = true
      `,
      [student_id, course_id]
    );

    const total = parseInt(totalLessonsResult.rows[0].total);
    const completed = parseInt(completedLessonsResult.rows[0].completed);

    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    res.json({
      totalLessons: total,
      completedLessons: completed,
      progress,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* ✅ Get Full Progress (Lessons + Courses) */
exports.getProgress = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Lesson progress
    const lessonsResult = await pool.query(
      `
      SELECT lesson_id, score
      FROM progress
      WHERE student_id = $1 AND completed = true
      `,
      [studentId]
    );

    // Course progress
    const coursesResult = await pool.query(
      `
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
        AND progress.student_id = $1
        AND progress.completed = true
      GROUP BY courses.id
      `,
      [studentId]
    );

    res.json({
      lessons: lessonsResult.rows,
      courses: coursesResult.rows,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* ✅ Save Progress (with score) */
exports.saveProgress = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { lesson_id, score } = req.body;

    const lessonResult = await pool.query(
      `SELECT course_id FROM lessons WHERE id = $1`,
      [lesson_id]
    );

    const lesson = lessonResult.rows[0];
    const course_id = lesson.course_id;

    const existing = await pool.query(
      `SELECT * FROM progress WHERE student_id = $1 AND lesson_id = $2`,
      [studentId, lesson_id]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `
        UPDATE progress
        SET score = $1, completed = true, completed_at = CURRENT_TIMESTAMP
        WHERE id = $2
        `,
        [score, existing.rows[0].id]
      );
    } else {
      await pool.query(
        `
        INSERT INTO progress (student_id, lesson_id, course_id, score, completed, completed_at)
        VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP)
        `,
        [studentId, lesson_id, course_id, score]
      );
    }

    res.json({ message: "Progress saved" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* ✅ Overall Platform Progress */
exports.getOverallProgress = async (req, res) => {
  try {
    const studentId = req.user.id;

    const totalLessonsResult = await pool.query(
      `SELECT COUNT(*) as total FROM lessons`
    );

    const completedLessonsResult = await pool.query(
      `
      SELECT COUNT(*) as completed
      FROM progress
      WHERE student_id = $1 AND completed = true
      `,
      [studentId]
    );

    const total = parseInt(totalLessonsResult.rows[0].total);
    const completed = parseInt(completedLessonsResult.rows[0].completed);

    const percentage = total ? Math.round((completed / total) * 100) : 0;

    res.json({
      totalLessons: total,
      completedLessons: completed,
      progress: percentage,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};