const pool = require("../database/db");

/* 🔧 Helper: Validate ID */
const validateId = (id) => {
  const parsed = parseInt(id);
  return isNaN(parsed) ? null : parsed;
};


/* ✅ Create Course */
exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title required" });
    }

    const result = await pool.query(
      `
      INSERT INTO courses (title, description, thumbnail)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [title, description || null, thumbnail || null]
    );

    res.json({
      message: "Course created successfully",
      course: result.rows[0],
    });

  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


/* ✅ Get All Courses (with pagination) */
exports.getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `
      SELECT * FROM courses
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Get Courses Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


/* ✅ Delete Course */
exports.deleteCourse = async (req, res) => {
  try {
    const id = validateId(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const result = await pool.query(
      `
      DELETE FROM courses
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course deleted" });

  } catch (error) {
    console.error("Delete Course Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


/* ✅ Update Course */
exports.updateCourse = async (req, res) => {
  try {
    const id = validateId(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const { title, description, thumbnail } = req.body;

    const result = await pool.query(
      `
      UPDATE courses
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        thumbnail = COALESCE($3, thumbnail)
      WHERE id = $4
      RETURNING *
      `,
      [title, description, thumbnail, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({
      message: "Course updated",
      course: result.rows[0],
    });

  } catch (error) {
    console.error("Update Course Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


/* ✅ Get Course By ID */
exports.getCourseById = async (req, res) => {
  try {
    const id = validateId(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const result = await pool.query(
      `
      SELECT * FROM courses WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Get Course Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


/* ✅ Get Popular Courses */
exports.getPopularCourses = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT c.*, COUNT(e.id) AS students
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      GROUP BY c.id
      ORDER BY students DESC
      LIMIT 3
      `
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Popular Courses Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


/* ✅ Search Courses */
exports.searchCourses = async (req, res) => {
  try {
    const query = req.query.query || "";

    const result = await pool.query(
      `
      SELECT * FROM courses
      WHERE title ILIKE $1
      `,
      [`%${query}%`]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Search Courses Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};