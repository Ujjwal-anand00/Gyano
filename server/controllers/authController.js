const db = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

/*REGISTER */

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const existingUser = db
      .prepare(
        `
   SELECT * FROM users WHERE email = ?
  `,
      )
      .get(email);

    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.prepare(
      `
   INSERT INTO users
   (name,email,password,role)
   VALUES (?,?,?,?)
  `,
    ).run(name, email, hashedPassword, role || "student");

    res.json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error during registration",
    });
  }
};

/*LOGIN */

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db
      .prepare(
        `
   SELECT * FROM users
   WHERE email = ?
  `,
      )
      .get(email);

    if (!user) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error during login",
    });
  }
};
