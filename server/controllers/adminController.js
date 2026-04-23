const bcrypt = require("bcryptjs");
const pool = require("../database/db");

exports.createTeacher = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const existingUser = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (name, email, password, role, created_by)
      VALUES ($1, $2, $3, 'teacher', $4)
      RETURNING id, name, email, role, created_by
      `,
      [name, email, hashedPassword, req.user.id]
    );

    return res.status(201).json({
      message: "Teacher account created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Create Teacher Error:", error);
    return res.status(500).json({
      error: "Server error while creating teacher account",
    });
  }
};
