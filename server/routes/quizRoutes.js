const express = require("express")
const router = express.Router()

const quizController = require("../controllers/quizController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/", authMiddleware, quizController.createQuiz)
router.get("/", authMiddleware, quizController.getQuizzes)
router.delete("/:id", authMiddleware, quizController.deleteQuiz)

router.get("/lesson/:lessonId", quizController.getQuizByLesson)

router.post("/submit", quizController.submitQuiz)
router.get("/stats/:userId", quizController.getQuizStats)
router.get("/attempts/:userId", quizController.getQuizAttempts)

module.exports = router