const pool = require("../database/db");

// ✅ Save Note
const saveNote = async (req, res) => {
  try {
    const { user_id, lesson_id, content } = req.body;

    const result = await pool.query(
      `
      INSERT INTO ai_notes (user_id, lesson_id, content)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [user_id, lesson_id, content]
    );

    res.json({
      success: true,
      message: "Note saved",
      noteId: result.rows[0].id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

// ✅ Get Notes
const getNotes = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      `
      SELECT * FROM ai_notes
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [user_id]
    );

    res.json({ success: true, notes: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

// ✅ Delete Note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM ai_notes WHERE id = $1
      `,
      [id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

module.exports = { saveNote, getNotes, deleteNote };