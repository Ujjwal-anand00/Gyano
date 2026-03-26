const express = require("express");
const router = express.Router();

const { saveNote , getNotes, deleteNote } = require("../controllers/aiNoteController");

router.post("/save", saveNote);
router.get("/:user_id", getNotes);
router.delete("/:id", deleteNote);

module.exports = router;