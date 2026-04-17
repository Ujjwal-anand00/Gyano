const pool = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/* REGISTER */
exports.register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // ✅ Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // ✅ Clean input
    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    // ✅ Password validation
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    // ✅ Role validation (SAFE)
    const allowedRoles = ["student", "teacher"];

    if (!allowedRoles.includes(role)) {
      role = "student"; // fallback
    }

    // 🚨 Never allow admin creation via API
    if (role === "admin") {
      role = "student";
    }

    // ✅ Check existing user
    const existingUser = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert user
    const result = await pool.query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role
      `,
      [name, email, hashedPassword, role]
    );

    res.json({
      message: "User registered successfully",
      user: result.rows[0],
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      error: "Server error during registration",
    });
  }
};


/* LOGIN */
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required",
      });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    // ✅ Fetch user
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // ✅ Compare password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      error: "Server error during login",
    });
  }
};