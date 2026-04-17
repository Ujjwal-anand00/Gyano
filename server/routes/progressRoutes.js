const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const progressController = require("../controllers/progressController");

// ✅ Complete lesson
router.post(
  "/complete",
  authMiddleware,
  progressController.completeLesson
);

// ✅ Get progress of logged-in user (all courses)
router.get(
  "/",
  authMiddleware,
  progressController.getProgress
);

// ✅ Get progress for a specific course
router.get(
  "/course/:course_id",
  authMiddleware,
  progressController.getCourseProgress
);

module.exports = router;