const db = require("../database/db"); 

const saveNote = (req, res) => {
  try {
    const { user_id, lesson_id, content } = req.body;

    const stmt = db.prepare(`
      INSERT INTO ai_notes (user_id, lesson_id, content)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(user_id, lesson_id, content);

      res.json({
        success: true,
        message: "Note saved",
        noteId: result.lastInsertRowid,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

const getNotes = (req, res) => {
  try {
    const { user_id } = req.params;

    const stmt = db.prepare(`
      SELECT * FROM ai_notes
      WHERE user_id = ?
      ORDER BY created_at DESC
    `);

    const notes = stmt.all(user_id);

    res.json({ success: true, notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

const deleteNote = (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare(`
      DELETE FROM ai_notes WHERE id = ?
    `);

    stmt.run(id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

module.exports = { saveNote, getNotes, deleteNote };