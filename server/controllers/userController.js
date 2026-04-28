const pool = require("../database/db");

const selectSafeUser = `
  SELECT id, name, email, role, phone, bio, profile_pic, skills, created_at
  FROM users
`;

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `${selectSafeUser} WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Get Profile Error:", err);
    return res.status(500).json({ error: "Server error while loading profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, bio, profile_pic, skills } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const safeSkills = Array.isArray(skills)
      ? skills.map((skill) => String(skill).trim()).filter(Boolean)
      : [];

    const result = await pool.query(
      `
      UPDATE users
      SET name = $1,
          phone = $2,
          bio = $3,
          profile_pic = $4,
          skills = $5
      WHERE id = $6
      RETURNING id, name, email, role, phone, bio, profile_pic, skills, created_at
      `,
      [
        String(name).trim(),
        phone ? String(phone).trim() : null,
        bio ? String(bio).trim() : null,
        profile_pic ? String(profile_pic).trim() : null,
        safeSkills,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({ error: "Server error while updating profile" });
  }
};
