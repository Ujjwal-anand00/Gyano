const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/authMiddleware")
const progressController = require("../controllers/progressController")


router.post("/complete", authMiddleware, progressController.completeLesson)

router.get("/:student_id/:course_id", authMiddleware, progressController.getCourseProgress)

router.get(
  "/",
  authMiddleware,
  progressController.getProgress
)
router.get("/course-progress", authMiddleware, progressController.getCourseProgress);


module.exports = router
